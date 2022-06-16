import BaseError from './base-error';

export default class BadRequestError extends BaseError {
  name = 'BadRequestError';
  statusCode = 400;
}
