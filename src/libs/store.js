/**
 * Created by leexiaosi on 16/4/1.
 */

var _ = require('underscore');
function Store(storage) {
    this.storage = storage;
}
_.extend(Store.prototype, {
    // 设置值
    set: function (key, val) {
        if (val === undefined) {
            return this.remove(key);
        }
        this.storage.setItem(key, this.serialize(val));
        return val;
    },
    // 获取值
    get: function (key, defaultVal) {
        var val = this.deserialize(this.storage.getItem(key));
        return (val === undefined ? defaultVal : val);
    },
    // 是否有值
    has: function (key) {
        return this.get(key) !== undefined;
    },
    // 删除值
    remove: function (key) {
        this.storage.removeItem(key);
    },
    // 清空值
    clear: function () {
        this.storage.clear();
    },
    // 序列化
    serialize: function (value) {
        return JSON.stringify(value);
    },
    // 反序列化
    deserialize: function (value) {
        if (typeof value != 'string') {
            return undefined
        }
        try {
            return JSON.parse(value);
        }
        catch (e) {
            return value || undefined;
        }
    },
    forEach: function (callback) {
        for (var i = 0; i < this.storage.length; i++) {
            var key = this.storage.key(i);
            callback(key, this.get(key));
        }
    }
});

exports.session = new Store(sessionStorage);
exports.local = new Store(localStorage);
var expireLocal = new Store(localStorage);
expireLocal._get = expireLocal.get;
expireLocal._set = expireLocal.set;
expireLocal.get = function (key , ver ,defaultVal) {
    var info = this._get(key);
    if (!info) {
        return null;
    }
    if (new Date().getTime() - info.time > info.exp * 1000 || ver !== info.ver) {
        this.remove(key);
        return null;
    }
    return info.val || defaultVal;
};
expireLocal.set = function (key, val, exp, ver) {
    this._set(key, {
        val: val,
        exp: exp,
        ver : ver,
        time: new Date().getTime()
    });
    return val;
};
exports.expireLocal = expireLocal;

