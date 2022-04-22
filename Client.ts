import Fetchr from "./Fetchr.js";
import {FetchrRequestType, FetchrOptionsType, FetchrResponseType, FetchrMethodsType} from "./types";

const ClientDefaultOptions: any = {
  method: 'GET'
}

class Client {
  public options = Object.assign({}, ClientDefaultOptions)

  constructor(config: any) {
    this.setOptions(config)
  }

  async fetch(method: FetchrMethodsType, request: any) {
    let mergedConf: FetchrRequestType = null
    if (typeof request === "string") {
      mergedConf = Object.assign({}, this.options, {url: request})
    } else {
      mergedConf = Object.assign({}, this.options, request)
    }

    mergedConf.method = method

    mergedConf.timeout && (mergedConf.timeout = parseDuration(mergedConf.timeout))
    mergedConf.cacheable && (mergedConf.cacheable = parseDuration(mergedConf.cacheable))

    // all other good stuff come here...

    return Fetchr(mergedConf)
        .then(async (res) => {
          let data = null
          try {
            if (res.request.type === "json") {
              data = await res.response.json()
            } else if (res.request.type === "text") {
              data = await res.response.text()
            } else if (res.request.type === "blob") {
              data = await new Promise(async (resolve, reject) => {
                data = await res.response.blob()
                const reader = await new FileReader();
                reader.onloadend = () => {
                  resolve(reader.result)
                }
                reader.readAsDataURL(data);
              })
            } else if (res.request.type === "buffer") {
              data = await res.response.arrayBuffer()
            } else if (res.request.type === "form") {
              data = await res.response.formData()
            }
          } catch (e) {
            //
          }
          res.data = data
          return res
        })
  }

  setOptions(config: any) {
    Object.assign(this.options, config)
    if (this.options.timeout) {
      this.options.timeout = parseDuration(this.options.timeout)
    }
    if (this.options.cacheable) {
      this.options.cacheable = parseDuration(this.options.cacheable)
    }
  }

  async GET(config: FetchrRequestType) {
    return await this.fetch('GET', config)
  }

  async DELETE(config: FetchrRequestType) {
    return await this.fetch('DELETE', config)
  }

  async HEAD(config: FetchrRequestType) {
    return await this.fetch('HEAD', config)
  }

  async OPTIONS(config: FetchrRequestType) {
    return await this.fetch('OPTIONS', config)
  }

  async POST(config: FetchrRequestType) {
    return await this.fetch('POST', config)
  }

  async PUT(config: FetchrRequestType) {
    return await this.fetch('PUT', config)
  }

  async PATCH(config: FetchrRequestType) {
    return await this.fetch('PATCH', config)
  }
}

/**
 * Convert duration as string in ms
 * ie: '1h' is convert as 1000 * 60 * 60 * 1 = 3600000
 * ie: '1d' is convert as 1000 * 60 * 60 * 24 = 86400000
 * @param duration
 * @return number
 */
const parseDuration = function (duration: string | number): number {
  if (typeof duration === "number") {
    return duration
  }
  let durationInMs = 0
  const matched = duration.match(/\d+|[a-z]+/g)
  for (let i = 0; i < matched.length; i = i + 2) {
    let value = Number(matched[i]) || 0
    let unit = matched[i + 1] || 'ms'
    let factor = 0
    switch (unit) {
      case "y":
        factor = 1000 * 60 * 60 * 24 * 365
        break
      case "w":
        factor = 1000 * 60 * 60 * 24 * 7
        break
      case "d":
        factor = 1000 * 60 * 60 * 24
        break
      case "h":
        factor = 1000 * 60 * 60
        break
      case "m":
        factor = 1000 * 60
        break
      case "s":
        factor = 1000
        break
      case "ms":
        factor = 1
        break
      default:
        // ignore unrecognized unit
        factor = 0
    }
    durationInMs += (value * factor)
  }
  return durationInMs
}
export default Client
