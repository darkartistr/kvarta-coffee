import React, { useState, useEffect, useId } from 'react';
import { 
  Phone, 
  User, 
  HelpCircle, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Send, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { formatBelarusianPhone, validateBelarusianPhone, cleanPhoneNumber } from '../utils/phone';
import { getUtmParameters } from '../utils/utm';
import { OrderFormData } from '../types/coffee';

interface OrderFormProps {
  interest: string;
  comment: string;
  onInterestChange: (interest: string) => void;
  onCommentChange: (comment: string) => void;
}

const STORAGE_KEY_PREFIX = 'kvarta_phone_lock_';
const LOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutes
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

interface LeadApiResponse {
  success?: boolean;
  message?: string;
  lead_id?: number;
  detail?: string | Array<{ msg?: string }>;
}

export const OrderForm: React.FC<OrderFormProps> = ({ 
  interest,
  comment,
  onInterestChange,
  onCommentChange,
}) => {
  const formId = useId();

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+375 ');

  // UI & UX states
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<OrderFormData | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string>('');

  // Duplicate protection state (10 minutes lock)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  // Check phone lock whenever phone changes or countdown ticks
  const checkPhoneLock = (phoneNumber: string) => {
    const digits = cleanPhoneNumber(phoneNumber);
    if (!digits) {
      setLockedUntil(null);
      return false;
    }

    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${digits}`);
      if (stored) {
        const timestamp = parseInt(stored, 10);
        const diff = Date.now() - timestamp;
        if (diff < LOCK_DURATION_MS) {
          const expiresAt = timestamp + LOCK_DURATION_MS;
          setLockedUntil(expiresAt);
          setRemainingSeconds(Math.ceil((expiresAt - Date.now()) / 1000));
          return true;
        } else {
          // expired lock
          localStorage.removeItem(`${STORAGE_KEY_PREFIX}${digits}`);
          setLockedUntil(null);
        }
      } else {
        setLockedUntil(null);
      }
    } catch {
      // ignore storage access issues
    }
    return false;
  };

  // Countdown timer for duplicate lock
  useEffect(() => {
    if (!lockedUntil) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now >= lockedUntil) {
        setLockedUntil(null);
        setRemainingSeconds(0);
        clearInterval(interval);
      } else {
        setRemainingSeconds(Math.ceil((lockedUntil - now) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockedUntil]);

  // Handle phone change with automatic mask
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    const formatted = formatBelarusianPhone(inputVal);
    setPhone(formatted);

    // Live validation feedback if user typed several digits
    if (formatted.length > 6) {
      const validation = validateBelarusianPhone(formatted);
      if (!validation.isValid) {
        setPhoneError(validation.error || 'Номер не соответствует белорусскому формату (+375...)');
      } else {
        setPhoneError(null);
      }
    } else {
      setPhoneError(null);
    }

    checkPhoneLock(formatted);
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double clicking
    if (isSubmitting) return;

    // Validate Name
    if (!name.trim()) {
      setNameError('Пожалуйста, укажите ваше имя');
      return;
    }
    setNameError(null);

    // Validate Phone strictly
    const phoneValidation = validateBelarusianPhone(phone);
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error || 'Номер не соответствует белорусскому формату (+375...)');
      return;
    }
    setPhoneError(null);

    // Check duplicate lock
    const digits = cleanPhoneNumber(phone);
    if (checkPhoneLock(phone)) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    // Prepare payload with marketing tags
    const currentUtmParams = getUtmParameters();
    const payload: OrderFormData = {
      name: name.trim(),
      phone: phone.trim(),
      interest,
      comment: comment.trim(),
      utm: currentUtmParams,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          ...currentUtmParams,
          page_url: window.location.href,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as LeadApiResponse;

      if (!response.ok) {
        const detail = result.detail;
        const errorMessage = Array.isArray(detail)
          ? detail.map((item) => item.msg).filter(Boolean).join('. ')
          : detail;
        throw new Error(
          errorMessage || 'Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.',
        );
      }

      const now = Date.now();
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${digits}`, now.toString());
        const storedHistory = JSON.parse(localStorage.getItem('kvarta_submissions_history') || '[]');
        const submissionHistory = Array.isArray(storedHistory) ? storedHistory : [];
        submissionHistory.push({
          ...payload,
          timestamp: now,
          id: result.lead_id ? `KV-${result.lead_id}` : `KV-${Math.floor(1000 + Math.random() * 9000)}`,
        });
        localStorage.setItem('kvarta_submissions_history', JSON.stringify(submissionHistory));
      } catch {
        // The server accepted the lead; browser storage is only a convenience.
      }

      const newOrderNumber = result.lead_id
        ? `KV-${result.lead_id}`
        : `KV-${Math.floor(1000 + Math.random() * 9000)}`;
      setOrderNumber(newOrderNumber);
      setSubmitSuccess(payload);
      setLockedUntil(now + LOCK_DURATION_MS);
      setRemainingSeconds(600);
    } catch (error) {
      setSubmitError(
        error instanceof TypeError
          ? 'Не удалось связаться с сервером. Проверьте, что бэкенд запущен, и попробуйте ещё раз.'
          : error instanceof Error
          ? error.message
          : 'Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const minutesRemaining = Math.floor(remainingSeconds / 60);
  const secondsRemaining = remainingSeconds % 60;

  // Interest options
  const interestOptions = [
    { value: 'subscription', label: 'Подписка на кофе (54 BYN / мес, 2 пачки по 250 г)' },
    { value: 'single_order', label: 'Разовый заказ зерна / дрипов' },
    { value: 'question', label: 'Вопрос по сортам, помолу или мастерской' },
    { value: 'ethiopia-yirgacheffe', label: 'Эфиопия Иргачеффе (32 BYN)' },
    { value: 'colombia-huila', label: 'Колумбия Уила (29 BYN)' },
    { value: 'brazil-cerrado', label: 'Бразилия Серрадо (26 BYN)' },
    { value: 'drip-assorted', label: 'Дрип-пакеты, ассорти 10 шт (18 BYN)' },
  ];

  return (
    <section id="contacts" className="py-16 lg:py-24 border-b border-[#2d1e16] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-[#d49b6a] font-medium mb-3">
            <span>Простой заказ без корзины</span>
            <span aria-hidden="true" className="text-[#644633]">·</span>
            <span>Менеджер перезвонит</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#fbf6f0] font-normal leading-tight">
            Оформить заказ или задать вопрос
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#cbbdb2]">
            Мы не требуем онлайн-оплаты и регистрации. Оставьте имя и номер телефона — 
            наш бариста перезвонит в течение 15 минут, согласует помол и подтвердит доставку.
          </p>
        </div>

        {/* The Card Container */}
        <div className="rounded-xl bg-[#19110d] border border-[#3b281c] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Success Screen */}
          {submitSuccess ? (
            <div className="text-center py-6 sm:py-10 space-y-5 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-600/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <div className="text-xs uppercase font-mono text-[#d49b6a] tracking-wider">
                  Заявка {orderNumber} принята
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#fbf6f0] font-normal">
                  Спасибо, {submitSuccess.name}!
                </h3>
                <p className="text-sm sm:text-base text-[#cbbdb2] max-w-lg mx-auto leading-relaxed">
                  Мы получили ваш запрос на номер <strong className="text-[#fbf6f0] font-mono">{submitSuccess.phone}</strong>. 
                  Спасибо! Ваша заявка принята, менеджер скоро перезвонит, чтобы уточнить помол и детали доставки.
                </p>
              </div>

              {/* Order summary box */}
              <div className="bg-[#140e0b] border border-[#2d1e16] rounded-lg p-4 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between text-[#a89688]">
                  <span>Интересует:</span>
                  <span className="text-[#fbf6f0] font-medium text-right max-w-[220px] truncate">
                    {interestOptions.find((o) => o.value === submitSuccess.interest)?.label || submitSuccess.interest}
                  </span>
                </div>
                {submitSuccess.comment && (
                  <div className="flex justify-between text-[#a89688] border-t border-[#251812] pt-2">
                    <span>Пожелания:</span>
                    <span className="text-[#fbf6f0] text-right max-w-[220px] truncate">
                      {submitSuccess.comment}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-[#a89688] border-t border-[#251812] pt-2">
                  <span>Обжарка & Доставка:</span>
                  <span className="text-[#d49b6a]">Партия четверга · Развоз в пятницу</span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setSubmitSuccess(null);
                    onCommentChange('');
                  }}
                  className="px-5 py-2.5 text-xs font-medium text-[#cbbdb2] hover:text-[#fbf6f0] bg-[#241811] hover:bg-[#322117] rounded border border-[#3b281c] transition-colors cursor-pointer"
                >
                  Отправить еще одну заявку
                </button>
                <a
                  href="tel:+375291234567"
                  className="px-5 py-2.5 text-xs font-semibold text-[#140e0b] bg-[#d49b6a] hover:bg-[#e2ad7f] rounded transition-colors inline-flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Позвонить прямо сейчас</span>
                </a>
              </div>
            </div>
          ) : (
            
            /* Order Submission Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Duplicate Protection Warning if locked */}
              {lockedUntil && (
                <div className="p-4 rounded-lg bg-amber-950/40 border border-amber-600/40 text-amber-200 text-xs sm:text-sm flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-amber-100">
                      Заявка с этого номера уже отправлена
                    </p>
                    <p className="text-amber-300/90 leading-relaxed text-xs">
                      В целях защиты от случайных повторных отправок повторный заказ с этого номера доступен через{' '}
                      <span className="font-mono font-bold text-amber-200 tabular-nums">
                        {minutesRemaining} мин {secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining} сек
                      </span>.
                      Если вам нужно срочно добавить пачку или изменить адрес, пожалуйста, позвоните нам напрямую:
                    </p>
                    <div className="pt-1">
                      <a 
                        href="tel:+375291234567" 
                        className="inline-flex items-center gap-1.5 font-mono font-medium text-amber-200 hover:text-white underline underline-offset-2"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>+375 (29) 123-45-67</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Error feedback if submission fails */}
              {submitError && (
                <div className="p-4 rounded-lg bg-red-950/50 border border-red-500/50 text-red-200 text-xs sm:text-sm space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-red-100">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Ошибка отправки заявки</span>
                  </div>
                  <p className="text-red-200/90 leading-relaxed text-xs">
                    {submitError}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <a
                      href="tel:+375291234567"
                      className="px-3.5 py-1.5 text-xs font-semibold bg-red-800/60 hover:bg-red-700/80 text-white rounded transition-colors inline-flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Позвонить +375 (29) 123-45-67</span>
                    </a>
                    <a
                      href="https://t.me/kvarta_coffee_by"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 text-xs font-medium bg-[#221610] hover:bg-[#322117] text-[#fbf6f0] border border-[#3b281c] rounded transition-colors inline-flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#d49b6a]" />
                      <span>Написать в Telegram</span>
                    </a>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Field 1: Name */}
                <div className="space-y-2">
                  <label 
                    htmlFor={`${formId}-name`} 
                    className="block text-xs uppercase tracking-wider text-[#d8c8bc] font-medium"
                  >
                    Ваше имя <span className="text-[#d49b6a]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id={`${formId}-name`}
                      type="text"
                      required
                      placeholder="Алексей"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (nameError) setNameError(null);
                      }}
                      className={`w-full px-4 py-3 bg-[#130d0a] border rounded-md text-sm text-[#fbf6f0] placeholder:text-[#5a4233] focus:outline-none focus:ring-1 transition-colors ${
                        nameError 
                          ? 'border-red-500/80 focus:ring-red-500' 
                          : 'border-[#3b281c] focus:border-[#d49b6a] focus:ring-[#d49b6a]'
                      }`}
                    />
                  </div>
                  {nameError && (
                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{nameError}</span>
                    </p>
                  )}
                </div>

                {/* Field 2: Phone with strict Belarusian validation */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label 
                      htmlFor={`${formId}-phone`} 
                      className="block text-xs uppercase tracking-wider text-[#d8c8bc] font-medium"
                    >
                      Телефон (+375...) <span className="text-[#d49b6a]">*</span>
                    </label>
                    <span className="text-[11px] font-mono text-[#a89688]">Беларусь</span>
                  </div>
                  <div className="relative">
                    <input
                      id={`${formId}-phone`}
                      type="tel"
                      required
                      placeholder="+375 (29) 000-00-00"
                      value={phone}
                      onChange={handlePhoneChange}
                      className={`w-full px-4 py-3 bg-[#130d0a] border rounded-md text-sm font-mono text-[#fbf6f0] placeholder:text-[#5a4233] focus:outline-none focus:ring-1 transition-colors ${
                        phoneError 
                          ? 'border-red-500/80 focus:ring-red-500 bg-red-950/10' 
                          : 'border-[#3b281c] focus:border-[#d49b6a] focus:ring-[#d49b6a]'
                      }`}
                    />
                  </div>
                  {phoneError ? (
                    <p className="text-xs text-red-400 flex items-start gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{phoneError}</span>
                    </p>
                  ) : (
                    <p className="text-[11px] text-[#8e7a6d]">
                      Формат: +375 (код 29, 33, 44, 25) и 7 цифр номера
                    </p>
                  )}
                </div>

              </div>

              {/* Field 3: What interests you (Dropdown) */}
              <div className="space-y-2">
                <label 
                  htmlFor={`${formId}-interest`} 
                  className="block text-xs uppercase tracking-wider text-[#d8c8bc] font-medium"
                >
                  Что вас интересует? <span className="text-[#d49b6a]">*</span>
                </label>
                <div className="relative">
                  <select
                    id={`${formId}-interest`}
                    value={interest}
                    onChange={(e) => onInterestChange(e.target.value)}
                    className="w-full px-4 py-3 bg-[#130d0a] border border-[#3b281c] rounded-md text-sm text-[#fbf6f0] appearance-none focus:outline-none focus:border-[#d49b6a] focus:ring-1 focus:ring-[#d49b6a] transition-colors pr-10 cursor-pointer"
                  >
                    {interestOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#19110d] text-[#fbf6f0]">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#a89688] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Field 4: Comment */}
              <div className="space-y-2">
                <label 
                  htmlFor={`${formId}-comment`} 
                  className="block text-xs uppercase tracking-wider text-[#d8c8bc] font-medium"
                >
                  Комментарий или пожелания по помолу
                </label>
                <textarea
                  id={`${formId}-comment`}
                  rows={3}
                  placeholder="Например: 2 пачки Колумбии, смолоть под гейзерную кофеварку. Доставка в пятницу после 18:00."
                  value={comment}
                  onChange={(e) => onCommentChange(e.target.value)}
                  className="w-full px-4 py-3 bg-[#130d0a] border border-[#3b281c] rounded-md text-sm text-[#fbf6f0] placeholder:text-[#5a4233] focus:outline-none focus:border-[#d49b6a] focus:ring-1 focus:ring-[#d49b6a] transition-colors"
                />
              </div>

              {/* Submit Button with Anti-Double-Click and Lockout Check */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !!lockedUntil}
                  className={`w-full py-4 px-6 text-sm font-semibold tracking-wide uppercase rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                    isSubmitting || lockedUntil
                      ? 'bg-[#3b281c] text-[#7a675a] cursor-not-allowed opacity-75'
                      : 'bg-[#d49b6a] hover:bg-[#e2ad7f] active:scale-[0.99] text-[#140e0b]'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#140e0b] border-t-transparent rounded-full animate-spin" />
                      <span>Отправляем заявку...</span>
                    </>
                  ) : lockedUntil ? (
                    <>
                      <Clock className="w-4 h-4" />
                      <span>Повторная отправка через {minutesRemaining} мин</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Отправить заявку мастеру</span>
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-[#8e7a6d] mt-3">
                  Нажимая кнопку, вы соглашаетесь на обратный звонок от мастера «Кварты». Никакого спама.
                </p>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
