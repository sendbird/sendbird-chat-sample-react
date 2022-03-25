"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const match_1 = require("../../../src/component/query/match");
describe('[unit] component/query/match', () => {
    test('match() property value', (done) => {
        const item = { a: 10, b: 20 };
        expect((0, match_1.match)({ 'a': 10 }, item)).toBeTruthy();
        expect((0, match_1.match)({ 'a': 20 }, item)).toBeFalsy();
        done();
    });
    test('match() property /eq', (done) => {
        const item = { a: 10, b: 20 };
        expect((0, match_1.match)({ 'a': { '/eq': 10 } }, item)).toBeTruthy();
        expect((0, match_1.match)({ 'a': { '/eq': 20 } }, item)).toBeFalsy();
        expect((0, match_1.match)({ 'a': { '=': 10 } }, item)).toBeTruthy();
        expect((0, match_1.match)({ 'a': { '=': 20 } }, item)).toBeFalsy();
        done();
    });
    test('match() property /neq', (done) => {
        const item = { a: 10, b: 20 };
        expect((0, match_1.match)({ 'a': { '/neq': 20 } }, item)).toBeTruthy();
        expect((0, match_1.match)({ 'a': { '/neq': 10 } }, item)).toBeFalsy();
        expect((0, match_1.match)({ 'a': { '!=': 20 } }, item)).toBeTruthy();
        expect((0, match_1.match)({ 'a': { '!=': 10 } }, item)).toBeFalsy();
        done();
    });
    test('match() property /gt', (done) => {
        const item = { a: 10, b: 20 };
        expect((0, match_1.match)({ 'a': { '/gt': 5 } }, item)).toBeTruthy();
        expect((0, match_1.match)({ 'a': { '/gt': 10 } }, item)).toBeFalsy();
        expect((0, match_1.match)({ 'a': { '/gt': 20 } }, item)).toBeFalsy();
        expect((0, match_1.match)({ 'a': { '>': 5 } }, item)).toBeTruthy();
        expect((0, match_1.match)({ 'a': { '>': 10 } }, item)).toBeFalsy();
        expect((0, match_1.match)({ 'a': { '>': 20 } }, item)).toBeFalsy();
        done();
    });
    test('match() property /gte', (done) => {
        const item = { a: 10, b: 20 };
        expect((0, match_1.match)({ 'a': { '/gte': 5 } }, item)).toBeTruthy();
        expect((0, match_1.match)({ 'a': { '/gte': 10 } }, item)).toBeTruthy();
        expect((0, match_1.match)({ 'a': { '/gte': 20 } }, item)).toBeFalsy();
        expect((0, match_1.match)({ 'a': { '>=': 5 } }, item)).toBeTruthy();
        expect((0, match_1.match)({ 'a': { '>=': 10 } }, item)).toBeTruthy();
        expect((0, match_1.match)({ 'a': { '>=': 20 } }, item)).toBeFalsy();
        done();
    });
    test('match() property /lt', (done) => {
        const item = { a: 10, b: 20 };
        expect((0, match_1.match)({ 'a': { '/lt': 5 } }, item)).toBeFalsy();
        expect((0, match_1.match)({ 'a': { '/lt': 10 } }, item)).toBeFalsy();
        expect((0, match_1.match)({ 'a': { '/lt': 20 } }, item)).toBeTruthy();
        expect((0, match_1.match)({ 'a': { '<': 5 } }, item)).toBeFalsy();
        expect((0, match_1.match)({ 'a': { '<': 10 } }, item)).toBeFalsy();
        expect((0, match_1.match)({ 'a': { '<': 20 } }, item)).toBeTruthy();
        done();
    });
    test('match() property /lte', (done) => {
        const item = { a: 10, b: 20 };
        expect((0, match_1.match)({ 'a': { '/lte': 5 } }, item)).toBeFalsy();
        expect((0, match_1.match)({ 'a': { '/lte': 10 } }, item)).toBeTruthy();
        expect((0, match_1.match)({ 'a': { '/lte': 20 } }, item)).toBeTruthy();
        expect((0, match_1.match)({ 'a': { '<=': 5 } }, item)).toBeFalsy();
        expect((0, match_1.match)({ 'a': { '<=': 10 } }, item)).toBeTruthy();
        expect((0, match_1.match)({ 'a': { '<=': 20 } }, item)).toBeTruthy();
        done();
    });
    test('match() property /in', (done) => {
        const item = { a: 10, b: 20 };
        expect((0, match_1.match)({ 'a': { '/in': [5, 10, 20] } }, item)).toBeTruthy();
        expect((0, match_1.match)({ 'a': { '/in': [5, 20, 30] } }, item)).toBeFalsy();
        done();
    });
    test('match() property /nin', (done) => {
        const item = { a: 10, b: 20 };
        expect((0, match_1.match)({ 'a': { '/nin': [5, 10, 20] } }, item)).toBeFalsy();
        expect((0, match_1.match)({ 'a': { '/nin': [5, 20, 30] } }, item)).toBeTruthy();
        done();
    });
    test('match() property /contain', (done) => {
        const item = { a: [5, 10, 20], b: 20 };
        expect((0, match_1.match)({ 'a': { '/contain': 10 } }, item)).toBeTruthy();
        expect((0, match_1.match)({ 'a': { '/contain': 15 } }, item)).toBeFalsy();
        done();
    });
    test('match() property /regex', (done) => {
        const item = { a: 'abcdeee', b: 20 };
        expect((0, match_1.match)({ 'a': { '/regex': /abcde+/ } }, item)).toBeTruthy();
        expect((0, match_1.match)({ 'a': { '/regex': /abce+/ } }, item)).toBeFalsy();
        done();
    });
    test('match() property /where', (done) => {
        const item = { a: 10, b: 20 };
        expect((0, match_1.match)({ 'a': { '/where': (val) => val > 5 } }, item)).toBeTruthy();
        expect((0, match_1.match)({ 'a': { '/where': (val) => val > 15 } }, item)).toBeFalsy();
        done();
    });
    test('match() property function', (done) => {
        const item = { a: 10, b: 20 };
        expect((0, match_1.match)({ 'a': (val) => val > 5 }, item)).toBeTruthy();
        expect((0, match_1.match)({ 'a': (val) => val > 15 }, item)).toBeFalsy();
        done();
    });
    test('match() composite property', (done) => {
        const item = { a: 10, b: 20 };
        expect((0, match_1.match)({ 'a': { '>=': 5 }, 'b': { '>': 15 } }, item)).toBeTruthy();
        expect((0, match_1.match)({ 'a': { '>=': 15 }, 'b': { '>': 15 } }, item)).toBeFalsy();
        done();
    });
    test('match() composite operator', (done) => {
        const item = { a: 10, b: 20 };
        expect((0, match_1.match)({ 'a': { '>=': 5, '<': 12 } }, item)).toBeTruthy();
        expect((0, match_1.match)({ 'a': { '>=': 5, '<': 10 } }, item)).toBeFalsy();
        done();
    });
    test('match() group /and', (done) => {
        const item = { a: 10, b: 20 };
        expect((0, match_1.match)({
            '/and': [
                { 'a': { '>': 5 } },
                { 'b': { '<': 30 } },
            ]
        }, item)).toBeTruthy();
        expect((0, match_1.match)({
            '/and': [
                { 'a': { '>': 5 } },
                { 'b': { '<': 10 } },
            ]
        }, item)).toBeFalsy();
        expect((0, match_1.match)({
            '&&': [
                { 'a': { '>': 5 } },
                { 'b': { '<': 30 } },
            ]
        }, item)).toBeTruthy();
        expect((0, match_1.match)({
            '&&': [
                { 'a': { '>': 5 } },
                { 'b': { '<': 10 } },
            ]
        }, item)).toBeFalsy();
        done();
    });
    test('match() group /or', (done) => {
        const item = { a: 10, b: 20 };
        expect((0, match_1.match)({
            '/or': [
                { 'a': { '>': 5 } },
                { 'b': { '<': 30 } },
            ]
        }, item)).toBeTruthy();
        expect((0, match_1.match)({
            '/or': [
                { 'a': { '>': 5 } },
                { 'b': { '<': 10 } },
            ]
        }, item)).toBeTruthy();
        expect((0, match_1.match)({
            '/or': [
                { 'a': { '>': 15 } },
                { 'b': { '<': 10 } },
            ]
        }, item)).toBeFalsy();
        expect((0, match_1.match)({
            '||': [
                { 'a': { '>': 5 } },
                { 'b': { '<': 30 } },
            ]
        }, item)).toBeTruthy();
        expect((0, match_1.match)({
            '||': [
                { 'a': { '>': 5 } },
                { 'b': { '<': 10 } },
            ]
        }, item)).toBeTruthy();
        expect((0, match_1.match)({
            '||': [
                { 'a': { '>': 15 } },
                { 'b': { '<': 10 } },
            ]
        }, item)).toBeFalsy();
        done();
    });
    test('match() group nested', (done) => {
        const item = { a: 10, b: 20 };
        expect((0, match_1.match)({
            '/and': [
                { 'a': { '>': 5 } },
                { 'b': { '<': 30 } },
                { 'a': { '/where': (val) => val < 20 } },
                {
                    '/or': [
                        { 'b': { '>': 15 } },
                        { 'b': { '<': 5 } },
                    ]
                }
            ]
        }, item)).toBeTruthy();
        expect((0, match_1.match)({
            '/and': [
                { 'a': { '>': 5 } },
                { 'b': { '<': 30 } },
                { 'a': { '/where': (val) => val < 20 } },
                {
                    '/or': [
                        { 'b': { '>': 25 } },
                        { 'b': { '<': 5 } },
                    ]
                }
            ]
        }, item)).toBeFalsy();
        done();
    });
    test('match() query /where', (done) => {
        const item = { a: 10, b: 20 };
        expect((0, match_1.match)({ '/where': (item) => { return item['a'] > 5 && item['b'] > 10; } }, item)).toBeTruthy();
        expect((0, match_1.match)({ '/where': (item) => { return item['a'] > 15 && item['b'] > 10; } }, item)).toBeFalsy();
        done();
    });
    test('match() query /where combination', (done) => {
        const item = { a: 10, b: 20 };
        expect((0, match_1.match)({ 'a': 10, '/where': (item) => { return item['a'] > 5 && item['b'] > 10; } }, item)).toBeTruthy();
        expect((0, match_1.match)({ 'a': 20, '/where': (item) => { return item['a'] > 5 && item['b'] > 10; } }, item)).toBeFalsy();
        expect((0, match_1.match)({ 'a': 10, '/where': (item) => { return item['a'] > 15 && item['b'] > 10; } }, item)).toBeFalsy();
        done();
    });
    test('match() query function', (done) => {
        const item = { a: 10, b: 20 };
        expect((0, match_1.match)((val) => val['a'] > 5, item)).toBeTruthy();
        expect((0, match_1.match)((val) => val['a'] > 15, item)).toBeFalsy();
        done();
    });
    test('match() null', (done) => {
        const item = null;
        expect((0, match_1.match)((val) => val['a'] > 5, item)).toBeFalsy();
        expect((0, match_1.match)({ 'a': { '>': 10 } }, item)).toBeFalsy();
        done();
    });
});
//# sourceMappingURL=query.match.test.js.map