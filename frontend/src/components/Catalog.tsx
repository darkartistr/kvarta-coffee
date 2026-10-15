import React, { useState } from 'react';
import { Product } from '../types/coffee';
import { PRODUCTS } from '../data/products';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

interface CatalogProps {
  onSelectProduct: (product: Product) => void;
}

export const Catalog: React.FC<CatalogProps> = ({ onSelectProduct }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'beans' | 'drip' | 'subscription'>('all');

  const filteredProducts = PRODUCTS.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.type === activeCategory;
  });

  return (
    <section id="catalog" className="py-16 lg:py-24 border-b border-[#2d1e16]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#d49b6a] font-medium mb-2">
              <span>Свежий урожай</span>
              <span aria-hidden="true" className="text-[#644633]">·</span>
              <span>Партии по 5 кг</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#fbf6f0] font-normal">
              Каталог сортов и подписка
            </h2>
            <p className="text-sm sm:text-base text-[#a89688] mt-2 max-w-xl">
              Все сорта доступны в зерне или с индивидуальным помолом под ваш способ заваривания. 
              Менеджер уточнит детали при звонке.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#1a120e] rounded-lg border border-[#3b281c] self-start md:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#d49b6a] text-[#140e0b]'
                  : 'text-[#cbbdb2] hover:text-[#fbf6f0]'
              }`}
            >
              Все позиции (5)
            </button>
            <button
              onClick={() => setActiveCategory('beans')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                activeCategory === 'beans'
                  ? 'bg-[#d49b6a] text-[#140e0b]'
                  : 'text-[#cbbdb2] hover:text-[#fbf6f0]'
              }`}
            >
              Зерно 250 г
            </button>
            <button
              onClick={() => setActiveCategory('drip')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                activeCategory === 'drip'
                  ? 'bg-[#d49b6a] text-[#140e0b]'
                  : 'text-[#cbbdb2] hover:text-[#fbf6f0]'
              }`}
            >
              Дрип-пакеты
            </button>
            <button
              onClick={() => setActiveCategory('subscription')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                activeCategory === 'subscription'
                  ? 'bg-[#d49b6a] text-[#140e0b]'
                  : 'text-[#cbbdb2] hover:text-[#fbf6f0]'
              }`}
            >
              Подписка
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProducts.map((product) => {
            const isSubscription = product.type === 'subscription';

            return (
              <div
                key={product.id}
                className={`group flex flex-col rounded-lg bg-[#18110d] border transition-all duration-200 overflow-hidden ${
                  isSubscription 
                    ? 'border-[#8e5c38] shadow-[0_0_24px_rgba(212,155,106,0.12)] md:col-span-2 lg:col-span-1' 
                    : 'border-[#3b281c] hover:border-[#5a3c2b]'
                }`}
              >
                {/* Product Image Box */}
                <div className="relative aspect-[4/3] bg-[#221610] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle top badge */}
                  {product.badge && (
                    <div className="absolute top-3 right-3 text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded bg-[#140e0b]/85 backdrop-blur-sm text-[#d49b6a] border border-[#3b281c]">
                      {product.badge}
                    </div>
                  )}

                  <div className="absolute bottom-2.5 left-3 text-xs font-mono text-[#e2ad7f] bg-[#140e0b]/80 backdrop-blur-xs px-2 py-0.5 rounded">
                    {product.weight}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-xl text-[#fbf6f0] font-medium leading-snug">
                        {product.name}
                      </h3>
                      <div className="text-right shrink-0">
                        <span className="font-serif text-xl sm:text-2xl text-[#d49b6a] font-semibold tabular-nums">
                          {product.price}
                        </span>
                        <span className="text-xs text-[#a89688] ml-1 font-mono">
                          {product.currency}
                        </span>
                      </div>
                    </div>

                    {/* Tasting notes */}
                    <p className="text-xs font-medium text-[#d49b6a] uppercase tracking-wider">
                      {product.notes}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-[#cbbdb2] leading-relaxed line-clamp-3">
                      {product.details}
                    </p>
                  </div>

                  {/* Action button */}
                  <div className="pt-2 border-t border-[#2d1e16]">
                    <button
                      onClick={() => onSelectProduct(product)}
                      className={`w-full py-2.5 px-4 text-xs font-semibold tracking-wide uppercase rounded transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        isSubscription
                          ? 'bg-[#d49b6a] hover:bg-[#e2ad7f] text-[#140e0b]'
                          : 'bg-[#251913] hover:bg-[#34231b] text-[#fbf6f0] border border-[#3e2b20]'
                      }`}
                    >
                      <span>{isSubscription ? 'Оформить подписку' : 'Заказать этот кофе'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Small craft note */}
        <div className="mt-8 p-4 rounded-lg bg-[#19110d] border border-[#3b281c] text-xs text-[#a89688] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p>
            * Весь кофе упаковывается в пакеты с клапаном дегазации и zip-замком. 
            Помол делаем перед отправкой без доплаты (под турку, гейзер, эспрессо, фильтр, чашку).
          </p>
          <span className="text-[#d49b6a] whitespace-nowrap shrink-0 font-medium">
            Без предоплаты онлайн
          </span>
        </div>

      </div>
    </section>
  );
};
