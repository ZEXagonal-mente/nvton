import { loadConfig } from 'c12';
import { defu } from 'defu';
import type {
	Awaitable,
	DataInternals,
	LexerKey,
	LexerMap,
	LexerResult,
	Maybe,
	NvtonLoadRunner,
	NvtonOptions,
	UtilsKeyGet,
} from './types';
import { isBrowser, writeFile } from './utils';
import {
	CLOSE_BRACKET,
	COMMA,
	DEFAULT_CONFIG,
	EMPTY,
	EXTENSION,
	FAIL,
	LANG_TUPLE_KEY,
	OPEN_BRACKET,
	PARSER_UNDEFINED_VALUE,
	PIPE,
} from './constants';
import { lex } from './lexer';
import { warning } from './console';
import { getLanguage } from './language';

const utils = () => {
	const keySet = (_key: string, runner?: NvtonLoadRunner) => {
		return runner?.isTuple ? `${LANG_TUPLE_KEY}${_key}` : _key;
	};

	const keyGet = (_key: LexerKey): UtilsKeyGet => {
		return {
			type: _key.startsWith(LANG_TUPLE_KEY) ? 'tuple' : 'common',
			raw: _key.replace(LANG_TUPLE_KEY, ''),
		};
	};

	return { keySet, keyGet };
};

export class NVTON {
	private data: Map<LexerKey, LexerMap> = new Map();
	private options: NvtonOptions = DEFAULT_CONFIG;
	private size = {
		all: 0,
		raw: 0,
		tuples: {
			all: {
				count: 0,
			},
			source: {
				count: 0,
			},
		},
	};

	private loadDefaultConfig(
		options?: Partial<NvtonOptions>,
		external: boolean = false
	): Awaitable<NvtonOptions> {
		try {
			if (!isBrowser && !external) {
				return new Promise(async (res) => {
					const { config } = await loadConfig({
						name: 'nvton',
						rcFile: false,
						envName: false,
						defaultConfig: DEFAULT_CONFIG,
					});

					this.options = defu(options, config);

					res(this.options);
				});
			} else {
				this.options = defu(options, DEFAULT_CONFIG);

				return this.options;
			}
		} catch (e) {
			this.options = defu(options, DEFAULT_CONFIG);

			return this.options;
		}
	}

	constructor(lexeme?: LexerResult, options?: NvtonOptions) {
		this.loadDefaultConfig(options);
		if (lexeme) this.load(lexeme, null, { isConstructor: true });
	}

	public load(
		lexeme: LexerResult,
		options: Maybe<NvtonOptions>,
		runner?: NvtonLoadRunner
	) {
		if (options) this.loadDefaultConfig(options, true);

		lexeme.forEach((item) => {
			if (Array.isArray(item)) {
				this.size.tuples.source.count++;
				this.load(item, null, { isTuple: true });
			} else {
				if (runner?.isTuple) this.size.tuples.all.count++;

				const get = utils().keyGet(item.key);
				const set = utils().keySet(item.key, runner);

				const target = this.data.get(get.raw);
				this.size.raw++;

				if (this.options.warnings.wrongKey && target === undefined) {
					warning(
						`${get.raw} exists and is ignored. Use merge: { object: true } in options for merge values in object.`
					);
				} else {
					let value = item.data;
					if (typeof value === 'string' && value === PARSER_UNDEFINED_VALUE)
						value = undefined;

					if (
						this.options.merge.object &&
						target &&
						target.value &&
						value &&
						typeof target.value === 'object' &&
						typeof value === 'object'
					) {
						value = defu(value, target.value) as object;
					}

					if (
						this.options.merge.number &&
						target &&
						target.value &&
						value &&
						typeof target.value === 'number' &&
						typeof value === 'number'
					) {
						value += target.value as number;
					}

					this.data.set(set, {
						type: item.type,
						value,
					});

					this.size.all++;
				}
			}
		});
	}

	public add(raw: string) {
		this.load(lex(raw), null, undefined);
	}

	public get(target: string) {
		// TODO: language for deep search in foundation
		// TODO: support recursive tuples
		const _key = target.replace(LANG_TUPLE_KEY, EMPTY);
		const _data = this.data.get(_key.replace('?', '').trim()) as Maybe<LexerMap>;

		let quantity = 1;

		const data = getLanguage(_key);
		const isInternals = data.internals;

		if (isInternals) {
			const fail = !!_data;

			return {
				value: fail ? FAIL : _data!.value,
				type: fail ? 'default' : _data!.type,
				fail,
				quantity,
			} as DataInternals;
		}

		return _data!.value;
	}

	public format(external?: Map<LexerKey, LexerMap>) {
		const map = external || this.data;
		let data = OPEN_BRACKET;
		let index = 0;
		// TODO: support recursive tuple format
		let deepTuple = 0;
		map.forEach((item, key, arr) => {
			const result = String(item.value);
			const { type, raw } = utils().keyGet(key);
			const maxIndex = arr.size - 1;

			if (type === 'tuple') {
				if (deepTuple === 0) {
					data += `${OPEN_BRACKET}${OPEN_BRACKET}${raw} ${PIPE} ${result}${CLOSE_BRACKET}`;
				} else {
					data += `${COMMA} ${OPEN_BRACKET}${raw} ${PIPE} ${result}${CLOSE_BRACKET}`;
				}
				deepTuple++;
			} else {
				if (deepTuple !== 0) {
					data += `${CLOSE_BRACKET}${COMMA} ${result}`;
				} else {
					data += result;
					if (index !== maxIndex) data += `${COMMA} `;
				}
				deepTuple = 0;
			}

			index++;
		});

		// if (deepTuple !== 0) data += CLOSE_BRACKET;
		data += CLOSE_BRACKET;

		return data;
	}

	public write(path: string) {
		if (isBrowser) {
			throw new Error(`Browser setups don't support write function!`);
		}

		const data = this.format();

		const filepath = path.endsWith(EXTENSION) ? path : `${path}${EXTENSION}`;

		return writeFile(filepath, data);
	}

	public info() {
		return {
			values: this.data.values(),
			keys: this.data.keys(),
			size: this.size,
		};
	}
}
