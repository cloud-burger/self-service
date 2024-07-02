"use strict";
/**
 * Remove old files, copy front-end ones.
 */
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = require("fs-extra");
var jet_logger_1 = require("jet-logger");
var child_process_1 = require("child_process");
/**
 * Start
 */
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                // Remove current build
                return [4 /*yield*/, remove('./dist/')];
            case 1:
                // Remove current build
                _a.sent();
                // Copy front-end files
                return [4 /*yield*/, copy('./src/public', './dist/public')];
            case 2:
                // Copy front-end files
                _a.sent();
                return [4 /*yield*/, copy('./src/views', './dist/views')];
            case 3:
                _a.sent();
                // Copy back-end files
                return [4 /*yield*/, exec('tsc --build tsconfig.prod.json', './')];
            case 4:
                // Copy back-end files
                _a.sent();
                return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                jet_logger_1.default.err(err_1);
                process.exit(1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); })();
/**
 * Remove file
 */
function remove(loc) {
    return new Promise(function (res, rej) {
        return fs_extra_1.default.remove(loc, function (err) {
            return (!!err ? rej(err) : res());
        });
    });
}
/**
 * Copy file.
 */
function copy(src, dest) {
    return new Promise(function (res, rej) {
        return fs_extra_1.default.copy(src, dest, function (err) {
            return (!!err ? rej(err) : res());
        });
    });
}
/**
 * Do command line command.
 */
function exec(cmd, loc) {
    return new Promise(function (res, rej) {
        return child_process_1.default.exec(cmd, { cwd: loc }, function (err, stdout, stderr) {
            if (!!stdout) {
                jet_logger_1.default.info(stdout);
            }
            if (!!stderr) {
                jet_logger_1.default.warn(stderr);
            }
            return (!!err ? rej(err) : res());
        });
    });
}
