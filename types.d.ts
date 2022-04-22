export type FetchrMethodsType =
    | 'DELETE'
    | 'GET'
    | 'HEAD'
    | 'OPTIONS'
    | 'PATCH'
    | 'POST'
    | 'PUT'

export type FetchrResponseTypeType =
    | 'json'
    | 'text'
    | 'blob'

export type FetchrRequestBodyType =
    | 'json'
    | 'form'
    | 'buffer'
    | 'blob'
    | 'text'
    | 'body'
    | 'data'

export type FetchrRequestType = {
  [key in FetchrRequestBodyType]: any
} & {
  url: string
  method: FetchrMethodsType
  id: string
  cacheable?: number
  cancellable?: boolean
  timeout?: number
  query?: any
  headers?: any
  type?: FetchrResponseTypeType
  signal?: AbortSignal
  options?: FetchrOptionsType
  ignoreCache?: boolean
  startAt: number
  endAt: number
}

export interface FetchrOptionsType {
  storageName?: string
  version?: string,
  default: {
    cache?: number,
    status?: number
  }
  timeout?: string | number
  query?: {
    splitArray?: boolean
  }
  axiosCompat: boolean

  [key: string]: any
}

export interface FetchrResponseType {
  request: FetchrRequestType,
  response: Response,
  status: number,
  statusText: string;
  error: boolean,
  aborted: boolean,
  timeout: boolean
  redirected: boolean
}

export interface FetchStorageType {
  [key: string]: any
}

export interface FetchCancelStorageType {
  [key: string]: AbortController
}
