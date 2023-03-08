export const classNames = (...classNames: any[]): string =>
    classNames
        .reduce<string>(
            (acc, className) =>
                typeof className === 'string' ? `${acc} ${className}` : acc,
            ''
        )
        .trim();
