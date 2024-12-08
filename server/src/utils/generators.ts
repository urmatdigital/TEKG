export const generateClientCode = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  
  const getRandomChars = (chars: string, count: number) => {
    return Array.from({ length: count }, () => 
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('')
  }

  return getRandomChars(letters, 2) + getRandomChars(numbers, 4)
} 