import { GraphQLFormattedError } from "graphql";

export const formatError = (formattedError: GraphQLFormattedError, error: any): GraphQLFormattedError => {
  const originalError = error?.originalError;

  if (originalError && originalError.name === 'ArgumentValidationError') {
    const fieldErrors: Record<string, string> = {};
    const validationErrors = originalError.validationErrors || [];

    for (const err of validationErrors) {
      if (err.constraints) {
        const constraintKeys = Object.keys(err.constraints);
        const firstKey = constraintKeys[0];
        fieldErrors[err.property] = err.constraints[String(firstKey)];
      }
    }

    return {
      message: 'Validation Failed',
      extensions: {
        code: 'BAD_USER_INPUT',
        statusCode: 400,
        timestamp: new Date().toISOString(),
        validationErrors: fieldErrors,
      },
    };
  }

  if (formattedError.extensions?.validationErrors) {
    const error = (formattedError.extensions?.validationErrors as any)?.[0]
    return {
      message: error?.constraints?.min || error?.constraints?.minLength || error?.constraints?.isEmail || error?.constraints?.isAlpha || formattedError.message,
      extensions: {
        code: formattedError.extensions.code || 'BAD_USER_INPUT',
        statusCode: formattedError.extensions.statusCode || 400,
        timestamp: formattedError.extensions.timestamp || new Date().toISOString(),
        validationErrors: formattedError.extensions.validationErrors,
      },
    };
  }

  return formattedError;
};