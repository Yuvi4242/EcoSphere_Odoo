export interface DecodedJWT {
  userId: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "EMPLOYEE";
  department?: string;
  name: string;
  exp: number;
}

/**
 * Decodes a JWT token safely in Next.js Edge Runtime without relying on Node.js 'crypto' APIs.
 */
export function decodeJwt(token: string): DecodedJWT | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    
    // Base64Url decode using standard browser/edge atob API
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    
    const decoded = JSON.parse(jsonPayload) as DecodedJWT;
    
    // Check expiration
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    return null;
  }
}
