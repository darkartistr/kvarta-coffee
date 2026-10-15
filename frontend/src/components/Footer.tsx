import React from 'react';
import { Phone, MapPin, Clock, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#100a07] text-[#cbbdb2] border-t border-[#2d1e16] py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[#241812]">
          
          {/* Brand & mission */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-serif text-2xl font-bold text-[#fbf6f0] block tracking-wide">
              Кварта
            </span>
            <p className="text-sm text-[#a89688] leading-relaxed max-w-sm">
              Крафтовая мастерская обжарки кофе в Минске. Жарим микролоты партиями по 5 кг с 2019 года. 
              Доставляем свежее зерно на 1–3 день после обжарки.
            </p>
            <div className="pt-2 text-xs text-[#7a675a] space-y-1">
              <p>ИП Смирнова А. В. · УНП 193245876</p>
              <p>Минск, зарегистрировано в торговом реестре РБ</p>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#d49b6a] font-semibold">
              Разделы
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="hover:text-[#fbf6f0] transition-colors">
                  О мастерской и основателях
                </a>
              </li>
              <li>
                <a href="#freshness" className="hover:text-[#fbf6f0] transition-colors">
                  Почему свежесть решает
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-[#fbf6f0] transition-colors">
                  Каталог сортов и подписка
                </a>
              </li>
              <li>
                <a href="#delivery" className="hover:text-[#fbf6f0] transition-colors">
                  Самовывоз и доставка по пятницам
                </a>
              </li>
              <li>
                <a href="#contacts" className="hover:text-[#fbf6f0] transition-colors">
                  Оставить заявку на заказ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#d49b6a] font-semibold">
              Мастерская в Минске
            </h4>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#d49b6a] shrink-0 mt-0.5" />
                <span>Минск, ул. Короля, 9</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#d49b6a] shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <p>Пн–Пт: 8:00 – 20:00</p>
                  <p>Сб–Вс: 10:00 – 18:00</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 pt-1">
                <Phone className="w-4 h-4 text-[#d49b6a] shrink-0" />
                <a href="tel:+375291234567" className="font-mono text-[#fbf6f0] hover:text-[#d49b6a] transition-colors">
                  +375 (29) 123-45-67
                </a>
              </div>
              <div className="pt-2">
                <a 
                  href="https://t.me/kvarta_coffee_by" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#d49b6a] hover:text-[#e2ad7f]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Написать в Telegram мастерской</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
      <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7a675a] gap-4">
        <p>© 2026 Мастерская «Кварта». Свежий кофе без компромиссов.</p>
        <div className="flex items-center gap-4">
          <span>Обжарка по четвергам</span>
          <span aria-hidden="true">·</span>
          <span>Доставка по Минску по пятницам</span>
        </div>
      </div>

    </div>
  </footer>
);
};
