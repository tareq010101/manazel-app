import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiError } from '@shared/errors/ApiError';

type ValidationTarget = 'body' | 'query' | 'params';

export const validate = (
  schema: Joi.ObjectSchema,
  target: ValidationTarget = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[target], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((d) => d.message).join(', ');
      return next(ApiError.badRequest(messages));
    }

    req[target] = value;
    next();
  };
};