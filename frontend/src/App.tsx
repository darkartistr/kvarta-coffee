'use client';

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FreshnessUsp } from './components/FreshnessUsp';
import { Catalog } from './components/Catalog';
import { DeliverySection } from './components/DeliverySection';
import { OrderForm } from './components/OrderForm';
import { Footer } from './components/Footer';
import { Product } from './types/coffee';

export default function App() {
  const [selectedInterest, setSelectedInterest] = useState<string>('single_order');
  const [selectedComment, setSelectedComment] = useState<string>('');

  const handleOrderClick = () => {
    const el = document.getElementById('contacts');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCatalogClick = () => {
    const el = document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStoryClick = () => {
    const el = document.getElementById('freshness');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectProduct = (product: Product) => {
    if (product.type === 'subscription') {
      setSelectedInterest('subscription');
      setSelectedComment('Интересует ежемесячная подписка на 2 пачки по 250 г (54 BYN / мес) с бесплатной доставкой.');
    } else if (product.type === 'drip') {
      setSelectedInterest(product.id);
      setSelectedComment(`Хочу заказать: ${product.name} (${product.weight}, ${product.price} BYN).`);
    } else {
      setSelectedInterest(product.id);
      setSelectedComment(`Хочу заказать: ${product.name} (250 г, ${product.price} BYN). Желаемый помол: в зерне / под турку / эспрессо / фильтр.`);
    }

    const formEl = document.getElementById('contacts');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#120c09] text-[#f5ede4] flex flex-col font-sans selection:bg-[#d49b6a] selection:text-[#120c09]">
      <Header onOrderClick={handleOrderClick} />
      
      <main className="flex-grow">
        <Hero 
          onCatalogClick={handleCatalogClick} 
          onStoryClick={handleStoryClick} 
        />
        <FreshnessUsp />
        <Catalog onSelectProduct={handleSelectProduct} />
        <DeliverySection />
        <OrderForm 
          interest={selectedInterest}
          comment={selectedComment}
          onInterestChange={setSelectedInterest}
          onCommentChange={setSelectedComment}
        />
      </main>

      <Footer />
    </div>
  );
}
