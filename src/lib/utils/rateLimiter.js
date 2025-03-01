import { RateLimiterMemory } from 'rate-limiter-flexible';

// todo: adjust duration later?
// Consider keeping it at 10 requests per minute for unauthorized requests and 30 or 60 for authenticated requests
const rateLimiter = new RateLimiterMemory({
	points: 10, // 10 requests
	duration: 60 // 1 minute
});

export async function rateLimit(ipAddress) {
	try {
		await rateLimiter.consume(ipAddress);
	} catch (rateLimiterRes) {
		throw new Error(`Rate limit exceeded. Try again in ${rateLimiterRes.msBeforeNext}ms`);
	}
}
