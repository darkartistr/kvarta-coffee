import React, { useState } from 'react';
import { Phone, Menu, X, MapPin } from 'lucide-react';

interface HeaderProps {
  onOrderClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOrderClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#140e0b]/90 backdrop-blur-md border-b border-[#3b281c]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark */}
        <a 
          href="#" 
          className="font-serif text-2xl tracking-wide font-bold text-[#fbf6f0] hover:text-[#d49b6a] transition-colors whitespace-nowrap shrink-0"
        >
          Кварта
        </a>

        {/* Zone 2: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#cbbdb2]">
          <button 
            onClick={() => scrollTo('about')} 
            className="hover:text-[#fbf6f0] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            О мастерской
          </button>
          <button 
            onClick={() => scrollTo('freshness')} 
            className="hover:text-[#fbf6f0] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Свежесть
          </button>
          <button 
            onClick={() => scrollTo('catalog')} 
            className="hover:text-[#fbf6f0] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Каталог
          </button>
          <button 
            onClick={() => scrollTo('delivery')} 
            className="hover:text-[#fbf6f0] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Доставка
          </button>
          <button 
            onClick={() => scrollTo('contacts')} 
            className="hover:text-[#fbf6f0] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Контакты
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Quick Phone */}
        <div className="hidden lg:flex items-center gap-5 shrink-0">
          <a 
            href="tel:+375291234567" 
            className="flex items-center gap-2 text-xs font-mono text-[#cbbdb2] hover:text-[#fbf6f0] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#d49b6a]" />
            <span>+375 (29) 123-45-67</span>
          </a>
          <button
            onClick={onOrderClick}
            className="px-4 py-2 text-xs font-medium tracking-wide text-[#140e0b] bg-[#d49b6a] hover:bg-[#e2ad7f] active:scale-[0.98] rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
          >
            Оставить заявку
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-3">
          <a 
            href="tel:+375291234567" 
            className="p-2 text-[#d49b6a] hover:text-[#fbf6f0] transition-colors"
            aria-label="Позвонить в мастерскую"
          >
            <Phone className="w-5 h-5" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#fbf6f0] hover:text-[#d49b6a] transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1a120e] border-b border-[#3b281c] px-5 py-6 space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col space-y-3 text-base font-medium text-[#cbbdb2]">
            <button 
              onClick={() => scrollTo('about')} 
              className="text-left py-2 hover:text-[#fbf6f0] transition-colors border-b border-[#2d1e16]"
            >
              О мастерской
            </button>
            <button 
              onClick={() => scrollTo('freshness')} 
              className="text-left py-2 hover:text-[#fbf6f0] transition-colors border-b border-[#2d1e16]"
            >
              Свежесть как УТП
            </button>
            <button 
              onClick={() => scrollTo('catalog')} 
              className="text-left py-2 hover:text-[#fbf6f0] transition-colors border-b border-[#2d1e16]"
            >
              Каталог сортов и подписка
            </button>
            <button 
              onClick={() => scrollTo('delivery')} 
              className="text-left py-2 hover:text-[#fbf6f0] transition-colors border-b border-[#2d1e16]"
            >
              Доставка и самовывоз
            </button>
            <button 
              onClick={() => scrollTo('contacts')} 
              className="text-left py-2 hover:text-[#fbf6f0] transition-colors border-b border-[#2d1e16]"
            >
              Контакты и адрес
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs text-[#a89688]">
              <MapPin className="w-4 h-4 text-[#d49b6a] shrink-0" />
              <span>Минск, ул. Короля, 9</span>
            </div>
            <a 
              href="tel:+375291234567" 
              className="flex items-center gap-2 text-sm font-mono text-[#fbf6f0]"
            >
              <Phone className="w-4 h-4 text-[#d49b6a]" />
              <span>+375 (29) 123-45-67</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOrderClick();
              }}
              className="w-full py-3 text-sm font-medium text-[#140e0b] bg-[#d49b6a] hover:bg-[#e2ad7f] rounded-md transition-all cursor-pointer text-center font-sans mt-2"
            >
              Оставить заявку
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
