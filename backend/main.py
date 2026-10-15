from __future__ import annotations

import os
import re
import sqlite3
from contextlib import closing
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Annotated

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field, field_validator


BASE_DIR = Path(__file__).resolve().parent
DATABASE_PATH = Path(os.getenv("DATABASE_PATH", BASE_DIR / "database.db"))
SPAM_LOCK = timedelta(minutes=10)

# Accept common local Next.js origins. Additional origins can be supplied as a
# comma-separated FRONTEND_ORIGINS environment variable for other deployments.
DEFAULT_FRONTEND_ORIGINS = "http://localhost:3000,http://127.0.0.1:3000"
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("FRONTEND_ORIGINS", DEFAULT_FRONTEND_ORIGINS).split(",")
    if origin.strip()
]

app = FastAPI(
    title="Кварта Кофе API",
    description="API для приёма заявок кофейной мастерской «Кварта». ",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DATABASE_PATH, timeout=10)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database() -> None:
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    with closing(get_connection()) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                interest TEXT NOT NULL,
                comment TEXT NOT NULL DEFAULT '',
                utm_source TEXT,
                utm_medium TEXT,
                utm_campaign TEXT,
                utm_content TEXT,
                utm_term TEXT,
                referrer TEXT,
                ip_address TEXT,
                status TEXT NOT NULL DEFAULT 'new',
                created_at TIMESTAMP NOT NULL
            )
            """
        )
        connection.execute(
            "CREATE INDEX IF NOT EXISTS idx_leads_phone_created_at "
            "ON leads (phone, created_at)"
        )
        connection.commit()


@app.on_event("startup")
def on_startup() -> None:
    initialize_database()


class LeadRequest(BaseModel):
    """Lead payload; accepts both flat UTM fields and the frontend's nested `utm`."""

    model_config = ConfigDict(extra="ignore")

    name: Annotated[str, Field(min_length=1, max_length=120)]
    phone: Annotated[str, Field(min_length=7, max_length=32)]
    topic: Annotated[str | None, Field(max_length=120)] = None
    interest: Annotated[str, Field(min_length=1, max_length=120)] = "single_order"
    comment: Annotated[str, Field(max_length=2000)] = ""

    utm: dict[str, str | None] = Field(default_factory=dict)
    utm_source: Annotated[str | None, Field(max_length=300)] = None
    utm_medium: Annotated[str | None, Field(max_length=300)] = None
    utm_campaign: Annotated[str | None, Field(max_length=300)] = None
    utm_content: Annotated[str | None, Field(max_length=300)] = None
    utm_term: Annotated[str | None, Field(max_length=300)] = None
    referrer: Annotated[str | None, Field(max_length=2000)] = None
    page_url: Annotated[str | None, Field(max_length=2000)] = None
    ip_address: Annotated[str | None, Field(max_length=64)] = None
    timestamp: datetime | None = None

    @field_validator("name", "interest", "topic", "comment", mode="before")
    @classmethod
    def trim_text(cls, value: object) -> object:
        return value.strip() if isinstance(value, str) else value

    @field_validator("name")
    @classmethod
    def name_is_not_blank(cls, value: str) -> str:
        if not value:
            raise ValueError("Укажите ваше имя")
        return value

    @field_validator("interest")
    @classmethod
    def set_interest_from_topic(cls, value: str, info) -> str:
        topic = info.data.get("topic")
        return topic or value

    @field_validator("phone")
    @classmethod
    def validate_belarusian_phone(cls, value: str) -> str:
        digits = re.sub(r"\D", "", value)
        if not re.fullmatch(r"375(?:1[5-7]|2[1-9]|33|44)\d{7}", digits):
            raise ValueError("Укажите корректный белорусский номер в формате +375 XX XXX-XX-XX")
        return f"+{digits}"


class LeadResponse(BaseModel):
    success: bool = True
    message: str
    lead_id: int


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/lead", response_model=LeadResponse, status_code=status.HTTP_200_OK)
def create_lead(payload: LeadRequest, request: Request) -> LeadResponse:
    initialize_database()

    now = datetime.now(timezone.utc)
    cutoff = (now - SPAM_LOCK).isoformat()
    created_at = now.isoformat()
    utm = payload.utm

    # BEGIN IMMEDIATE serializes concurrent submissions, so two requests for
    # the same phone cannot both pass the duplicate check at once.
    with closing(get_connection()) as connection:
        try:
            connection.execute("BEGIN IMMEDIATE")
            recent_lead = connection.execute(
                "SELECT id FROM leads WHERE phone = ? AND created_at >= ? LIMIT 1",
                (payload.phone, cutoff),
            ).fetchone()
            if recent_lead:
                connection.rollback()
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Заявка уже отправлена, ожидайте звонка",
                )

            cursor = connection.execute(
                """
                INSERT INTO leads (
                    name, phone, interest, comment,
                    utm_source, utm_medium, utm_campaign, utm_content, utm_term,
                    referrer, ip_address, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)
                """,
                (
                    payload.name,
                    payload.phone,
                    payload.topic or payload.interest,
                    payload.comment,
                    payload.utm_source or utm.get("utm_source"),
                    payload.utm_medium or utm.get("utm_medium"),
                    payload.utm_campaign or utm.get("utm_campaign"),
                    payload.utm_content or utm.get("utm_content"),
                    payload.utm_term or utm.get("utm_term"),
                    payload.referrer or utm.get("referrer") or payload.page_url,
                    request.client.host if request.client else payload.ip_address,
                    created_at,
                ),
            )
            connection.commit()
            lead_id = int(cursor.lastrowid)
        except HTTPException:
            raise
        except sqlite3.Error as error:
            connection.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Не удалось сохранить заявку. Попробуйте позже.",
            ) from error

    return LeadResponse(
        message="Заявка принята. Мы скоро свяжемся с вами.",
        lead_id=lead_id,
    )
