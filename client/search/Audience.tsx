import { Tag, type TagProps } from '@navikt/ds-react';
import { getTranslations } from './translations.ts';
import type { Audience as AudienceKey } from '#shared/types.ts';

type TagConfig = {
	variant: TagProps['variant'];
	color?: TagProps['data-color'];
};

const tagConfig: Record<AudienceKey, TagConfig> = {
	person: { variant: 'info' },
	employer: { variant: 'outline', color: 'meta-purple' },
	provider: { variant: 'outline', color: 'meta-lime' },
	provider_doctor: { variant: 'outline', color: 'meta-lime' },
	provider_municipality_employed: { variant: 'outline', color: 'meta-lime' },
	provider_optician: { variant: 'outline', color: 'meta-lime' },
	provider_administrator: { variant: 'outline', color: 'meta-lime' },
	provider_measures_organizer: { variant: 'outline', color: 'meta-lime' },
	provider_aid_supplier: { variant: 'outline', color: 'meta-lime' },
	provider_other: { variant: 'outline', color: 'meta-lime' },
	other: { variant: 'neutral' },
};

type Props = {
	audience: AudienceKey | AudienceKey[];
	language: string;
};

export const Audience = ({ audience, language }: Props) => {
	const translations = getTranslations(language);

	return (Array.isArray(audience) ? audience : [audience]).map((key) => {
		const config = tagConfig[key];
		// One the API added after this list: no tag rather than a broken one
		if (!config) {
			return null;
		}

		return (
			<Tag variant={config.variant} data-color={config.color} className="sok-tag" size="small" key={key}>
				{translations[key]}
			</Tag>
		);
	});
};
