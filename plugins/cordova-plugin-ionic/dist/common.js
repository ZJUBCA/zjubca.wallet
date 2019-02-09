"use strict";
/// <reference path="../types/IonicCordova.d.ts" />
/// <reference types="cordova-plugin-file" />
/// <reference types="cordova-plugin-file-transfer" />
/// <reference types="cordova" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var channel = cordova.require('cordova/channel');
channel.createSticky('onIonicProReady');
channel.waitForInitialization('onIonicProReady');
var UpdateMethod;
(function (UpdateMethod) {
    UpdateMethod["BACKGROUND"] = "background";
    UpdateMethod["AUTO"] = "auto";
    UpdateMethod["NONE"] = "none";
})(UpdateMethod || (UpdateMethod = {}));
var UpdateState;
(function (UpdateState) {
    UpdateState["Available"] = "available";
    UpdateState["Pending"] = "pending";
    UpdateState["Ready"] = "ready";
})(UpdateState || (UpdateState = {}));
var guards_1 = require("./guards");
var Path = /** @class */ (function () {
    function Path() {
    }
    Path.join = function () {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        var fullPath = paths.shift() || '';
        for (var _a = 0, paths_1 = paths; _a < paths_1.length; _a++) {
            var path = paths_1[_a];
            if (fullPath && fullPath.slice(-1) !== '/') {
                fullPath += '/';
            }
            fullPath = path.slice(0, 1) !== '/' ? fullPath + path : fullPath + path.slice(1);
        }
        return fullPath;
    };
    return Path;
}());
/**
 * LIVE UPDATE API
 *
 * The plugin API for the live updates feature.
 */
var IonicDeployImpl = /** @class */ (function () {
    function IonicDeployImpl(appInfo, preferences) {
        this._fileManager = new FileManager();
        this.SNAPSHOT_CACHE = 'ionic_built_snapshots';
        this.MANIFEST_FILE = 'pro-manifest.json';
        this.PLUGIN_VERSION = '5.3.0';
        this.appInfo = appInfo;
        this._savedPreferences = preferences;
    }
    IonicDeployImpl.prototype._handleInitialPreferenceState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isOnline, updateMethod, _a, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: 
                    // make sure we're not going to redirect to a stale version
                    return [4 /*yield*/, this.cleanCurrentVersionIfStale()];
                    case 1:
                        // make sure we're not going to redirect to a stale version
                        _b.sent();
                        isOnline = navigator && navigator.onLine;
                        if (!isOnline) {
                            console.warn('The device appears to be offline. Loading last available version and skipping update checks.');
                            this.reloadApp();
                            return [2 /*return*/];
                        }
                        updateMethod = this._savedPreferences.updateMethod;
                        _a = updateMethod;
                        switch (_a) {
                            case UpdateMethod.AUTO: return [3 /*break*/, 2];
                            case UpdateMethod.NONE: return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 9];
                    case 2:
                        // NOTE: call sync with background as override to avoid sync
                        // reloading the app and manually reload always once sync has
                        // set the correct currentVersionId
                        console.log('calling _sync');
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.sync({ updateMethod: UpdateMethod.BACKGROUND })];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _b.sent();
                        console.warn(e_1);
                        console.warn('Sync failed. Defaulting to last available version.');
                        return [3 /*break*/, 6];
                    case 6:
                        console.log('calling _reload');
                        return [4 /*yield*/, this.reloadApp()];
                    case 7:
                        _b.sent();
                        console.log('done _reloading');
                        return [3 /*break*/, 11];
                    case 8:
                        this.reloadApp();
                        return [3 /*break*/, 11];
                    case 9: 
                    // NOTE: default anything that doesn't explicitly match to background updates
                    return [4 /*yield*/, this.reloadApp()];
                    case 10:
                        // NOTE: default anything that doesn't explicitly match to background updates
                        _b.sent();
                        try {
                            this.sync({ updateMethod: UpdateMethod.BACKGROUND });
                        }
                        catch (e) {
                            console.warn(e);
                            console.warn('Background sync failed. Unable to check for new updates.');
                        }
                        return [2 /*return*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    IonicDeployImpl.prototype.getSnapshotCacheDir = function (versionId) {
        return Path.join(this.appInfo.dataDirectory, this.SNAPSHOT_CACHE, versionId);
    };
    IonicDeployImpl.prototype.getBundledAppDir = function () {
        var folder = 'www';
        if (typeof (Capacitor) !== 'undefined') {
            folder = 'public';
        }
        return Path.join(cordova.file.applicationDirectory, folder);
    };
    IonicDeployImpl.prototype._savePrefs = function (prefs) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            try {
                                cordova.exec(function (savedPrefs) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        resolve(savedPrefs);
                                        return [2 /*return*/];
                                    });
                                }); }, reject, 'IonicCordovaCommon', 'setPreferences', [prefs]);
                            }
                            catch (e) {
                                reject(e.message);
                            }
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    IonicDeployImpl.prototype.configure = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!guards_1.isPluginConfig(config)) {
                            throw new Error('Invalid Config Object');
                        }
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                cordova.exec(resolve, reject, 'IonicCordovaCommon', 'configure', [config]);
                            })];
                    case 1:
                        _a.sent();
                        Object.assign(this._savedPreferences, config);
                        this._savePrefs(this._savedPreferences);
                        return [2 /*return*/];
                }
            });
        });
    };
    IonicDeployImpl.prototype.checkForUpdate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isOnline, prefs, appInfo, endpoint, device_details, body, timeout, request, resp, jsonResp, checkForUpdateResp, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        isOnline = navigator && navigator.onLine;
                        if (!isOnline) {
                            throw new Error('The device is offline.');
                        }
                        prefs = this._savedPreferences;
                        appInfo = this.appInfo;
                        endpoint = prefs.host + "/apps/" + prefs.appId + "/channels/check-device";
                        device_details = {
                            binary_version: prefs.binaryVersionName,
                            device_id: appInfo.device || null,
                            platform: appInfo.platform,
                            platform_version: appInfo.platformVersion,
                            snapshot: prefs.currentVersionId,
                            build: prefs.currentBuildId
                        };
                        body = {
                            channel_name: prefs.channel,
                            app_id: prefs.appId,
                            device: device_details,
                            plugin_version: this.PLUGIN_VERSION,
                            manifest: true
                        };
                        timeout = new Promise(function (resolve, reject) {
                            setTimeout(reject, 5000, 'Request timed out. The device maybe offline.');
                        });
                        request = fetch(endpoint, {
                            method: 'POST',
                            headers: new Headers({
                                'Content-Type': 'application/json'
                            }),
                            body: JSON.stringify(body)
                        });
                        return [4 /*yield*/, Promise.race([timeout, request])];
                    case 1:
                        resp = _d.sent();
                        if (!(resp.status < 500)) return [3 /*break*/, 3];
                        return [4 /*yield*/, resp.json()];
                    case 2:
                        jsonResp = _d.sent();
                        _d.label = 3;
                    case 3:
                        if (!resp.ok) return [3 /*break*/, 6];
                        checkForUpdateResp = jsonResp.data;
                        if (!(checkForUpdateResp.available && checkForUpdateResp.url && checkForUpdateResp.snapshot && checkForUpdateResp.build)) return [3 /*break*/, 5];
                        prefs.availableUpdate = {
                            binaryVersionCode: prefs.binaryVersionCode,
                            binaryVersionName: prefs.binaryVersionName,
                            channel: prefs.channel,
                            state: UpdateState.Available,
                            lastUsed: new Date().toISOString(),
                            url: checkForUpdateResp.url,
                            versionId: checkForUpdateResp.snapshot,
                            buildId: checkForUpdateResp.build
                        };
                        return [4 /*yield*/, this._savePrefs(prefs)];
                    case 4:
                        _d.sent();
                        _d.label = 5;
                    case 5: return [2 /*return*/, checkForUpdateResp];
                    case 6:
                        _a = Error.bind;
                        _b = "Error Status " + resp.status + ": ";
                        if (!jsonResp) return [3 /*break*/, 7];
                        _c = jsonResp.error.message;
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, resp.text()];
                    case 8:
                        _c = _d.sent();
                        _d.label = 9;
                    case 9: throw new (_a.apply(Error, [void 0, _b + (_c)]))();
                }
            });
        });
    };
    IonicDeployImpl.prototype.downloadUpdate = function (progress) {
        return __awaiter(this, void 0, void 0, function () {
            var prefs, _a, fileBaseUrl, manifestJson, diffedManifest;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        prefs = this._savedPreferences;
                        if (!(prefs.availableUpdate && prefs.availableUpdate.state === UpdateState.Available)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this._fetchManifest(prefs.availableUpdate.url)];
                    case 1:
                        _a = _b.sent(), fileBaseUrl = _a.fileBaseUrl, manifestJson = _a.manifestJson;
                        return [4 /*yield*/, this._diffManifests(manifestJson)];
                    case 2:
                        diffedManifest = _b.sent();
                        return [4 /*yield*/, this.prepareUpdateDirectory(prefs.availableUpdate.versionId)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this._downloadFilesFromManifest(fileBaseUrl, diffedManifest, prefs.availableUpdate.versionId, progress)];
                    case 4:
                        _b.sent();
                        prefs.availableUpdate.state = UpdateState.Pending;
                        return [4 /*yield*/, this._savePrefs(prefs)];
                    case 5:
                        _b.sent();
                        return [2 /*return*/, true];
                    case 6: return [2 /*return*/, false];
                }
            });
        });
    };
    IonicDeployImpl.prototype._downloadFilesFromManifest = function (baseUrl, manifest, versionId, progress) {
        return __awaiter(this, void 0, void 0, function () {
            var size, downloaded, beforeDownloadTimer, downloadFile, downloads, count, maxBatch, numberBatches, _i, manifest_1, entry;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Downloading update...');
                        size = 0, downloaded = 0;
                        manifest.forEach(function (i) {
                            size += i.size;
                        });
                        beforeDownloadTimer = new Timer('downloadTimer');
                        downloadFile = function (file) { return __awaiter(_this, void 0, void 0, function () {
                            var base, newUrl, filePath;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        base = new URL(baseUrl);
                                        newUrl = new URL(file.href, baseUrl);
                                        newUrl.search = base.search;
                                        filePath = Path.join(this.getSnapshotCacheDir(versionId), file.href);
                                        return [4 /*yield*/, this._fileManager.downloadAndWriteFile(newUrl.toString(), filePath)];
                                    case 1:
                                        _a.sent();
                                        // Update progress
                                        downloaded += file.size;
                                        if (progress) {
                                            progress(Math.floor((downloaded / size) * 100));
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        downloads = [];
                        count = 0;
                        console.log("About to download " + manifest.length + " new files for update.");
                        maxBatch = 20;
                        numberBatches = Math.round(manifest.length / maxBatch);
                        if (manifest.length % maxBatch !== 0) {
                            numberBatches = numberBatches + 1;
                        }
                        _i = 0, manifest_1 = manifest;
                        _a.label = 1;
                    case 1:
                        if (!(_i < manifest_1.length)) return [3 /*break*/, 5];
                        entry = manifest_1[_i];
                        if (!(downloads.length >= maxBatch)) return [3 /*break*/, 3];
                        count++;
                        return [4 /*yield*/, Promise.all(downloads)];
                    case 2:
                        _a.sent();
                        beforeDownloadTimer.diff("downloaded batch " + count + " of " + numberBatches + " downloads. Done downloading " + count * maxBatch + " of " + manifest.length + " files");
                        downloads = [];
                        _a.label = 3;
                    case 3:
                        downloads.push(downloadFile(entry));
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5:
                        if (!downloads.length) return [3 /*break*/, 7];
                        count++;
                        return [4 /*yield*/, Promise.all(downloads)];
                    case 6:
                        _a.sent();
                        beforeDownloadTimer.diff("downloaded batch " + count + " of " + numberBatches + " downloads. Done downloading all " + manifest.length + " files");
                        _a.label = 7;
                    case 7:
                        beforeDownloadTimer.end("Downloaded " + manifest.length + " files");
                        return [2 /*return*/];
                }
            });
        });
    };
    IonicDeployImpl.prototype._fetchManifest = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var resp, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetch(url, {
                            method: 'GET',
                            redirect: 'follow',
                        })];
                    case 1:
                        resp = _b.sent();
                        _a = {
                            fileBaseUrl: resp.url
                        };
                        return [4 /*yield*/, resp.json()];
                    case 2: return [2 /*return*/, (_a.manifestJson = _b.sent(),
                            _a)];
                }
            });
        });
    };
    IonicDeployImpl.prototype._diffManifests = function (newManifest) {
        return __awaiter(this, void 0, void 0, function () {
            var manifestResp, bundledManifest, bundleManifestStrings_1, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch(WEBVIEW_SERVER_URL + "/" + this.MANIFEST_FILE)];
                    case 1:
                        manifestResp = _a.sent();
                        return [4 /*yield*/, manifestResp.json()];
                    case 2:
                        bundledManifest = _a.sent();
                        bundleManifestStrings_1 = bundledManifest.map(function (entry) { return JSON.stringify(entry); });
                        return [2 /*return*/, newManifest.filter(function (entry) { return bundleManifestStrings_1.indexOf(JSON.stringify(entry)) === -1; })];
                    case 3:
                        e_2 = _a.sent();
                        return [2 /*return*/, newManifest];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    IonicDeployImpl.prototype.prepareUpdateDirectory = function (versionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._cleanSnapshotDir(versionId)];
                    case 1:
                        _a.sent();
                        console.log('Cleaned version directory');
                        return [4 /*yield*/, this._copyBaseAppDir(versionId)];
                    case 2:
                        _a.sent();
                        console.log('Copied base app resources');
                        return [2 /*return*/];
                }
            });
        });
    };
    IonicDeployImpl.prototype.extractUpdate = function (progress) {
        return __awaiter(this, void 0, void 0, function () {
            var prefs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prefs = this._savedPreferences;
                        if (!prefs.availableUpdate || prefs.availableUpdate.state !== UpdateState.Pending) {
                            return [2 /*return*/, false];
                        }
                        if (progress) {
                            progress(100);
                        }
                        prefs.availableUpdate.state = UpdateState.Ready;
                        prefs.updates[prefs.availableUpdate.versionId] = prefs.availableUpdate;
                        return [4 /*yield*/, this._savePrefs(prefs)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    IonicDeployImpl.prototype.reloadApp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var prefs, newLocation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prefs = this._savedPreferences;
                        if (!(prefs.availableUpdate && prefs.availableUpdate.state === UpdateState.Ready)) return [3 /*break*/, 2];
                        prefs.currentVersionId = prefs.availableUpdate.versionId;
                        prefs.currentBuildId = prefs.availableUpdate.buildId;
                        delete prefs.availableUpdate;
                        return [4 /*yield*/, this._savePrefs(prefs)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!prefs.currentVersionId) return [3 /*break*/, 7];
                        return [4 /*yield*/, this._isRunningVersion(prefs.currentVersionId)];
                    case 3:
                        if (!_a.sent()) return [3 /*break*/, 6];
                        console.log("Already running version " + prefs.currentVersionId);
                        return [4 /*yield*/, this._savePrefs(prefs)];
                    case 4:
                        _a.sent();
                        channel.onIonicProReady.fire();
                        Ionic.WebView.persistServerBasePath();
                        return [4 /*yield*/, this.cleanupVersions()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, false];
                    case 6:
                        // Is the current version on the device?
                        if (!(prefs.currentVersionId in prefs.updates)) {
                            console.error("Missing version " + prefs.currentVersionId);
                            channel.onIonicProReady.fire();
                            return [2 /*return*/, false];
                        }
                        newLocation = new URL(this.getSnapshotCacheDir(prefs.currentVersionId));
                        Ionic.WebView.setServerBasePath(newLocation.pathname);
                        return [2 /*return*/, true];
                    case 7:
                        channel.onIonicProReady.fire();
                        return [2 /*return*/, false];
                }
            });
        });
    };
    // compare an update to the current version using both name & code
    IonicDeployImpl.prototype.isCurrentVersion = function (update) {
        var currentVersionCode = this._savedPreferences.binaryVersionCode;
        var currentVersionName = this._savedPreferences.binaryVersionName;
        console.log("Current: versionCode: " + currentVersionCode + " versionName: " + currentVersionName);
        console.log("update: versionCode: " + update.binaryVersionCode + " versionName: " + update.binaryVersionName);
        return update.binaryVersionName === currentVersionName && update.binaryVersionCode === currentVersionCode;
    };
    IonicDeployImpl.prototype.cleanCurrentVersionIfStale = function () {
        return __awaiter(this, void 0, void 0, function () {
            var prefs, _a, versionId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        prefs = this._savedPreferences;
                        if (!prefs.currentVersionId) return [3 /*break*/, 4];
                        _a = !this.isCurrentVersion(prefs.updates[prefs.currentVersionId]);
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._isRunningVersion(prefs.currentVersionId)];
                    case 1:
                        _a = !(_b.sent());
                        _b.label = 2;
                    case 2:
                        if (!_a) return [3 /*break*/, 4];
                        console.log("Update " + prefs.currentVersionId + " was built for different binary version removing update from device" +
                            ("Update binaryVersionName: " + prefs.updates[prefs.currentVersionId].binaryVersionName + ", Device binaryVersionName " + prefs.binaryVersionName) +
                            ("Update binaryVersionCode: " + prefs.updates[prefs.currentVersionId].binaryVersionCode + ", Device binaryVersionCode " + prefs.binaryVersionCode));
                        versionId = prefs.currentVersionId;
                        // NOTE: deleting pref.currentVersionId here to fool deleteVersionById into deleting it
                        delete prefs.currentVersionId;
                        return [4 /*yield*/, this.deleteVersionById(versionId)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    IonicDeployImpl.prototype._isRunningVersion = function (versionId) {
        return __awaiter(this, void 0, void 0, function () {
            var currentPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getServerBasePath()];
                    case 1:
                        currentPath = _a.sent();
                        return [2 /*return*/, currentPath.includes(versionId)];
                }
            });
        });
    };
    IonicDeployImpl.prototype._getServerBasePath = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            try {
                                Ionic.WebView.getServerBasePath(resolve);
                            }
                            catch (e) {
                                reject(e);
                            }
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    IonicDeployImpl.prototype._cleanSnapshotDir = function (versionId) {
        return __awaiter(this, void 0, void 0, function () {
            var timer, snapshotDir, dirEntry_1, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timer = new Timer('CleanSnapshotDir');
                        snapshotDir = this.getSnapshotCacheDir(versionId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this._fileManager.getDirectory(snapshotDir, false)];
                    case 2:
                        dirEntry_1 = _a.sent();
                        return [4 /*yield*/, (new Promise(function (resolve, reject) { return dirEntry_1.removeRecursively(resolve, reject); }))];
                    case 3:
                        _a.sent();
                        timer.end();
                        return [3 /*break*/, 5];
                    case 4:
                        e_3 = _a.sent();
                        console.log('No directory found for snapshot no need to delete');
                        timer.end();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    IonicDeployImpl.prototype._copyBaseAppDir = function (versionId) {
        return __awaiter(this, void 0, void 0, function () {
            var timer;
            var _this = this;
            return __generator(this, function (_a) {
                timer = new Timer('CopyBaseApp');
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var rootAppDirEntry, snapshotCacheDirEntry, e_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    return [4 /*yield*/, this._fileManager.getDirectory(this.getBundledAppDir(), false)];
                                case 1:
                                    rootAppDirEntry = _a.sent();
                                    return [4 /*yield*/, this._fileManager.getDirectory(this.getSnapshotCacheDir(''), true)];
                                case 2:
                                    snapshotCacheDirEntry = _a.sent();
                                    rootAppDirEntry.copyTo(snapshotCacheDirEntry, versionId, function () { timer.end(); resolve(); }, reject);
                                    return [3 /*break*/, 4];
                                case 3:
                                    e_4 = _a.sent();
                                    reject(e_4);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    IonicDeployImpl.prototype.getCurrentVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var versionId;
            return __generator(this, function (_a) {
                versionId = this._savedPreferences.currentVersionId;
                if (typeof versionId === 'string') {
                    return [2 /*return*/, this.getVersionById(versionId)];
                }
                return [2 /*return*/];
            });
        });
    };
    IonicDeployImpl.prototype.getVersionById = function (versionId) {
        return __awaiter(this, void 0, void 0, function () {
            var update;
            return __generator(this, function (_a) {
                update = this._savedPreferences.updates[versionId];
                if (!update) {
                    throw Error("No update available with versionId " + versionId);
                }
                return [2 /*return*/, this._convertToSnapshotInfo(update)];
            });
        });
    };
    IonicDeployImpl.prototype._convertToSnapshotInfo = function (update) {
        return {
            deploy_uuid: update.versionId,
            versionId: update.versionId,
            buildId: update.buildId,
            channel: update.channel,
            binary_version: update.binaryVersionName,
            binaryVersion: update.binaryVersionName,
            binaryVersionCode: update.binaryVersionCode,
            binaryVersionName: update.binaryVersionName
        };
    };
    IonicDeployImpl.prototype.getAvailableVersions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, Object.keys(this._savedPreferences.updates).map(function (k) { return _this._convertToSnapshotInfo(_this._savedPreferences.updates[k]); })];
            });
        });
    };
    IonicDeployImpl.prototype.deleteVersionById = function (versionId) {
        return __awaiter(this, void 0, void 0, function () {
            var prefs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prefs = this._savedPreferences;
                        if (prefs.currentVersionId === versionId) {
                            throw Error("Can't delete version with id: " + versionId + " as it is the current version.");
                        }
                        delete prefs.updates[versionId];
                        return [4 /*yield*/, this._savePrefs(prefs)];
                    case 1:
                        _a.sent();
                        // delete snapshot directory
                        return [4 /*yield*/, this._cleanSnapshotDir(versionId)];
                    case 2:
                        // delete snapshot directory
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    IonicDeployImpl.prototype.getStoredUpdates = function () {
        // get an array of stored updates minus current deployed one
        var prefs = this._savedPreferences;
        var updates = [];
        for (var _i = 0, _a = Object.keys(prefs.updates); _i < _a.length; _i++) {
            var versionId = _a[_i];
            // don't clean up the current version
            if (versionId !== prefs.currentVersionId) {
                updates.push(prefs.updates[versionId]);
            }
        }
        return updates;
    };
    IonicDeployImpl.prototype.cleanupVersions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var prefs, updates, _i, updates_1, update, _a, updates_2, update;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        prefs = this._savedPreferences;
                        updates = this.getStoredUpdates();
                        _i = 0, updates_1 = updates;
                        _b.label = 1;
                    case 1:
                        if (!(_i < updates_1.length)) return [3 /*break*/, 4];
                        update = updates_1[_i];
                        if (!!this.isCurrentVersion(update)) return [3 /*break*/, 3];
                        console.log("Update " + update.versionId + " was built for different binary version removing update from device" +
                            ("Update binaryVersionName: " + update.binaryVersionName + ", Device binaryVersionName " + prefs.binaryVersionName) +
                            ("Update binaryVersionCode: " + update.binaryVersionCode + ", Device binaryVersionCode " + prefs.binaryVersionCode));
                        return [4 /*yield*/, this.deleteVersionById(update.versionId)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        // clean down to Max Updates stored
                        updates = this.getStoredUpdates();
                        updates = updates.sort(function (a, b) { return a.lastUsed.localeCompare(b.lastUsed); });
                        updates = updates.reverse();
                        updates = updates.slice(prefs.maxVersions);
                        _a = 0, updates_2 = updates;
                        _b.label = 5;
                    case 5:
                        if (!(_a < updates_2.length)) return [3 /*break*/, 8];
                        update = updates_2[_a];
                        return [4 /*yield*/, this.deleteVersionById(update.versionId)];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7:
                        _a++;
                        return [3 /*break*/, 5];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    IonicDeployImpl.prototype.sync = function (syncOptions) {
        if (syncOptions === void 0) { syncOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var prefs, updateMethod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prefs = this._savedPreferences;
                        updateMethod = syncOptions.updateMethod || prefs.updateMethod;
                        return [4 /*yield*/, this.checkForUpdate()];
                    case 1:
                        _a.sent();
                        if (!prefs.availableUpdate) return [3 /*break*/, 7];
                        if (!(prefs.availableUpdate.state === UpdateState.Available)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.downloadUpdate()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!(prefs.availableUpdate.state === UpdateState.Pending)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.extractUpdate()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        if (!(prefs.availableUpdate.state === UpdateState.Ready && updateMethod === UpdateMethod.AUTO)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.reloadApp()];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        if (prefs.currentVersionId && prefs.currentBuildId) {
                            return [2 /*return*/, {
                                    deploy_uuid: prefs.currentVersionId,
                                    versionId: prefs.currentVersionId,
                                    buildId: prefs.currentBuildId,
                                    channel: prefs.channel,
                                    binary_version: prefs.binaryVersionName,
                                    binaryVersion: prefs.binaryVersionName,
                                    binaryVersionCode: prefs.binaryVersionCode,
                                    binaryVersionName: prefs.binaryVersionName
                                }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return IonicDeployImpl;
}());
var FileManager = /** @class */ (function () {
    function FileManager() {
    }
    FileManager.prototype.getDirectory = function (path, createDirectory) {
        if (createDirectory === void 0) { createDirectory = true; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        resolveLocalFileSystemURL(path, function (entry) { return entry.isDirectory ? resolve(entry) : reject(); }, function () { return __awaiter(_this, void 0, void 0, function () {
                            var components, child, parent_1, e_5;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        components = path.split('/');
                                        child = components.pop();
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, this.getDirectory(components.join('/'), createDirectory)];
                                    case 2:
                                        parent_1 = (_a.sent());
                                        parent_1.getDirectory(child, { create: createDirectory }, function (entry) { return __awaiter(_this, void 0, void 0, function () {
                                            var _a;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0:
                                                        if (!(entry.fullPath === path)) return [3 /*break*/, 1];
                                                        resolve(entry);
                                                        return [3 /*break*/, 3];
                                                    case 1:
                                                        _a = resolve;
                                                        return [4 /*yield*/, this.getDirectory(path, createDirectory)];
                                                    case 2:
                                                        _a.apply(void 0, [_b.sent()]);
                                                        _b.label = 3;
                                                    case 3: return [2 /*return*/];
                                                }
                                            });
                                        }); }, reject);
                                        return [3 /*break*/, 4];
                                    case 3:
                                        e_5 = _a.sent();
                                        reject(e_5);
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); });
                    })];
            });
        });
    };
    FileManager.prototype.resolvePath = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        resolveLocalFileSystemURL(cordova.file.dataDirectory, function (rootDirEntry) {
                            resolve(rootDirEntry);
                        }, reject);
                    })];
            });
        });
    };
    FileManager.prototype.getFile = function (fullPath) {
        return __awaiter(this, void 0, void 0, function () {
            var normalizedURL, req;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        normalizedURL = Ionic.WebView.convertFileSrc(fullPath);
                        return [4 /*yield*/, fetch(normalizedURL)];
                    case 1:
                        req = _a.sent();
                        return [2 /*return*/, req.text()];
                }
            });
        });
    };
    FileManager.prototype.getFileEntry = function (path, fileName) {
        return __awaiter(this, void 0, void 0, function () {
            var dirEntry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDirectory(path, false)];
                    case 1:
                        dirEntry = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                dirEntry.getFile(fileName, { create: false, exclusive: false }, resolve, reject);
                            })];
                }
            });
        });
    };
    FileManager.prototype.fileExists = function (path, fileName) {
        return __awaiter(this, void 0, void 0, function () {
            var e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getFileEntry(path, fileName)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        e_6 = _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FileManager.prototype.copyTo = function (oldPath, oldFileName, newPath, newFileName) {
        return __awaiter(this, void 0, void 0, function () {
            var fileEntry, newDirEntry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getFileEntry(oldPath, oldFileName)];
                    case 1:
                        fileEntry = _a.sent();
                        return [4 /*yield*/, this.getDirectory(newPath)];
                    case 2:
                        newDirEntry = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                fileEntry.copyTo(newDirEntry, newFileName, resolve, reject);
                            })];
                }
            });
        });
    };
    FileManager.prototype.removeFile = function (path, filename) {
        return __awaiter(this, void 0, void 0, function () {
            var fileEntry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getFileEntry(path, filename)];
                    case 1:
                        fileEntry = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                fileEntry.remove(resolve, reject);
                            })];
                }
            });
        });
    };
    FileManager.prototype.downloadAndWriteFile = function (url, path) {
        return __awaiter(this, void 0, void 0, function () {
            var fileT;
            return __generator(this, function (_a) {
                fileT = new FileTransfer();
                return [2 /*return*/, new Promise(function (resolve, reject) { return fileT.download(url, path, resolve, reject); })];
            });
        });
    };
    return FileManager;
}());
var IonicDeploy = /** @class */ (function () {
    function IonicDeploy(parent) {
        this.lastPause = 0;
        this.minBackgroundDuration = 10;
        this.disabled = false;
        this.parent = parent;
        this.delegate = this.initialize();
        this.fetchIsAvailable = typeof (fetch) === 'function';
        document.addEventListener('deviceready', this.onLoad.bind(this));
    }
    IonicDeploy.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var preferences, appInfo, delegate, disabledMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._initPreferences()];
                    case 1:
                        preferences = _a.sent();
                        this.minBackgroundDuration = preferences.minBackgroundDuration;
                        this.disabled = preferences.disabled || !this.fetchIsAvailable;
                        return [4 /*yield*/, this.parent.getAppDetails()];
                    case 2:
                        appInfo = _a.sent();
                        delegate = new IonicDeployImpl(appInfo, preferences);
                        if (!this.disabled) return [3 /*break*/, 3];
                        disabledMessage = 'cordova-plugin-ionic has been disabled.';
                        if (!this.fetchIsAvailable) {
                            disabledMessage = 'Fetch is unavailable so ' + disabledMessage;
                        }
                        console.warn(disabledMessage);
                        channel.onIonicProReady.fire();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, delegate._handleInitialPreferenceState()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, delegate];
                }
            });
        });
    };
    IonicDeploy.prototype.onLoad = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        document.addEventListener('pause', this.onPause.bind(this));
                        document.addEventListener('resume', this.onResume.bind(this));
                        return [4 /*yield*/, this.onResume()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    IonicDeploy.prototype.onPause = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.lastPause = Date.now();
                return [2 /*return*/];
            });
        });
    };
    IonicDeploy.prototype.onResume = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!this.disabled && this.lastPause && this.minBackgroundDuration && Date.now() - this.lastPause > this.minBackgroundDuration * 1000)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.delegate];
                    case 1: return [4 /*yield*/, (_a.sent())._handleInitialPreferenceState()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    IonicDeploy.prototype._initPreferences = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            try {
                                channel.onNativeReady.subscribe(function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        // timeout to let browser proxy to init
                                        window.setTimeout(function () {
                                            var _this = this;
                                            cordova.exec(function (prefs) { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    resolve(prefs);
                                                    return [2 /*return*/];
                                                });
                                            }); }, reject, 'IonicCordovaCommon', 'getPreferences');
                                        }, 0);
                                        return [2 /*return*/];
                                    });
                                }); });
                            }
                            catch (e) {
                                channel.onIonicProReady.fire();
                                reject(e.message);
                            }
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    IonicDeploy.prototype.checkForUpdate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.disabled) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.delegate];
                    case 1: return [2 /*return*/, (_a.sent()).checkForUpdate()];
                    case 2: return [2 /*return*/, { available: false, compatible: false, partial: false }];
                }
            });
        });
    };
    IonicDeploy.prototype.configure = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.disabled) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.delegate];
                    case 1: return [2 /*return*/, (_a.sent()).configure(config)];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    IonicDeploy.prototype.getConfiguration = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            try {
                                cordova.exec(function (prefs) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        if (prefs.availableUpdate) {
                                            delete prefs.availableUpdate;
                                        }
                                        if (prefs.updates) {
                                            delete prefs.updates;
                                        }
                                        resolve(prefs);
                                        return [2 /*return*/];
                                    });
                                }); }, reject, 'IonicCordovaCommon', 'getPreferences');
                            }
                            catch (e) {
                                reject(e.message);
                            }
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    IonicDeploy.prototype.deleteVersionById = function (version) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.disabled) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.delegate];
                    case 1: return [2 /*return*/, (_a.sent()).deleteVersionById(version)];
                    case 2: return [2 /*return*/, true];
                }
            });
        });
    };
    IonicDeploy.prototype.downloadUpdate = function (progress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.disabled) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.delegate];
                    case 1: return [2 /*return*/, (_a.sent()).downloadUpdate(progress)];
                    case 2: return [2 /*return*/, false];
                }
            });
        });
    };
    IonicDeploy.prototype.extractUpdate = function (progress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.disabled) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.delegate];
                    case 1: return [2 /*return*/, (_a.sent()).extractUpdate(progress)];
                    case 2: return [2 /*return*/, false];
                }
            });
        });
    };
    IonicDeploy.prototype.getAvailableVersions = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.disabled) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.delegate];
                    case 1: return [2 /*return*/, (_a.sent()).getAvailableVersions()];
                    case 2: return [2 /*return*/, []];
                }
            });
        });
    };
    IonicDeploy.prototype.getCurrentVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.disabled) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.delegate];
                    case 1: return [2 /*return*/, (_a.sent()).getCurrentVersion()];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    IonicDeploy.prototype.getVersionById = function (versionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.disabled) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.delegate];
                    case 1: return [2 /*return*/, (_a.sent()).getVersionById(versionId)];
                    case 2: throw Error("No update available with versionId " + versionId);
                }
            });
        });
    };
    IonicDeploy.prototype.reloadApp = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.disabled) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.delegate];
                    case 1: return [2 /*return*/, (_a.sent()).reloadApp()];
                    case 2: return [2 /*return*/, false];
                }
            });
        });
    };
    IonicDeploy.prototype.sync = function (syncOptions) {
        if (syncOptions === void 0) { syncOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.disabled) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.delegate];
                    case 1: return [2 /*return*/, (_a.sent()).sync(syncOptions)];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    return IonicDeploy;
}());
/**
 * BASE API
 *
 * All features of the Ionic Cordova plugin are registered here, along with some low level error tracking features used
 * by the monitoring service.
 */
var IonicCordova = /** @class */ (function () {
    function IonicCordova() {
        this.deploy = new IonicDeploy(this);
    }
    IonicCordova.prototype.getAppInfo = function (success, failure) {
        console.warn('This function has been deprecated in favor of IonicCordova.getAppDetails.');
        this.getAppDetails().then(function (result) { return success(result); }, function (err) {
            typeof err === 'string' ? failure(err) : failure(err.message);
        });
    };
    IonicCordova.prototype.getAppDetails = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        cordova.exec(resolve, reject, 'IonicCordovaCommon', 'getAppInfo');
                    })];
            });
        });
    };
    return IonicCordova;
}());
var Timer = /** @class */ (function () {
    function Timer(name) {
        this.name = name;
        this.startTime = new Date();
        this.lastTime = new Date();
        console.log("Starting IonicTimer " + this.name);
    }
    Timer.prototype.end = function (extraLog) {
        console.log("Finished IonicTimer " + this.name + " in " + (new Date().getTime() - this.startTime.getTime()) / 1000 + " seconds.");
        if (extraLog) {
            console.log("IonicTimer extra " + extraLog);
        }
    };
    Timer.prototype.diff = function (message) {
        console.log("Message: " + message + " Diff IonicTimer " + this.name + " in " + (new Date().getTime() - this.lastTime.getTime()) / 1000 + " seconds.");
        this.lastTime = new Date();
    };
    return Timer;
}());
var instance = new IonicCordova();
module.exports = instance;
