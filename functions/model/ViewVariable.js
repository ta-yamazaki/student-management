class ViewVariable {
    constructor() {
      this.data = {};
    }

    get getData() {
        return this.data;
    }

    set setData(data) {
        this.data = data;
    }

    put(key, value) {
        if (! key instanceof String)
            throw new TypeError("keyの型がstringではありません: " + typeof key);

        this.data[key] = value;
    }

}

module.exports = ViewVariable;
