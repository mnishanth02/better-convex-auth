/**
 * Token Generation Utilities
 *
 * Secure random token generation for authentication purposes.
 */

/**
 * Generate a cryptographically secure random string
 * @param length - Length of the string to generate
 * @param charset - Character set to use (default: alphanumeric)
 * @returns Random string
 */
export function generateRandomString(
  length: number,
  charset: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
): string {
  if (typeof crypto === "undefined") {
    throw new Error("Crypto API not available");
  }

  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);

  let result = "";
  for (let i = 0; i < length; i++) {
    const randomValue = randomValues[i];
    if (randomValue !== undefined) {
      result += charset[randomValue % charset.length];
    }
  }

  return result;
}

/**
 * Generate a URL-safe random token
 * @param length - Length of the token (default: 32)
 * @returns URL-safe random token
 */
export function generateToken(length: number = 32): string {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  return generateRandomString(length, charset);
}

/**
 * Generate a numeric OTP (One-Time Password)
 * @param length - Length of the OTP (default: 6)
 * @returns Numeric OTP string
 */
export function generateOTP(length: number = 6): string {
  const charset = "0123456789";
  return generateRandomString(length, charset);
}

/**
 * Generate a backup code for 2FA
 * @returns 10-character alphanumeric backup code
 */
export function generateBackupCode(): string {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return generateRandomString(10, charset);
}

/**
 * Generate multiple backup codes
 * @param count - Number of backup codes to generate (default: 10)
 * @returns Array of backup codes
 */
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    codes.push(generateBackupCode());
  }
  return codes;
}

/**
 * Generate a verification token (for email verification, password reset, etc.)
 * @returns 64-character verification token
 */
export function generateVerificationToken(): string {
  return generateToken(64);
}

/**
 * Generate a session token
 * @returns 128-character session token
 */
export function generateSessionToken(): string {
  return generateToken(128);
}

/**
 * Generate an API key
 * @param prefix - Optional prefix (e.g., "sk_live_", "pk_test_")
 * @returns API key with optional prefix
 */
export function generateAPIKey(prefix?: string): string {
  const token = generateToken(48);
  return prefix ? `${prefix}${token}` : token;
}

/**
 * Hash a token using SHA-256 (for storing in database)
 * @param token - Token to hash
 * @returns Hex-encoded hash
 */
export async function hashTokenAsync(token: string): Promise<string> {
  if (typeof crypto === "undefined" || !crypto.subtle) {
    throw new Error("Web Crypto API not available");
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  return hashHex;
}

/**
 * Verify a token against its hash
 * @param token - Token to verify
 * @param hash - Hash to verify against
 * @returns True if token matches hash
 */
export async function verifyTokenHash(token: string, hash: string): Promise<boolean> {
  const tokenHash = await hashTokenAsync(token);
  return tokenHash === hash;
}

/**
 * Check if a token has expired
 * @param expiresAt - Expiration timestamp (milliseconds since epoch)
 * @returns True if token has expired
 */
export function isTokenExpired(expiresAt: number): boolean {
  return Date.now() > expiresAt;
}

/**
 * Calculate expiration timestamp
 * @param expiresIn - Expiration duration in seconds
 * @returns Expiration timestamp (milliseconds since epoch)
 */
export function calculateExpiresAt(expiresIn: number): number {
  return Date.now() + expiresIn * 1000;
}

/**
 * Format a token for display (show first and last 4 characters)
 * @param token - Token to format
 * @returns Formatted token (e.g., "abcd...wxyz")
 */
export function formatTokenForDisplay(token: string): string {
  if (token.length <= 8) {
    return token;
  }
  const start = token.slice(0, 4);
  const end = token.slice(-4);
  return `${start}...${end}`;
}

/**
 * Generate a password reset token
 * @returns 64-character password reset token
 */
export function generatePasswordResetToken(): string {
  return generateToken(64);
}

/**
 * Hash a token synchronously using a simple hash (for Convex server-side)
 * Note: This uses a simple hash suitable for server-side token storage
 * @param token - Token to hash
 * @returns Hex-encoded hash
 */
export function hashToken(token: string): string {
  // Simple deterministic hash for server-side use
  // In production, you might want to use a more robust hashing algorithm
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    const char = token.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(16, "0");
}

/**
 * Verify if a token has expired
 * @param expiresAt - Expiration timestamp (milliseconds since epoch)
 * @returns True if token is still valid
 */
export function verifyTokenExpiry(expiresAt: number): boolean {
  return Date.now() < expiresAt;
}
