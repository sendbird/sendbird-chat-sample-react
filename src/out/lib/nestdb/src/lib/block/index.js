"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Block {
    constructor({ blockId, keyName, items = [], limit, }) {
        this.blockId = blockId;
        this.keyName = keyName;
        this.limit = limit;
        this._items = [...items];
    }
    static createFromCacheItem(cacheItem) {
        return cacheItem ? new Block(cacheItem.value) : null;
    }
    get isEmpty() {
        return this._items.length === 0;
    }
    get items() {
        return this._items;
    }
    serialize() {
        return {
            blockId: this.blockId,
            keyName: this.keyName,
            limit: this.limit,
            items: this._items,
        };
    }
    getItemByKey(key) {
        const item = this._items.find((item) => {
            const keyValue = item[this.keyName];
            return key === keyValue;
        });
        return item;
    }
    has(key) {
        return this._items.map((item) => item[this.keyName]).includes(key);
    }
    add(item) {
        const index = this._items.map((item) => item[this.keyName]).indexOf(item[this.keyName]);
        if (index < 0) {
            if (this._items.length < this.limit) {
                this._items.push(item);
                return true;
            }
        }
        else {
            this._items[index] = item;
            return true;
        }
        return false;
    }
    remove(key) {
        for (const i in this._items) {
            if (this._items[i][this.keyName] === key) {
                this._items.splice(parseInt(i), 1);
                return true;
            }
        }
        return false;
    }
    clear() {
        this._items = [];
    }
}
exports.default = Block;
//# sourceMappingURL=index.js.map