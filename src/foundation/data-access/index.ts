import type { ServiceContext, ServiceResult } from '../services'
import type { DataScope } from '../types'

export type PageRequest = {
  cursor?: string
  limit?: number
}

export type Page<TRecord> = {
  items: TRecord[]
  nextCursor?: string
  total?: number
}

export type ApiRequest<TBody = unknown> = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  body?: TBody
  query?: Record<string, string | number | boolean | undefined>
  requestedScope?: DataScope
}

/** Transport boundary for a future authenticated HTTPS API client. */
export interface ApiTransport {
  request<TResponse, TBody = unknown>(
    request: ApiRequest<TBody>,
    context?: ServiceContext,
  ): Promise<ServiceResult<TResponse>>
}

/** Backend-facing port. Components and modules do not import transport implementations directly. */
export interface DataAccessPort<TRecord, TQuery, TId = string> {
  list(query: TQuery & PageRequest, context?: ServiceContext): Promise<ServiceResult<Page<TRecord>>>
  get(id: TId, context?: ServiceContext): Promise<ServiceResult<TRecord>>
}

/** Mutation boundary for future module repositories; no transport implementation lives here. */
export interface CommandDataAccessPort<TCommand, TResult = void> {
  execute(command: TCommand, context?: ServiceContext): Promise<ServiceResult<TResult>>
}
