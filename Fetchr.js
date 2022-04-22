var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var CacheStorageSupported = (caches && caches instanceof CacheStorage) || false;
var FetchrCancelStorage = {};
var FetchrStore = null;
var AbortTimeoutError = (function (_super) {
    __extends(AbortTimeoutError, _super);
    function AbortTimeoutError(message, cause) {
        if (message === void 0) { message = ""; }
        var _this = _super.call(this, message, cause) || this;
        _this.message = message;
        _this.name = "AbortTimeout";
        return _this;
    }
    return AbortTimeoutError;
}(Error));
var parseRequest = function (request, options) {
    var url = new URL(request.url);
    if (request.query) {
        var SearchParams = new URLSearchParams(request.query);
        if (options.query.splitArray) {
            for (var param in request.query) {
                if (Array.isArray(request.query[param])) {
                    SearchParams["delete"](param);
                    for (var _i = 0, _a = request.query[param]; _i < _a.length; _i++) {
                        var value = _a[_i];
                        SearchParams.append(param, value);
                    }
                }
            }
        }
        url.search = SearchParams.toString();
    }
    request.url = url.toString();
    if (request.cancellable || request.timeout) {
        if (request.cancellable) {
            cancelRequest(request);
        }
        var controller = new AbortController();
        request.signal = controller.signal;
        FetchrCancelStorage[request.url] = controller;
    }
    if (options.axiosCompat) {
        request.body = request.data;
    }
    else if (request.json) {
        try {
            request.body = JSON.stringify(request.json);
        }
        catch (e) {
            request.body = request.json;
        }
        request.headers['Content-Type'] = "application/json";
        delete request.json;
    }
    else if (request.form) {
        var form = new URLSearchParams();
        for (var field in request.form) {
            form.append(field, request.form[field]);
        }
        request.body = form;
        delete request.form;
    }
    return request;
};
var buildResponse = function (request, response, options) {
    var isError = response instanceof Error;
    var isFail = !response.ok;
    var isAborted = isError && response.name === "AbortError";
    var isTimeout = isError && response.name === "AbortTimeout";
    var resp = {
        request: request,
        response: response,
        ok: !isFail,
        status: response.status || options["default"].status,
        statusText: response.statusText || "",
        error: isError || isFail,
        aborted: isAborted,
        timeout: isTimeout,
        redirected: response.redirected || false
    };
    if (isError) {
        resp.statusText = response.message;
        resp.errorType = response.name;
    }
    return resp;
};
var cancelRequest = function (request) {
    var canceler = FetchrCancelStorage[request.url];
    if (canceler) {
        canceler.abort();
    }
};
var checkCache = function (request, options) {
    return __awaiter(this, void 0, void 0, function () {
        var cacheStorage, cachedRequest, storeObject;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (request.ignoreCache)
                        return [2, false];
                    return [4, caches.open(options.version)];
                case 1:
                    cacheStorage = _a.sent();
                    return [4, cacheStorage.match(request.url)];
                case 2:
                    cachedRequest = _a.sent();
                    storeObject = FetchrStore[options.version];
                    if (cachedRequest && storeObject[request.url]) {
                        try {
                            return [2, storeObject[request.url].expireDate > Date.now()];
                        }
                        catch (e) {
                            return [2, false];
                        }
                    }
                    return [2, false];
            }
        });
    });
};
var setCache = function (request, response, options) {
    return __awaiter(this, void 0, void 0, function () {
        var version, cacheStorage, duration, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    version = options.version;
                    return [4, caches.open(version)];
                case 1:
                    cacheStorage = _d.sent();
                    duration = request.cacheable || options["default"].cache;
                    FetchrStore[options.version][request.url] = {
                        expireDate: Date.now() + duration,
                        duration: request.cacheable
                    };
                    _b = (_a = cacheStorage).put;
                    _c = [request.url];
                    return [4, response.clone()];
                case 2: return [4, _b.apply(_a, _c.concat([_d.sent()]))];
                case 3:
                    _d.sent();
                    return [4, saveStore(options.storageName)];
                case 4:
                    _d.sent();
                    return [2, true];
            }
        });
    });
};
var unsetCache = function (request, options) {
    return __awaiter(this, void 0, void 0, function () {
        var version, cacheStorage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    version = options.version;
                    return [4, caches.open(version)];
                case 1:
                    cacheStorage = _a.sent();
                    return [4, cacheStorage["delete"](request.url)];
                case 2:
                    _a.sent();
                    delete FetchrStore[version][request.url];
                    return [4, saveStore(options.storageName)];
                case 3:
                    _a.sent();
                    return [2, true];
            }
        });
    });
};
var saveStore = function (name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (FetchrStore) {
                localStorage.setItem(name, JSON.stringify(FetchrStore));
            }
            return [2];
        });
    });
};
var checkTimeout = function (request) {
    var sum = request.startAt + request.timeout;
    if (Date.now() - sum >= 0) {
        cancelRequest(request);
    }
    else if (!request.endAt) {
        requestAnimationFrame(function () {
            checkTimeout(request);
        });
    }
};
var FetchrOptions = {
    storageName: "FetchrStore",
    version: "1.0.0",
    "default": {
        cache: 1000 * 60 * 60,
        status: 0
    },
    timeout: 0,
    query: {
        splitArray: false
    },
    axiosCompat: false
};
var Fetchr = function (request) {
    return __awaiter(this, void 0, void 0, function () {
        var options, cacheStorage, cache, _a;
        var _b;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    options = Object.assign({}, FetchrOptions, request.options);
                    if (!FetchrStore) {
                        FetchrStore = JSON.parse(localStorage.getItem(options.storageName)) || (_b = {}, _b[options.version] = {}, _b);
                    }
                    try {
                        request = parseRequest(request, options);
                    }
                    catch (error) {
                        return [2, Promise.reject(buildResponse(request, error, options))];
                    }
                    if (!(request.cacheable && CacheStorageSupported && request.method === "GET")) return [3, 7];
                    return [4, caches.open(options.version)];
                case 1:
                    cacheStorage = _c.sent();
                    return [4, cacheStorage.match(request.url)];
                case 2:
                    cache = _c.sent();
                    _a = cache && cache.ok;
                    if (!_a) return [3, 4];
                    return [4, checkCache(request, options)];
                case 3:
                    _a = (_c.sent());
                    _c.label = 4;
                case 4:
                    if (!_a) return [3, 5];
                    return [2, Promise.resolve(buildResponse(request, cache, options))];
                case 5:
                    if (!cache) return [3, 7];
                    return [4, unsetCache(request, options)];
                case 6:
                    _c.sent();
                    _c.label = 7;
                case 7:
                    if (request.timeout) {
                        if (!isNaN(request.timeout)) {
                            request.startAt = Date.now();
                            checkTimeout(request);
                        }
                    }
                    return [2, window.fetch(request.url, request)
                            .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        request.endAt = Date.now();
                                        if (!(request.cacheable && response.ok)) return [3, 2];
                                        return [4, setCache(request, response, options)["catch"](function (e) {
                                                console.warn(e);
                                            })];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2:
                                        if (response.ok) {
                                            return [2, Promise.resolve(buildResponse(request, response, options))];
                                        }
                                        else {
                                            throw response;
                                        }
                                        return [2];
                                }
                            });
                        }); })["catch"](function (error) {
                            request.endAt = Date.now();
                            if (request.timeout && (request.startAt + request.timeout) < request.endAt) {
                                return Promise.reject(buildResponse(request, new AbortTimeoutError('request aborted because of timeout', {
                                    cause: error
                                }), options));
                            }
                            return Promise.reject(buildResponse(request, error, options));
                        })];
            }
        });
    });
};
Fetchr.setOptions = function (options) {
    FetchrOptions = Object.assign({}, FetchrOptions, options);
};
export default Fetchr;
//# sourceMappingURL=Fetchr.js.map