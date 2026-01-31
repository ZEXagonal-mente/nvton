import { describe, expect, it } from 'vitest';
import { nvton } from '../src/pipeline';
import { FAIL } from '../src/constants';

describe('NVTON', () => {
	it('expect NVTON instance exists', () => {
		const data = nvton('[0]');

		expect(data.get('0')).toEqual(0);
	});
  it('expect NVTON fail', () => {
		const data = nvton('[0]');

		expect(data.get('1')).toEqual(FAIL);
	});
	it('expect NVTON instance correct size', () => {
		const data = nvton('[["foo": "foo"], ["bar": "bar"], ["baz": "baz"]]');

		expect(data.info().size.all).toEqual(3);
	});
	it('expect error in read', () => {
		expect(() => nvton('null.nvton')).toThrowError(
			'null.nvton file not found or datatype is wrong!'
		);
	});
	it('expect format result with correct format', () => {
		const data = nvton('[0, 1, [["key" | "value"], ["test" | "test"]], 2]');

		expect(data.format()).toEqual('[0, 1, [["key" | "value"], ["test" | "test"]], 2]');
	});
	it('expect get with internals values', () => {
		const data = nvton('[0]');

		expect(data.get('0 ?')).toEqual({
			fail: false,
			quantity: 1,
			type: 'default',
			value: 0,
		});
	});
});
