"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_1 = require("../../../src/lib/block");
const cache_1 = require("../../../src/lib/cache");
describe('[unit] lib/block', () => {
    test('createFromCacheItem()', () => {
        const cacheItem = {
            generation: 1,
            state: cache_1.CacheState.VOLATILE,
            key: 'testkey',
            value: {
                blockId: 'testblock',
                keyName: 'testkeyname',
                items: [
                    { a: 10, b: 20 },
                    { a: 12, b: 22 },
                    { a: 11, b: 21 },
                ],
                limit: 20,
            }
        };
        const block = block_1.default.createFromCacheItem(cacheItem);
        expect(block.blockId).toBe(cacheItem.value.blockId);
        expect(block.items).toStrictEqual(cacheItem.value.items);
    });
    test('add() new', () => {
        const newObject = { key: 'testkey' };
        const block = new block_1.default({
            blockId: '123',
            keyName: 'key',
            items: [{ key: 'testkey2' }],
            limit: 10,
        });
        expect(block.add(newObject)).toEqual(true);
        expect(block.has(newObject.key)).toEqual(true);
    });
    test('add() replace', () => {
        const newObject = { key: 'testkey', value: 'final value' };
        const block = new block_1.default({
            blockId: '123',
            keyName: 'key',
            items: [{ key: 'testkey' }],
            limit: 10,
        });
        expect(block.add(newObject)).toEqual(true);
        expect(block.items[0]['value']).toEqual('final value');
    });
    test('add() overflow', () => {
        const newObject = { key: 'testkey', value: 'intial value' };
        const block = new block_1.default({
            blockId: '123',
            keyName: 'key',
            items: [{ key: 'testkey2' }],
            limit: 1,
        });
        expect(block.add(newObject)).toEqual(false);
    });
    test('remove()', () => {
        const block = new block_1.default({
            blockId: '123',
            keyName: 'key',
            items: [{ key: 'testkey' }],
            limit: 10,
        });
        expect(block.remove('testkey')).toBeTruthy();
        expect(block.items.length).toEqual(0);
    });
    test('remove() not found', () => {
        const block = new block_1.default({
            blockId: '123',
            keyName: 'key',
            items: [{ key: 'testkey' }],
            limit: 10,
        });
        expect(block.remove('testkey2')).toBeFalsy();
        expect(block.items.length).toEqual(1);
    });
});
//# sourceMappingURL=block.test.js.map