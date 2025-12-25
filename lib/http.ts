import type { Context } from 'hono'

export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const

export class ApiResponse<T> {
  success: boolean
  constructor(
    public statusCode: number,
    public data: T,
    public message: string
  ) {
    this.success = statusCode >= 200 && statusCode < 400
  }
}

export class ApiError extends Error {
  success: boolean
  data: null
  statusCode: number

  constructor(statusCode: number, message = 'Something went wrong', stack = '') {
    super(message)
    this.statusCode = statusCode
    this.data = null
    this.success = false
    this.message = message

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export const ok = <T>(c: Context, data: T, message = 'Success') =>
  c.json(new ApiResponse(HttpStatus.OK, data, message), 200)

export const created = <T>(c: Context, data: T, message = 'Created') =>
  c.json(new ApiResponse(HttpStatus.CREATED, data, message), 201)

export const error = (status: number, message: string) => {
  throw new ApiError(status, message)
}
