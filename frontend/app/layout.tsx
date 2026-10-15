import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Кварта — крафтовая обжарка кофе в Минске",
  description:
    "Мастерская свежей обжарки кофе в Минске с 2019 года. Обжариваем зерно партиями по 5 кг. Доставка на 1–3 день после обжарки. Самовывоз: ул. Короля, 9.",
  openGraph: {
    title: "Кварта — крафтовая обжарка кофе в Минске",
    description:
      "Маленькая мастерская крафтовой обжарки кофе в Минске с 2019 года. Обжариваем зерно партиями по 5 кг. Доставка на 1–3 день после обжарки.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
