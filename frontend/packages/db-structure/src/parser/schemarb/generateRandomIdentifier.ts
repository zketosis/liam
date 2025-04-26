export const generateRandomIdentifier = (length: number) =>
  Array.from({ length }, () =>
    '0123456789abcdef'.charAt(Math.floor(Math.random() * 16)),
  ).join('')
