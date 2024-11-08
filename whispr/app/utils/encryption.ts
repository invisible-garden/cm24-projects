// src/utils/encryption.js
import CryptoJS from "crypto-js";

export const encryptData = (data: unknown, password: string) => {
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    password
  ).toString();
  return encodeURIComponent(ciphertext);
};

export const decryptData = (ciphertext: string, password: string) => {
  const bytes = CryptoJS.AES.decrypt(decodeURIComponent(ciphertext), password);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedData);
};
