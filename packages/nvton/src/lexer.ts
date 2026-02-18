import { warning } from './console';
import {
	CLOSE_BRACE,
	CLOSE_BRACKET,
	COMMA,
	EMPTY,
	OPEN_BRACE,
	OPEN_BRACKET,
	OPEN_CALL,
	PIPE,
	SPACE,
	WRONG_KEY,
} from './constants';
import { parseKey } from './parser';
import { LexerData, LexerResult, LexerType, NvtonOptions } from './types';

export const getNVTONType = (str: string): LexerType => {
	return str.startsWith(OPEN_BRACE) && str.endsWith(CLOSE_BRACE)
		? 'object'
		: str.startsWith(OPEN_BRACKET) && str.endsWith(CLOSE_BRACKET)
			? 'tuple'
			: str.startsWith(OPEN_CALL)
				? 'function'
				: 'default';
};

const getCommonTypeCase = (str: string): { data: LexerData; type: LexerType } | true => {
	const type = getNVTONType(str);

	if (type === 'object' || type === 'default') {
		return {
			data: parseKey(str, type),
			type,
		};
	}

	// TODO: support common and arrow functions
	return true;
};

const removeBrackets = (str: string) => str.substring(1, str.length - 1).trim();

const isTuple = (tuple: string) =>
	tuple.startsWith(OPEN_BRACKET) && tuple.endsWith(CLOSE_BRACKET);

export const run = (
	raw: string,
	options?: { init?: { deep?: number; prev?: string; lexeme?: string } }
) => {
	let deep = options?.init?.deep || 0;
	let prev = options?.init?.prev || EMPTY;
	let lexeme = options?.init?.lexeme || EMPTY;
	const items = [] as string[];

	const setAndReset = () => {
		const target = lexeme.trim();

		if (target === EMPTY) return;
		items.push(target);
		lexeme = EMPTY;
	};

	let normalize = isTuple(raw) ? removeBrackets(raw) : raw;
  normalize = isTuple(normalize) ? removeBrackets(normalize) : normalize;

	for (const key of normalize) {
		if (key === OPEN_BRACKET) {
			if (deep === 0) setAndReset();
			deep++;
		} else if (key === COMMA && deep === 0) {
			setAndReset();
		}

		if ((![COMMA, SPACE].includes(key) && deep === 0) || deep > 0) lexeme += key;

		if (key === CLOSE_BRACKET) {
			deep--;
			if (deep < 1) setAndReset();
		}

		if (key !== SPACE) prev = key;
	}

	setAndReset();

	return items.map((it) => it.trim());
};

export const lex = (raw: string, options?: NvtonOptions): LexerResult => {
	if (!isTuple(raw)) return [];

	const normalize = run(raw);

	return normalize.map((str) => {
		const def = getCommonTypeCase(str);

		if (def !== true)
			return {
				key: str,
				data: def.data,
				type: def.type,
			};

		if (!isTuple(str)) return [];

		return run(str, { init: { deep: 1 } })
			.map((tuple, index) => {
				const [key, ...rest] = tuple.split(PIPE);
				const value = rest.join(PIPE);
				const data = [key, value].map((tg) => tg.trim()).filter(Boolean);

				if (data.length < 1 || data.length > 2) {
					if (options?.warnings?.wrongKey)
						warning(`error parse (${tuple}) to ${data.join('')} in ${index}index.`);
					return WRONG_KEY;
				}

				const structure =
					data.length === 1
						? { key: data[0], value: data[0] }
						: { key: data[0], value: data[1] };

				const common = getCommonTypeCase(structure.value);

				if (common !== true) {
					return {
						// TODO: correct normalize keys in runner for edge case problems
						key: structure.key.replace(/'/g, EMPTY).replace(OPEN_BRACKET, EMPTY),
						type: common.type,
						data: common.data,
					};
				}

				// TODO: support recursive tuple format
				if (options?.warnings?.wrongKey)
					warning(`error parse (${tuple}) to ${data.join('')} in ${index}index.`);
				return WRONG_KEY;
			})
			.filter((tuple) => tuple !== WRONG_KEY);
	});
};
