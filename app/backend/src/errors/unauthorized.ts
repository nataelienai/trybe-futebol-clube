import BaseError from './base-error';

export default class UnauthorizedError extends BaseError {
  name = 'UnauthorizedError';
  statusCode = 401;
}
