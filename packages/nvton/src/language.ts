import { LanguageItem } from './types';

export const getLanguage = (raw: string): LanguageItem => {
	if (raw.match(/>>>/gi)) {
		return {
			raw,
			threeRight: true,
		};
	}

	if (raw.match(/>>/gi)) {
		return {
			raw,
			twoRight: true,
		};
	}

	if (raw.match(/>/gi)) {
		return {
			raw,
			oneRight: true,
		};
	}

	if (raw.match(/</gi)) {
		return {
			raw,
			oneLeft: true,
		};
	}

	if (raw.match(/!/gi)) {
		return {
			raw,
			attention: true,
		};
	}

	if (raw.includes('?')) {
		return {
			raw,
			internals: true,
		};
	}

	return { raw, clean: true };
};
