import { describe, expect, it } from 'vitest';
import { getLanguage } from '../src/language';

describe('LANGUAGE', () => {
	it('expect raw input', () => {
		expect(getLanguage('foo')).toMatchObject({ raw: 'foo' });
	});
	it('expect oneRight input', () => {
		expect(getLanguage('foo >')).toMatchObject({ raw: 'foo', oneRight: true });
	});
	it('expect twoRight input', () => {
		expect(getLanguage('foo >>')).toMatchObject({
			raw: 'foo',
			twoRight: true,
		});
	});
	it('expect threeRight input', () => {
		expect(getLanguage('foo >>>')).toMatchObject({
			raw: 'foo',
			threeRight: true,
		});
	});
	it('expect oneLeft input', () => {
		expect(getLanguage('foo <')).toMatchObject({ raw: 'foo', oneLeft: true });
	});
	it('expect attention input', () => {
		expect(getLanguage('foo !')).toMatchObject({ raw: 'foo', attention: true });
	});
	it('expect internals input', () => {
		expect(getLanguage('foo ?')).toMatchObject({ raw: 'foo', internals: true });
	});
	it('expect clean input', () => {
		expect(getLanguage('foo')).toMatchObject({ raw: 'foo', clean: true });
	});
});
