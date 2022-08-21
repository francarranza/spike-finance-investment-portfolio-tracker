import { BaseError } from '../../../../application/common/errors/BaseError';

export class RepositoryError extends BaseError {}
export class SqliteError extends BaseError {}
export class NotFound extends RepositoryError {}
