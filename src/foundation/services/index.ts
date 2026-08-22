export type ServiceContext = {
  signal?: AbortSignal
  requestId?: string
  /** A UI selection only; backend authorization never trusts this value by itself. */
  requestedScope?: import('../types').DataScope
}

export type ServiceResult<TData> =
  | { ok: true; data: TData }
  | { ok: false; code: string; message: string; retryable?: boolean }

/** A module-facing service. UI calls this contract, never API clients directly. */
export interface QueryService<TQuery, TResult> {
  query(query: TQuery, context?: ServiceContext): Promise<ServiceResult<TResult>>
}

export interface CommandService<TCommand, TResult = void> {
  execute(command: TCommand, context?: ServiceContext): Promise<ServiceResult<TResult>>
}
