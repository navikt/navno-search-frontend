import React from 'react';
import { logLinkClick } from '../../utils/amplitude';

type Props = {
    href: string;
    className?: string;
    id?: string;
    onClick?: (e: React.MouseEvent) => void;
    analyticsLabel?: string;
    children: React.ReactNode;
};

export const LenkeUstylet = ({
    href,
    className,
    id,
    onClick,
    analyticsLabel,
    children,
}: Props) => {
    const analyticsLinkText =
        analyticsLabel || (typeof children === 'string' ? children : undefined);

    return (
        <a
            href={href}
            className={className}
            id={id}
            onClick={(e) => {
                logLinkClick(href, analyticsLinkText);
                onClick?.(e);
            }}
        >
            {children}
        </a>
    );
};
