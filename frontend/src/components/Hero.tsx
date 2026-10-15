import React from 'react';
import { ArrowDown, Flame, Clock, Award } from 'lucide-react';

interface HeroProps {
  onCatalogClick: () => void;
  onStoryClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCatalogClick, onStoryClick }) => {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-[#2d1e16]">
      {/* Background ambient warmth */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_30%_20%,rgba(212,155,106,0.15),transparent_50%)]" 
        aria-hidden="true" 
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Authentic Craft Story & Headline */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            
            {/* Clean unboxed kicker with dot separators */}
            <div className="flex items-center flex-wrap gap-2 text-xs uppercase tracking-wider text-[#d49b6a] font-medium">
              <span>Минск</span>
              <span aria-hidden="true" className="text-[#644633]">·</span>
              <span>Крафтовая обжарка</span>
              <span aria-hidden="true" className="text-[#644633]">·</span>
              <span>Мастерская с 2019 года</span>
            </div>

            {/* Display Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.15] text-[#fbf6f0] text-balance">
              Маленькая мастерская свежего кофе. Обжариваем партиями по&nbsp;5&nbsp;кг.
            </h1>

            {/* Subheadline revealing the core essence */}
            <p className="text-base sm:text-lg text-[#cbbdb2] leading-relaxed max-w-2xl">
              Мы не забиваем склады и не продаем лежалое зерно. Аня и Дмитрий, бывшие бариста, 
              запустили «Кварту» в 2019 году, чтобы вы пили спешелти кофе на пике его вкуса — 
              пачка приходит к вам на 1–3 день после обжарочного барабана.
            </p>

            {/* Micro value indicators */}
            <div className="pt-2 grid grid-cols-3 gap-3 sm:gap-4 border-t border-[#2d1e16] max-w-xl">
              <div>
                <div className="font-serif text-2xl sm:text-3xl text-[#fbf6f0] tabular-nums">5 кг</div>
                <div className="text-xs text-[#a89688] mt-0.5 leading-snug">ручной батч обжарки</div>
              </div>
              <div>
                <div className="font-serif text-2xl sm:text-3xl text-[#d49b6a] tabular-nums">1–3 дня</div>
                <div className="text-xs text-[#a89688] mt-0.5 leading-snug">от ростера до чашки</div>
              </div>
              <div>
                <div className="font-serif text-2xl sm:text-3xl text-[#fbf6f0] tabular-nums">2019</div>
                <div className="text-xs text-[#a89688] mt-0.5 leading-snug">работаем в Минске</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onCatalogClick}
                className="px-6 py-3.5 text-sm font-semibold tracking-wide text-[#140e0b] bg-[#d49b6a] hover:bg-[#e2ad7f] active:scale-[0.98] rounded-md transition-all text-center cursor-pointer shadow-md"
              >
                Выбрать свежий кофе
              </button>
              <button
                onClick={onStoryClick}
                className="px-6 py-3.5 text-sm font-medium text-[#fbf6f0] bg-[#221610] hover:bg-[#2e1f17] border border-[#3e2b20] rounded-md transition-all text-center cursor-pointer"
              >
                О мастерской и свежести
              </button>
            </div>

          </div>

          {/* Right Column: Authentic Roastery Photography */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-lg overflow-hidden border border-[#3b281c] bg-[#1a120e] shadow-2xl aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]">
              <img
                src="/src/assets/images/hero_craft_roastery_1792067129324.jpg"
                alt="Мастерская обжарки кофе Кварта в Минске, ростер и свежеобжаренное зерно"
                className="w-full h-full object-cover"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div 
                className="absolute inset-0 bg-gradient-to-t from-[#140e0b]/90 via-[#140e0b]/20 to-transparent" 
                aria-hidden="true" 
              />
              
              {/* Bottom contextual badge */}
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-[#170f0b]/85 backdrop-blur-md rounded border border-[#3b281c]/80 text-xs text-[#d8c8bc] flex items-center justify-between">
                <div>
                  <span className="text-[#fbf6f0] font-medium block">Минск, ул. Короля, 9</span>
                  <span className="text-[#a89688]">Обжариваем каждый четверг</span>
                </div>
                <span className="text-[#d49b6a] font-mono text-xs">Партии по 5 кг</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
