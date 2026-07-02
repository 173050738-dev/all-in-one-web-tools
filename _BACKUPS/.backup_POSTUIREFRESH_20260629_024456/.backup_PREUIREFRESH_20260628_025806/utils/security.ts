export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  const sanitized = input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/&#x([0-9a-f]+);/gi, '')
    .replace(/&#([0-9]+);/g, '');
  
  return sanitized;
}

export function sanitizeUrl(url: string): string {
  if (!url) return '';
  
  try {
    const parsed = new URL(url);
    
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    
    parsed.hash = '';
    parsed.search = '';
    
    return parsed.toString();
  } catch {
    return '';
  }
}

export function escapeHtml(text: string): string {
  if (!text) return '';
  
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function generateCSRFToken(): string {
  const array = new Uint32Array(8);
  crypto.getRandomValues(array);
  return Array.from(array, (num) => num.toString(16).padStart(8, '0')).join('');
}

export function getCSRFToken(): string {
  let token = localStorage.getItem('csrf-token');
  if (!token) {
    token = generateCSRFToken();
    localStorage.setItem('csrf-token', token);
  }
  return token;
}

export function validateCSRFToken(token: string): boolean {
  const storedToken = localStorage.getItem('csrf-token');
  return storedToken === token;
}

const ENCRYPTION_KEY = 'tool-station-security-key';

let cachedKey: CryptoKey | null = null;

async function getKey(): Promise<CryptoKey> {
  if (cachedKey) return cachedKey;
  
  cachedKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(ENCRYPTION_KEY).slice(0, 16),
    { name: 'AES-CBC' },
    false,
    ['encrypt', 'decrypt']
  );
  
  return cachedKey;
}

export async function encryptData(data: string): Promise<string> {
  if (!data) return '';
  
  try {
    const key = await getKey();
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const encoded = new TextEncoder().encode(data);
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-CBC', iv },
      key,
      encoded
    );
    
    const encryptedArray = Array.from(new Uint8Array(encrypted));
    const ivArray = Array.from(iv);
    
    return JSON.stringify({ iv: ivArray, data: encryptedArray });
  } catch {
    return data;
  }
}

export async function decryptData(encrypted: string): Promise<string> {
  if (!encrypted) return '';
  
  try {
    const parsed = JSON.parse(encrypted);
    const key = await getKey();
    const iv = new Uint8Array(parsed.iv);
    const data = new Uint8Array(parsed.data);
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-CBC', iv },
      key,
      data
    );
    
    return new TextDecoder().decode(decrypted);
  } catch {
    return encrypted;
  }
}

export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function isValidDomain(domain: string): boolean {
  const regex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return regex.test(domain);
}

export function sanitizeFilename(filename: string): string {
  if (!filename) return '';
  
  return filename
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\.\./g, '.')
    .trim();
}

export function stripTags(text: string): string {
  if (!text) return '';
  
  const tmp = document.createElement('div');
  tmp.innerHTML = text;
  return tmp.textContent || tmp.innerText || '';
}

export function preventXSS(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function validateSearchQuery(query: string): string {
  const MAX_LENGTH = 200;
  
  let cleaned = sanitizeInput(query);
  cleaned = cleaned.trim();
  
  if (cleaned.length > MAX_LENGTH) {
    cleaned = cleaned.substring(0, MAX_LENGTH);
  }
  
  return cleaned;
}

export function generateSecureId(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  
  return result;
}