"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isPluginConfig(o) {
    var obj = o;
    var allowedKeys = ['appId', 'channel', 'disabled', 'host', 'maxVersions', 'minBackgroundDuration', 'updateMethod'];
    if (!obj)
        return false;
    for (var key in obj) {
        if (allowedKeys.indexOf(key) === -1) {
            return false;
        }
    }
    return obj &&
        (obj.appId === undefined || typeof obj.appId === 'string') &&
        (obj.channel === undefined || typeof obj.channel === 'string') &&
        (obj.debug === undefined || typeof obj.debug === 'string') &&
        (obj.updateMethod === undefined || typeof obj.updateMethod === 'string') &&
        (obj.maxVersions === undefined || typeof obj.maxVersions === 'number') &&
        (obj.minBackgroundDuration === undefined || typeof obj.minBackgroundDuration === 'number') &&
        (obj.host === undefined || typeof obj.host === 'string');
}
exports.isPluginConfig = isPluginConfig;
