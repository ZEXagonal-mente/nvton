import type { NvtonOptions } from './types';

export const OPEN_BRACKET = '[';
export const CLOSE_BRACKET = ']';
export const OPEN_BRACE = '{';
export const CLOSE_BRACE = '}';
export const OPEN_CALL = '(';
export const CLOSE_CALL = ')';

export const BACKSLASH = '\\';
export const DOUBLE_QUOTE = '"';
export const ONE_QUOTE = `'`;
export const NEWLINE = '\n';
export const CARRIAGE_RETURN = '\r';
export const TAB = '\t';

export const PIPE = '|';
export const COMMA = ',';
export const COLON = ':';
export const SPACE = ' ';
export const EMPTY = '';

export const WRONG_KEY = '__WRONG_KEY__';
export const NULL_KEY = '__NULL_KEY__';
export const FAIL = '__FAIL__';

export const MIMETYPE = 'text/nvton';
export const EXTENSION = '.nvton';

export const LANG_EXPOSE_INTERNALS = '?';
export const LANG_TUPLE_KEY = '__TUPLE__-';

export const PARSER_UNDEFINED_VALUE = '__UNDEFINED__';

export const DEFAULT_CONFIG = {
	merge: {
		number: false,
		object: false,
	},
	warnings: {
		wrongKey: false,
	},
} as NvtonOptions;

export const VITEST_MODE = 'VITEST_MODE';
