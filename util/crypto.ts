import { entropyToMnemonic } from '@cosmjs/crypto/build/bip39';

/**
 * Generates a random bip39 mnemonic
 */
export const generateMnemonic = (): string => {
  const array = new Uint8Array(32);
  self.crypto.getRandomValues(array);

  return entropyToMnemonic(array);
};

export const validateMnemonic = (mnemonic: string) => {
  // Check if mnemonic has either 12 or 24 words
  const words = mnemonic.trim().split(/\s+/);
  if (words.length !== 12 && words.length !== 24) {
    return false;  // Invalid mnemonic length
  }
  return true;
};

// Derives a key using PBKDF2 from the password
export const deriveKey = async (password: string, salt: string) => {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// Encrypt the mnemonic using the derived key
export const encryptMnemonic = async (key: CryptoKey, mnemonic: string) => {
  const enc = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Generate a random IV
  const encryptedMnemonic = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    enc.encode(mnemonic)
  );
  // Store both the IV and the encrypted mnemonic
  return { iv: Array.from(iv), data: Array.from(new Uint8Array(encryptedMnemonic)) };
}

// Decrypts the mnemonic using the derived key
export const decryptMnemonic = async (key: CryptoKey, encryptedData: { iv: Iterable<number>; data: Iterable<number>; }) => {
  const enc = new TextEncoder();
  const iv = new Uint8Array(encryptedData.iv);
  const encryptedMnemonic = new Uint8Array(encryptedData.data);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encryptedMnemonic
  );
  const dec = new TextDecoder();
  return dec.decode(decryptedBuffer);
}