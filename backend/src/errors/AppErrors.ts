import { GraphQLError } from 'graphql';

export class AppError extends GraphQLError{
  constructor(message: string, statusCode: number, code: string, field?: string){
    const extensions: Record<string, any> = { code, statusCode, timestamp: new Date().toISOString() };
    
    if (field) {
      extensions.validationErrors = { [field]: message };
    }

    super(message, { extensions });
  }
}

export class NotFoundError extends AppError{
  constructor(resource: string, field?: string){
    super(`${resource} not found`, 404, 'NOT_FOUND', field);
  }
}

export class ConflictError extends AppError{
  constructor(message: string, field?: string){
    super(message, 409, 'CONFLICT', field);
  }
}
