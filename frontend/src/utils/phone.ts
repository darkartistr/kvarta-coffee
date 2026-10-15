/**
 * Utilities for strict Belarusian phone validation and formatting.
 * Country code: +375
 * Operator codes: 25 (life:)), 29 (A1/МТС), 33 (МТС), 44 (A1), 17 (Минск)
 */

export function cleanPhoneNumber(value: string): string {
  // Strip everything except digits
  let digits = value.replace(/\D/g, '');
  
  // If user begins typing 8029..., convert 80 prefix to 375
  if (digits.startsWith('80') && digits.length >= 2) {
    digits = '375' + digits.slice(2);
  }
  
  return digits;
}

export function formatBelarusianPhone(value: string): string {
  let digits = cleanPhoneNumber(value);

  // If user cleared the input
  if (!digits) {
    return '';
  }

  // Ensure leading 375
  if (!digits.startsWith('375')) {
    if (digits.startsWith('3') || digits.startsWith('7')) {
      // User is starting to type 375...
    } else {
      digits = '375' + digits;
    }
  }

  // Limit to 12 digits (+375 XX XXXXXXX)
  digits = digits.slice(0, 12);

  // Apply visual mask: +375 (XX) XXX-XX-XX
  let formatted = '+';
  if (digits.length <= 3) {
    formatted += digits;
    return formatted;
  }

  formatted += digits.slice(0, 3); // 375

  if (digits.length > 3) {
    formatted += ' (' + digits.slice(3, Math.min(5, digits.length));
  }
  if (digits.length >= 5) {
    formatted += ') ';
  }
  if (digits.length > 5) {
    formatted += digits.slice(5, Math.min(8, digits.length));
  }
  if (digits.length > 8) {
    formatted += '-' + digits.slice(8, Math.min(10, digits.length));
  }
  if (digits.length > 10) {
    formatted += '-' + digits.slice(10, 12);
  }

  return formatted;
}

export interface PhoneValidationResult {
  isValid: boolean;
  error?: string;
  normalized?: string;
}

export function validateBelarusianPhone(value: string): PhoneValidationResult {
  const digits = cleanPhoneNumber(value);

  if (!digits) {
    return {
      isValid: false,
      error: 'Укажите номер телефона для связи',
    };
  }

  if (!digits.startsWith('375')) {
    return {
      isValid: false,
      error: 'Номер не соответствует белорусскому формату (+375...)',
    };
  }

  if (digits.length < 12) {
    return {
      isValid: false,
      error: `Номер не полный. Должно быть 12 цифр (+375 XX XXX-XX-XX). Сейчас: ${digits.length}`,
    };
  }

  if (digits.length > 12) {
    return {
      isValid: false,
      error: 'Номер слишком длинный для Республики Беларусь',
    };
  }

  const operatorCode = digits.slice(3, 5);
  const validCodes = ['25', '29', '33', '44', '17', '21', '22', '23', '24'];
  if (!validCodes.includes(operatorCode)) {
    return {
      isValid: false,
      error: `Неверный код оператора (+375 ${operatorCode}). Допустимы 29, 44, 33, 25 или код города`,
    };
  }

  return {
    isValid: true,
    normalized: '+' + digits,
  };
}
