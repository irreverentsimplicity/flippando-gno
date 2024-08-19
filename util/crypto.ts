import { entropyToMnemonic } from '@cosmjs/crypto/build/bip39';
import CryptoJS from 'crypto-js';

/**
 * Generates a random bip39 mnemonic
 */
export const generateMnemonic = (): string => {
  const array = new Uint8Array(32);
  self.crypto.getRandomValues(array);

  return entropyToMnemonic(array);
};

export const encryptMnemonic = (mnemonic, password) => {
  return CryptoJS.AES.encrypt(mnemonic, password).toString();
}

export const decryptMnemonic = (encryptedMnemonic, password) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedMnemonic, password);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null; // Return null if decryption fails
  } catch (error) {
    return null; // Return null on error
  }
}