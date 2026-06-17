import crypto from 'crypto';

// The algorithm to use for symmetric encryption
const ALGORITHM = 'aes-256-gcm';

// We require a 32-byte secret for AES-256
const getEncryptionSecret = (): Buffer => {
  const secret = process.env.ENCRYPTION_SECRET;
  if (!secret) {
    throw new Error('SECURITY FAULT: ENCRYPTION_SECRET environment variable is missing.');
  }
  
  const buffer = Buffer.from(secret, 'utf-8');
  if (buffer.length !== 32) {
    throw new Error('SECURITY FAULT: ENCRYPTION_SECRET must be exactly 32 bytes long.');
  }
  
  return buffer;
};

export interface EncryptedData {
  encryptedData: string;
  iv: string;
  authTag: string;
}

/**
 * Encrypts a plaintext API key using AES-256-GCM.
 * Generates a unique 12-byte IV for every execution.
 */
export const encryptKey = (plainTextKey: string): EncryptedData => {
  try {
    const secret = getEncryptionSecret();
    
    // Generate a unique 12-byte Initialization Vector
    const iv = crypto.randomBytes(12);
    
    // Create the cipher
    const cipher = crypto.createCipheriv(ALGORITHM, secret, iv);
    
    // Encrypt the plaintext
    let encrypted = cipher.update(plainTextKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Extract the authentication tag verifying ciphertext integrity
    const authTag = cipher.getAuthTag().toString('hex');
    
    return {
      encryptedData: encrypted,
      iv: iv.toString('hex'),
      authTag,
    };
  } catch (error: any) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
};

/**
 * Decrypts an encrypted API key using AES-256-GCM.
 * Validates the authTag to ensure data integrity.
 */
export const decryptKey = (encryptedData: string, ivHex: string, authTagHex: string): string => {
  try {
    const secret = getEncryptionSecret();
    
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    // Create the decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, secret, iv);
    decipher.setAuthTag(authTag);
    
    // Decrypt the ciphertext
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error: any) {
    // Explicit security error to prevent corrupt data loops
    throw new Error(`SECURITY FAULT: Decryption failed or data integrity compromised. ${error.message}`);
  }
};
