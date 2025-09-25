import { z } from 'zod';

// Security validation schemas
export const secureEmailSchema = z
  .string()
  .trim()
  .email({ message: "Invalid email address" })
  .max(255, { message: "Email must be less than 255 characters" })
  .refine((email) => !email.includes('<') && !email.includes('>'), {
    message: "Email contains invalid characters"
  });

export const secureNameSchema = z
  .string()
  .trim()
  .min(1, { message: "Name is required" })
  .max(50, { message: "Name must be less than 50 characters" })
  .regex(/^[a-zA-Z\s'-]+$/, { 
    message: "Name can only contain letters, spaces, hyphens, and apostrophes" 
  });

export const strongPasswordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(128, { message: "Password must be less than 128 characters" })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: "Password must contain at least one lowercase letter, one uppercase letter, and one number"
  });

// Input sanitization functions
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML/script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .slice(0, 1000); // Limit input length
};

export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Security logging functions
export const logSecurityEvent = (event: string, details: Record<string, any>) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.warn('SECURITY EVENT:', logEntry);
  }
  
  // In production, you would send this to a security monitoring service
  // Example: await fetch('/api/security-log', { method: 'POST', body: JSON.stringify(logEntry) });
};

// Role validation
export const validateRole = (role: string): role is 'customer' | 'admin' | 'super_admin' => {
  return ['customer', 'admin', 'super_admin'].includes(role);
};

// Check for common injection patterns
export const hasInjectionPatterns = (input: string): boolean => {
  const patterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick, onload, etc.
    /data:text\/html/i,
    /vbscript:/i,
    /<iframe/i,
    /<object/i,
    /<embed/i
  ];
  
  return patterns.some(pattern => pattern.test(input));
};

// Rate limiting helper (client-side basic implementation)
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}
  
  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(timestamp => now - timestamp < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    return true;
  }
  
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// Create global rate limiter instance
export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
export const adminActionRateLimiter = new RateLimiter(10, 5 * 60 * 1000); // 10 actions per 5 minutes