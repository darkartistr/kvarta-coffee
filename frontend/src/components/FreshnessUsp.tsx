import React from 'react';
import { Sparkles, Calendar, Coffee, Users } from 'lucide-react';

export const FreshnessUsp: React.FC = () => {
  return (
    <section id="freshness" className="py-16 lg:py-24 border-b border-[#2d1e16] bg-[#170f0b]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#d49b6a] font-medium mb-3">
            <span>Главное отличие</span>
            <span aria-hidden="true" className="text-[#644633]">·</span>
            <span>Философия вкуса</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#fbf6f0] leading-tight text-balance">
            Свежесть — это не маркетинг. Это единственный способ почувствовать настоящий вкус кофе.
          </h2>
          <p className="mt-4 text-base text-[#cbbdb2] leading-relaxed">
            Большинство кофе на полках магазинов обжарено 4–8 месяцев назад. За это время драгоценные эфирные 
            масла окисляются, оставляя лишь плоскую горечь. В «Кварте» вы пьете кофе в его идеальной кондиции.
          </p>
        </div>

        {/* 3 Step Cycle Card Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          <div className="p-6 rounded-lg bg-[#1f1510] border border-[#3b281c] relative">
            <span className="font-serif text-3xl text-[#5a3c2b] block mb-3 tabular-nums">01</span>
            <h3 className="font-serif text-lg text-[#fbf6f0] mb-2 font-medium">
              Четверг: обжарка по 5 кг
            </h3>
            <p className="text-sm text-[#a89688] leading-relaxed">
              Не греем пустые склады. Жарочный барабан загружаем только под реальные заказы недели. 
              Каждая партия тестируется на каппинге лично основателями.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-[#251913] border border-[#5a3c2b] relative shadow-md">
            <span className="font-serif text-3xl text-[#d49b6a] block mb-3 tabular-nums">02</span>
            <h3 className="font-serif text-lg text-[#fbf6f0] mb-2 font-medium">
              Пятница: доставка по Минску
            </h3>
            <p className="text-sm text-[#cbbdb2] leading-relaxed">
              Сразу после суточного отдыха зерна и дегазации пачки развозятся клиентам по Минску или 
              ждут вас в мастерской на ул. Короля, 9.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-[#1f1510] border border-[#3b281c] relative">
            <span className="font-serif text-3xl text-[#5a3c2b] block mb-3 tabular-nums">03</span>
            <h3 className="font-serif text-lg text-[#fbf6f0] mb-2 font-medium">
              1–3 день: пик букета
            </h3>
            <p className="text-sm text-[#a89688] leading-relaxed">
              Вы открываете клапан пачки ровно тогда, когда цветочные, ягодные и карамельные ноты раскрываются 
              максимально сочно и чисто.
            </p>
          </div>

        </div>

        {/* Founders Story Section */}
        <div id="about" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-8 border-t border-[#2d1e16]">
          
          {/* Founders photo */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-lg overflow-hidden border border-[#3b281c] bg-[#1a120e]">
              <img
                src="/src/assets/images/founders_anya_dmitry_1792067163115.jpg"
                alt="Основатели мастерской Кварта Аня и Дмитрий на каппинге свежего кофе"
                className="w-full h-full object-cover aspect-[4/3]"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div 
                className="absolute inset-0 bg-gradient-to-t from-[#140e0b]/80 via-transparent to-transparent" 
                aria-hidden="true" 
              />
              <div className="absolute bottom-3 left-3 right-3 text-xs text-[#cbbdb2] bg-[#140e0b]/80 backdrop-blur-sm p-2.5 rounded border border-[#3b281c]">
                <span className="font-medium text-[#fbf6f0] block">Аня и Дмитрий · основатели и обжарщики</span>
                <span>«Сами отбираем зеленый кофе и контролируем каждый профиль обжарки»</span>
              </div>
            </div>
          </div>

          {/* Story prose */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#d49b6a] font-medium">
              <span>Люди за ростером</span>
              <span aria-hidden="true" className="text-[#644633]">·</span>
              <span>Без посредников</span>
            </div>
            
            <h3 className="font-serif text-2xl sm:text-3xl text-[#fbf6f0] font-normal leading-snug">
              Бывшие бариста, которые устали от компромиссов большого ритейла
            </h3>

            <div className="space-y-3 text-sm sm:text-base text-[#cbbdb2] leading-relaxed">
              <p>
                Мы варили кофе за стойками лучших кофеен Минска больше шести лет. Видели, как гости 
                влюбляются в чистый эспрессо или воронку, и как огорчаются, когда покупают зерно 
                в супермаркете и дома получают безликий горький напиток.
              </p>
              <p>
                В 2019 году мы привезли в мастерскую на улице Короля компактный ростер на 5 кг. 
                Мы сознательно не масштабируемся до промышленных объемов: 5 килограммов позволяют 
                с точностью до секунды контролировать температуру сушки, реакцию Майяра и карамелизацию.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-6 text-xs text-[#a89688]">
              <div>
                <span className="font-mono text-[#fbf6f0] text-sm block">100%</span>
                Спешелти арабика
              </div>
              <div className="border-l border-[#2d1e16] pl-6">
                <span className="font-mono text-[#fbf6f0] text-sm block">Ручной</span>
                Отбор зеленого зерна
              </div>
              <div className="border-l border-[#2d1e16] pl-6">
                <span className="font-mono text-[#fbf6f0] text-sm block">Минск</span>
                Локальное производство
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
