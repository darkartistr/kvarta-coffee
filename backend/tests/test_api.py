from contextlib import closing

import pytest
from fastapi.testclient import TestClient

from backend import main


@pytest.fixture
def client(tmp_path, monkeypatch):
    """Give each test its own SQLite database instead of touching the app DB."""
    monkeypatch.setattr(main, "DATABASE_PATH", tmp_path / "test_leads.db")
    with TestClient(main.app) as test_client:
        yield test_client


def test_create_lead_saves_valid_submission_and_utm(client):
    response = client.post(
        "/api/lead",
        json={
            "name": "Анна",
            "phone": "+375 (29) 123-45-67",
            "interest": "subscription",
            "comment": "Две пачки в месяц",
            "utm": {
                "utm_source": "instagram",
                "utm_medium": "social",
                "utm_campaign": "autumn-coffee",
                "utm_content": "story-1",
                "utm_term": "свежий кофе",
                "referrer": "https://example.com/promo",
            },
        },
    )

    assert response.status_code == 200
    response_data = response.json()
    assert response_data["success"] is True
    assert response_data["lead_id"] == 1

    with closing(main.get_connection()) as connection:
        row = connection.execute(
            "SELECT * FROM leads WHERE id = ?", (response_data["lead_id"],)
        ).fetchone()

    assert row is not None
    assert row["name"] == "Анна"
    assert row["phone"] == "+375291234567"
    assert row["interest"] == "subscription"
    assert row["comment"] == "Две пачки в месяц"
    assert row["utm_source"] == "instagram"
    assert row["utm_medium"] == "social"
    assert row["utm_campaign"] == "autumn-coffee"
    assert row["utm_content"] == "story-1"
    assert row["utm_term"] == "свежий кофе"
    assert row["referrer"] == "https://example.com/promo"
    assert row["status"] == "new"
    assert row["created_at"]


@pytest.mark.parametrize(
    "phone",
    ["not-a-phone", "+1 (415) 555-0100", "+375 (29) 123-45"],
)
def test_create_lead_rejects_invalid_phone(client, phone):
    response = client.post(
        "/api/lead",
        json={"name": "Анна", "phone": phone, "interest": "question"},
    )

    assert response.status_code == 422


def test_create_lead_rejects_duplicate_phone_within_ten_minutes(client):
    payload = {
        "name": "Анна",
        "phone": "+375 (29) 123-45-67",
        "interest": "single_order",
    }

    first_response = client.post("/api/lead", json=payload)
    second_response = client.post("/api/lead", json=payload)

    assert first_response.status_code == 200
    assert second_response.status_code == 400
    assert second_response.json()["detail"] == "Заявка уже отправлена, ожидайте звонка"

    with closing(main.get_connection()) as connection:
        count = connection.execute("SELECT COUNT(*) FROM leads").fetchone()[0]
    assert count == 1
