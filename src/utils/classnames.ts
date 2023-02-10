export const classNames = (...classNames: string[]) =>
    classNames
        .reduce(
            (acc, className) =>
                typeof className === 'string' ? `${acc} ${className}` : acc,
            ''
        )
        .trim();
