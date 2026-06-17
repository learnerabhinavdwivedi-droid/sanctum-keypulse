import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 10 requests per 10 seconds
export const rateLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
});

/**
 * Helper function to safely check rate limit.
 * If UPSTASH_REDIS_REST_URL is missing, it will bypass rate limiting
 * so local development without Redis doesn't break, but issues a warning.
 */
export async function checkRateLimit(identifier: string) {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn("Missing Upstash Redis credentials. Rate limiting is disabled.");
    return { success: true };
  }
  
  try {
    const { success, limit, remaining, reset } = await rateLimiter.limit(identifier);
    return { success, limit, remaining, reset };
  } catch (error) {
    console.error("Rate limiting error:", error);
    // Fail open in case Redis goes down so we don't break the app entirely,
    // though in high-security apps you might want to fail closed.
    return { success: true };
  }
}
