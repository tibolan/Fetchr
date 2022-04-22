import {
  FetchrOptionsType,
  FetchrRequestType,
  FetchrResponseType,
  FetchCancelStorageType,
  FetchStorageType
} from "./types";

const CacheStorageSupported = (caches && caches instanceof CacheStorage) || false
const FetchrCancelStorage: FetchCancelStorageType = {}
let FetchrStore: FetchStorageType = null

class AbortTimeoutError extends Error {
  constructor(message = "", cause:any) {
    // @ts-ignore
    super(message, cause);
    this.message = message
    this.name = "AbortTimeout"
  }
}

const parseRequest = function (request: FetchrRequestType, options: FetchrOptionsType): FetchrRequestType {
  /** BUILD PROPER URL */
  const url = new URL(request.url)
  if (request.query) {
    let SearchParams = new URLSearchParams(request.query)
    if (options.query.splitArray) {
      // rewrite all query as array
      for (let param in request.query) {
        if (Array.isArray(request.query[param])) {
          SearchParams.delete(param)
          for (let value of request.query[param]) {
            SearchParams.append(param, value)
          }
        }
      }
    }
    url.search = SearchParams.toString()
  }
  request.url = url.toString()

  /** ADD CANCELLABLE/TIMEOUT SUPPORT */
  if (request.cancellable || request.timeout) {
    if (request.cancellable) {
      cancelRequest(request)
    }
    const controller = new AbortController();
    request.signal = controller.signal
    FetchrCancelStorage[request.url] = controller
  }

  /** SUGAR FOR BODY CONSTRUCTION */

  /* AXIOS compat */
  if (options.axiosCompat) {
    request.body = request.data
  }
  /* JSON type */
  else if (request.json) {
    try {
      request.body = JSON.stringify(request.json)
    } catch (e) {
      request.body = request.json
    }
    request.headers['Content-Type'] = "application/json"
    delete request.json
  }
  /* FORM type*/
  else if (request.form) {
    let form = new URLSearchParams()
    for (let field in request.form) {
      form.append(field, request.form[field])
    }
    request.body = form
    delete request.form
  }
  /* @todo: BLOB type ?*/
  return request
}

const buildResponse = function (request: FetchrRequestType, response: any, options: FetchrOptionsType): FetchrResponseType {
  const isError = response instanceof Error
  const isFail = !response.ok
  const isAborted = isError && response.name === "AbortError"
  const isTimeout = isError && response.name === "AbortTimeout"

  const resp:FetchrResponseType = {
    request,
    response,
    ok: !isFail,
    status: response.status || options.default.status,
    statusText: response.statusText || "",
    error: isError || isFail,
    aborted: isAborted,
    timeout: isTimeout,
    redirected: response.redirected || false
  }
  if (isError) {
    resp.statusText = response.message
    resp.errorType = response.name
  }

  return resp
}

const cancelRequest = function (request: FetchrRequestType) {
  let canceler: AbortController = FetchrCancelStorage[request.url]
  if (canceler) {
    canceler.abort()
  }
}

const checkCache = async function (request: FetchrRequestType, options: FetchrOptionsType) {
  if (request.ignoreCache) return false
  let cacheStorage = await caches.open(options.version)
  let cachedRequest = await cacheStorage.match(request.url)
  let storeObject: any = FetchrStore[options.version]
  if (cachedRequest && storeObject[request.url]) {
    try {
      return storeObject[request.url].expireDate > Date.now()
    } catch (e) {
      return false
    }
  }
  return false
}

const setCache = async function (request: FetchrRequestType, response: Response, options: FetchrOptionsType) {
  let version = options.version
  let cacheStorage = await caches.open(version)
  let duration = request.cacheable || options.default.cache

  FetchrStore[options.version][request.url] = {
    expireDate: Date.now() + duration,
    duration: request.cacheable
  }

  await cacheStorage.put(request.url, await response.clone())
  await saveStore(options.storageName)
  return true
}

const unsetCache = async function (request: FetchrRequestType, options: FetchrOptionsType) {
  let version = options.version
  let cacheStorage = await caches.open(version)
  await cacheStorage.delete(request.url)
  delete FetchrStore[version][request.url]
  await saveStore(options.storageName)
  return true
}

const saveStore = async function (name: string) {
  if (FetchrStore) {
    localStorage.setItem(name, JSON.stringify(FetchrStore))
  }
}
/**
 * use requestAnimationFrame to check if a request should be cancelled because of timeout exceeded
 * @param request
 */
const checkTimeout = function (request: FetchrRequestType) {
  let sum = request.startAt + request.timeout
  if ( Date.now() - sum >= 0) {
    cancelRequest(request)
  } else if (!request.endAt){
    requestAnimationFrame(() => {
      checkTimeout(request)
    })
  }
}

let FetchrOptions: FetchrOptionsType = {
  storageName: "FetchrStore",
  version: "1.0.0",
  default: {
    cache: 1000 * 60 * 60,
    status: 0
  },
  timeout: 0,
  query: {
    splitArray: false
  },
  axiosCompat: false
}

const Fetchr = async function (request: FetchrRequestType): Promise<FetchrResponseType> {
  let options = Object.assign({}, FetchrOptions, request.options)

  if (!FetchrStore) {
    FetchrStore = JSON.parse(localStorage.getItem(options.storageName)) || { [options.version]: {}}
  }

  try {
    request = parseRequest(request, options)
  } catch (error) {
    return Promise.reject(buildResponse(request, error, options))
  }

  /** ADD CACHE SUPPORT */
  if (request.cacheable && CacheStorageSupported && request.method === "GET") {
    let cacheStorage = await caches.open(options.version)
    const cache = await cacheStorage.match(request.url)

    if (cache && cache.ok && await checkCache(request, options)) {
      /* if cache valid */
      return Promise.resolve(buildResponse(request, cache, options))
    } else if (cache) {
      /* if cache not valid, delete old cache entry */
      await unsetCache(request, options)
    }
  }

  if (request.timeout) {
    if (!isNaN(request.timeout)) {
      request.startAt = Date.now()
      checkTimeout(request)
    }
  }

  return window.fetch(request.url, request)
      .then(async (response) => {
        request.endAt = Date.now()

        if (request.cacheable && response.ok) {
          await setCache(request, response, options).catch((e) => {
            console.warn(e)
          })
        }

        if (response.ok) {
          return Promise.resolve(buildResponse(request, response, options))
        } else {
          throw response
        }
      })
      .catch((error) => {
        request.endAt = Date.now()
        if (request.timeout && (request.startAt + request.timeout) < request.endAt) {
          return Promise.reject(buildResponse(request, new AbortTimeoutError('request aborted because of timeout', {
            cause: error
          }), options))
        }
        return Promise.reject(buildResponse(request, error, options))
      })
}

/*
* set global options
* */
Fetchr.setOptions = function (options: FetchrOptionsType) {
  FetchrOptions = Object.assign({}, FetchrOptions, options)
}

export default Fetchr
