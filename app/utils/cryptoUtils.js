const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function encryptData(plainText, key) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = encoder.encode(plainText);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );
  return { encrypted, iv };
}

export async function decryptData(encrypted, iv, key) {
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encrypted
  );
  return decoder.decode(decrypted);
}

export async function getKey() {
  let key = await getKeyFromLocalStorage();
  if (!key) {
    key = await generateKey();
    await saveKeyToLocalStorage(key);
  }
  return key;
}

async function getKeyFromLocalStorage() {
  const keyData = localStorage.getItem("cryptoKey");
  if (keyData) {
    const key = await window.crypto.subtle.importKey(
      "jwk",
      JSON.parse(keyData),
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
    return key;
  }
  return null;
}

export async function generateKey() {
  return window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

async function saveKeyToLocalStorage(key) {
  const exportedKey = await window.crypto.subtle.exportKey("jwk", key);
  localStorage.setItem("cryptoKey", JSON.stringify(exportedKey));
}

export function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function base64ToArrayBuffer(base64) {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}
