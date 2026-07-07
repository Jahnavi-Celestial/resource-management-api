import { GraphQLError } from 'graphql';

export class AppError extends GraphQLError{
  constructor(message: string, statusCode: number, code: string) {
    super(message, {
      extensions: { code, statusCode, timestamp: new Date().toISOString() },
    });
  }
}

export class NotFoundError extends AppError{
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError{
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
  }
}
