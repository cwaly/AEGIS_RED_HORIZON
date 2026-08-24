// Cifrado opt-in del localStorage (sesiones/engagements) con una passphrase que el
// usuario elige. La clave AES-GCM se deriva vía PBKDF2 y nunca se persiste — solo vive
// en memoria (React state) mientras la sesión del navegador está desbloqueada. Si el
// usuario olvida la passphrase, los datos cifrados son irrecuperables por diseño (igual
// que cualquier cifrado real); el panel OPSEC ofrece un "borrar datos cifrados" como
// única vía de escape para no dejar al usuario fuera de la app para siempre.

const SALT_KEY = 'aegis_crypto_salt';
const VERIFIER_KEY = 'aegis_crypto_verifier';
const ENABLED_KEY = 'aegis_encryption_enabled';
const VERIFIER_PLAINTEXT = 'AEGIS_VAULT_OK';
const PBKDF2_ITERATIONS = 250000;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function toBase64(buf: ArrayBuffer): string {
  let binary = '';
  new Uint8Array(buf).forEach((b) => { binary += String.fromCharCode(b); });
  return btoa(binary);
}

function fromBase64(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

export function isEncryptionEnabled(): boolean {
  return localStorage.getItem(ENABLED_KEY) === 'true';
}

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey('raw', textEncoder.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptString(key: CryptoKey, plaintext: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipherBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv as BufferSource }, key, textEncoder.encode(plaintext));
  return `${toBase64(iv.buffer)}.${toBase64(cipherBuf)}`;
}

export async function decryptString(key: CryptoKey, payload: string): Promise<string> {
  const [ivB64, cipherB64] = payload.split('.');
  const iv = fromBase64(ivB64);
  const cipherBuf = fromBase64(cipherB64).buffer;
  const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv as BufferSource }, key, cipherBuf as ArrayBuffer);
  return textDecoder.decode(plainBuf);
}

// Activa el cifrado por primera vez (o lo re-arma con una passphrase nueva) y devuelve
// la clave lista para usar de inmediato, sin pedirle al usuario que la reingrese.
export async function setupEncryption(passphrase: string): Promise<CryptoKey> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(passphrase, salt);
  const verifier = await encryptString(key, VERIFIER_PLAINTEXT);
  localStorage.setItem(SALT_KEY, toBase64(salt.buffer));
  localStorage.setItem(VERIFIER_KEY, verifier);
  localStorage.setItem(ENABLED_KEY, 'true');
  return key;
}

// Intenta desbloquear con la passphrase dada. Devuelve la clave si es correcta, o null
// si la passphrase es incorrecta / no hay cifrado configurado.
export async function unlockEncryption(passphrase: string): Promise<CryptoKey | null> {
  const saltB64 = localStorage.getItem(SALT_KEY);
  const verifier = localStorage.getItem(VERIFIER_KEY);
  if (!saltB64 || !verifier) return null;
  try {
    const key = await deriveKey(passphrase, fromBase64(saltB64));
    const check = await decryptString(key, verifier);
    return check === VERIFIER_PLAINTEXT ? key : null;
  } catch {
    return null;
  }
}

export function disableEncryption(): void {
  localStorage.removeItem(SALT_KEY);
  localStorage.removeItem(VERIFIER_KEY);
  localStorage.removeItem(ENABLED_KEY);
}

// Borra únicamente los datos cifrados (sesiones/engagements) y la config de cifrado,
// para cuando el usuario olvidó la passphrase y necesita recuperar acceso a la app.
export function wipeEncryptedData(): void {
  localStorage.removeItem('aegis_sessions');
  localStorage.removeItem('aegis_engagements');
  localStorage.removeItem('aegis_active_engagement');
  disableEncryption();
}
