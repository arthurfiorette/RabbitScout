import type { AuthSession, RabbitMQUser } from '@/lib/rabbitmq/types'

export const COOKIE_NAME = 'rmq-session'

/**
 * Create the value stored in the auth session cookie.
 */
export function createSession(credentials: string, user: RabbitMQUser): AuthSession {
  return { credentials, user }
}

/**
 * Determine whether the session cookie should use the Secure attribute.
 */
export function isSecureRequest(request: Request): boolean {
  const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim()

  if (forwardedProto) {
    return forwardedProto === 'https'
  }

  return new URL(request.url).protocol === 'https:'
}

/**
 * Build the shared options used when setting the auth session cookie.
 */
export function sessionCookieOptions(request: Request) {
  return {
    httpOnly: true,
    secure: isSecureRequest(request),
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  }
}
