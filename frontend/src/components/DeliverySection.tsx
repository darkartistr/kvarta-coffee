import React, { useState } from 'react';
import { MapPin, Clock, Truck, Check, Copy } from 'lucide-react';

export const DeliverySection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText('Минск, ул. Короля, 9');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="delivery" className="py-16 lg:py-24 border-b border-[#2d1e16] bg-[#170f0b]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#d49b6a] font-medium mb-3">
            <span>Логистика и локация</span>
            <span aria-hidden="true" className="text-[#644633]">·</span>
            <span>Минск</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#fbf6f0] font-normal leading-tight">
            Доставка по Минску и самовывоз из мастерской
          </h2>
          <p className="mt-3 text-base text-[#cbbdb2]">
            Мы выстроили логистику так, чтобы исключить хранение на полках: обжарка по четвергам, 
            раздача и курьерский развоз — по пятницам.
          </p>
        </div>

        {/* 2 Big Delivery & Pickup Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Pickup Card */}
          <div className="p-6 sm:p-8 rounded-lg bg-[#1f1510] border border-[#3b281c] flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#d49b6a]">
                  Самовывоз из мастерской
                </span>
                <span className="text-xs font-mono text-[#a89688]">Бесплатно</span>
              </div>

              <h3 className="font-serif text-2xl text-[#fbf6f0] mb-3">
                Минск, ул. Короля, 9
              </h3>

              <p className="text-sm text-[#cbbdb2] leading-relaxed mb-6">
                Заходите к нам в мастерскую забрать заказ, выпить свежесваренный фильтр 
                и посмотреть на наш 5-килограммовый ростер в работе.
              </p>

              {/* Hours Grid */}
              <div className="space-y-3 bg-[#150e0a] p-4 rounded-md border border-[#2d1e16]">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-[#cbbdb2]">
                    <Clock className="w-4 h-4 text-[#d49b6a]" />
                    <span>Понедельник — Пятница:</span>
                  </div>
                  <span className="font-mono text-[#fbf6f0] font-medium">8:00 – 20:00</span>
                </div>
                <div className="flex items-center justify-between text-sm border-t border-[#251812] pt-2.5">
                  <div className="flex items-center gap-2 text-[#cbbdb2]">
                    <Clock className="w-4 h-4 text-[#d49b6a]" />
                    <span>Суббота — Воскресенье:</span>
                  </div>
                  <span className="font-mono text-[#fbf6f0] font-medium">10:00 – 18:00</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={handleCopyAddress}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#fbf6f0] bg-[#2a1c15] hover:bg-[#38261d] rounded border border-[#4a3324] transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#d49b6a]" />}
                <span>{copied ? 'Адрес скопирован!' : 'Скопировать адрес'}</span>
              </button>

              <a
                href="https://yandex.by/maps/?text=Минск+улица+Короля+9"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#d49b6a] hover:text-[#e2ad7f] transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Открыть на карте</span>
              </a>
            </div>
          </div>

          {/* Delivery Card */}
          <div className="p-6 sm:p-8 rounded-lg bg-[#1f1510] border border-[#3b281c] flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#d49b6a]">
                  Доставка курьером
                </span>
                <span className="text-xs font-mono text-[#e2ad7f]">По пятницам</span>
              </div>

              <h3 className="font-serif text-2xl text-[#fbf6f0] mb-3">
                Курьерская доставка по Минску
              </h3>

              <p className="text-sm text-[#cbbdb2] leading-relaxed mb-6">
                Мы бережно доставляем кофе прямо к вашей двери. В четверг зерно обжаривается, 
                ночью проходит стабилизацию, а в пятницу утром наш курьер выезжает по маршруту.
              </p>

              {/* Conditions */}
              <div className="space-y-3 bg-[#150e0a] p-4 rounded-md border border-[#2d1e16]">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-[#cbbdb2]">
                    <Truck className="w-4 h-4 text-[#d49b6a]" />
                    <span>При заказе от 50 BYN:</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold">Бесплатно</span>
                </div>
                <div className="flex items-center justify-between text-sm border-t border-[#251812] pt-2.5">
                  <div className="flex items-center gap-2 text-[#cbbdb2]">
                    <Truck className="w-4 h-4 text-[#a89688]" />
                    <span>При заказе до 50 BYN:</span>
                  </div>
                  <span className="font-mono text-[#fbf6f0]">5 BYN</span>
                </div>
                <div className="flex items-center justify-between text-sm border-t border-[#251812] pt-2.5 text-xs text-[#a89688]">
                  <span>День доставки:</span>
                  <span className="text-[#d49b6a] font-medium">Каждая пятница (с 10:00 до 21:00)</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-[#a89688]">
              Заказы на пятничный развоз принимаются до среды 20:00, чтобы мы включили вашу партию в обжарочный лист четверга.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
