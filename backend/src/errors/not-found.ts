import BaseError from './base-error';

export default class NotFoundError extends BaseError {
  name = 'NotFoundError';
  statusCode = 404;
}
