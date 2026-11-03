import { BodyShort } from '@navikt/ds-react';
import { getTranslations } from './translations.ts';
import type { Hit } from '#shared/types.ts';

// dd.mm.yyyy as in Norway, whatever the server's time zone
const dateFormat = new Intl.DateTimeFormat('nb-NO', {
	timeZone: 'Europe/Oslo',
	day: '2-digit',
	month: '2-digit',
	year: 'numeric',
});

export const formatDate = (iso: string) => dateFormat.format(new Date(iso));

// The modified date only shows when it's later than the published one
const timestamps = ({ publishedTime, modifiedTime, language }: Hit) => {
	if (!publishedTime) {
		return null;
	}

	const translations = getTranslations(language);
	const published = `${translations.published} ${formatDate(publishedTime)}`;

	if (!modifiedTime || publishedTime >= modifiedTime) {
		return published;
	}

	return `${published} | ${translations.lastModified} ${formatDate(modifiedTime)}`;
};

export const Timestamps = ({ hit }: { hit: Hit }) => {
	const text = timestamps(hit);
	return text && <BodyShort size="small">{text}</BodyShort>;
};
