export const formatPhoneNumber = (phone: string): string => {
  // Удаляем все нецифровые символы
  const cleaned = phone.replace(/\D/g, '')
  
  // Если номер начинается с 0, заменяем на 996
  if (cleaned.startsWith('0')) {
    return `+996${cleaned.slice(1)}`
  }
  
  // Если номер начинается с 996, добавляем +
  if (cleaned.startsWith('996')) {
    return `+${cleaned}`
  }
  
  // Если номер начинается с 7 или другой цифры, предполагаем что это локальный номер
  return `+996${cleaned}`
} 