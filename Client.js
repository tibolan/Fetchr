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
import Fetchr from "./Fetchr.js";
var ClientDefaultOptions = {
    method: 'GET'
};
var Client = (function () {
    function Client(config) {
        this.options = Object.assign({}, ClientDefaultOptions);
        this.setOptions(config);
    }
    Client.prototype.fetch = function (method, request) {
        return __awaiter(this, void 0, void 0, function () {
            var mergedConf;
            var _this = this;
            return __generator(this, function (_a) {
                mergedConf = null;
                if (typeof request === "string") {
                    mergedConf = Object.assign({}, this.options, { url: request });
                }
                else {
                    mergedConf = Object.assign({}, this.options, request);
                }
                mergedConf.method = method;
                mergedConf.timeout && (mergedConf.timeout = parseDuration(mergedConf.timeout));
                mergedConf.cacheable && (mergedConf.cacheable = parseDuration(mergedConf.cacheable));
                return [2, Fetchr(mergedConf)
                        .then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                        var data, e_1;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    data = null;
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 12, , 13]);
                                    if (!(res.request.type === "json")) return [3, 3];
                                    return [4, res.response.json()];
                                case 2:
                                    data = _a.sent();
                                    return [3, 11];
                                case 3:
                                    if (!(res.request.type === "text")) return [3, 5];
                                    return [4, res.response.text()];
                                case 4:
                                    data = _a.sent();
                                    return [3, 11];
                                case 5:
                                    if (!(res.request.type === "blob")) return [3, 7];
                                    return [4, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                            var reader;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4, res.response.blob()];
                                                    case 1:
                                                        data = _a.sent();
                                                        return [4, new FileReader()];
                                                    case 2:
                                                        reader = _a.sent();
                                                        reader.onloadend = function () {
                                                            resolve(reader.result);
                                                        };
                                                        reader.readAsDataURL(data);
                                                        return [2];
                                                }
                                            });
                                        }); })];
                                case 6:
                                    data = _a.sent();
                                    return [3, 11];
                                case 7:
                                    if (!(res.request.type === "buffer")) return [3, 9];
                                    return [4, res.response.arrayBuffer()];
                                case 8:
                                    data = _a.sent();
                                    return [3, 11];
                                case 9:
                                    if (!(res.request.type === "form")) return [3, 11];
                                    return [4, res.response.formData()];
                                case 10:
                                    data = _a.sent();
                                    _a.label = 11;
                                case 11: return [3, 13];
                                case 12:
                                    e_1 = _a.sent();
                                    return [3, 13];
                                case 13:
                                    res.data = data;
                                    return [2, res];
                            }
                        });
                    }); })];
            });
        });
    };
    Client.prototype.setOptions = function (config) {
        Object.assign(this.options, config);
        if (this.options.timeout) {
            this.options.timeout = parseDuration(this.options.timeout);
        }
        if (this.options.cacheable) {
            this.options.cacheable = parseDuration(this.options.cacheable);
        }
    };
    Client.prototype.GET = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.fetch('GET', config)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Client.prototype.DELETE = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.fetch('DELETE', config)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Client.prototype.HEAD = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.fetch('HEAD', config)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Client.prototype.OPTIONS = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.fetch('OPTIONS', config)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Client.prototype.POST = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.fetch('POST', config)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Client.prototype.PUT = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.fetch('PUT', config)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Client.prototype.PATCH = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.fetch('PATCH', config)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    return Client;
}());
var parseDuration = function (duration) {
    if (typeof duration === "number") {
        return duration;
    }
    var durationInMs = 0;
    var matched = duration.match(/\d+|[a-z]+/g);
    for (var i = 0; i < matched.length; i = i + 2) {
        var value = Number(matched[i]) || 0;
        var unit = matched[i + 1] || 'ms';
        var factor = 0;
        switch (unit) {
            case "y":
                factor = 1000 * 60 * 60 * 24 * 365;
                break;
            case "w":
                factor = 1000 * 60 * 60 * 24 * 7;
                break;
            case "d":
                factor = 1000 * 60 * 60 * 24;
                break;
            case "h":
                factor = 1000 * 60 * 60;
                break;
            case "m":
                factor = 1000 * 60;
                break;
            case "s":
                factor = 1000;
                break;
            case "ms":
                factor = 1;
                break;
            default:
                factor = 0;
        }
        durationInMs += (value * factor);
    }
    return durationInMs;
};
export default Client;
//# sourceMappingURL=Client.js.map