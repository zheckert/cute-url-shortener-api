// Base62 encoding characters
const base62Chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Function to encode a BigInt as a base62 string
function encodeBase62(number) {
  if (number === 0n) return '0';
  let encoded = '';
  while (number > 0n) {
    encoded = base62Chars[number % 62n] + encoded;
    number = number / 62n;
  }
  return encoded;
}

// Function to convert UUID to a base62 encoded string
function uuidToBase62(uuid) {
  // Remove hyphens from UUID and convert to a BigInt
  const hex = uuid.replace(/-/g, '');
  const bigInt = BigInt(`0x${hex}`);
  
  // Convert BigInt to base62
  return encodeBase62(bigInt);
}

export { uuidToBase62 };
