export const classNames = (...classNames: string[]): string =>
    classNames
        .reduce<string>(
            (acc, className) =>
                typeof className === 'string' ? `${acc} ${className}` : acc,
            ''
        )
        .trim();
