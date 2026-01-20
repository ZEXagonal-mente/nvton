import { LanguageItem } from './types';

export const getLanguage = (raw: string): LanguageItem => {
	if (raw.match(/>>>/gi)) {
		return {
			raw: raw.replace('>>>', '').trim(),
			threeRight: true,
		};
	}

	if (raw.match(/>>/gi)) {
		return {
			raw: raw.replace('>>', '').trim(),
			twoRight: true,
		};
	}

	if (raw.match(/>/gi)) {
		return {
			raw: raw.replace('>', '').trim(),
			oneRight: true,
		};
	}

	if (raw.includes('<')) {
		return {
			raw: raw.replace('<', '').trim(),
			oneLeft: true,
		};
	}

	if (raw.match(/!/gi)) {
		return {
			raw: raw.replace('!', '').trim(),
			attention: true,
		};
	}

	if (raw.includes('?')) {
		return {
			raw: raw.replace('?', '').trim(),
			internals: true,
		};
	}

	return { raw, clean: true };
};
