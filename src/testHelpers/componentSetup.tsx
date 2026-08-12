import React from 'react';
import { render } from '@testing-library/react';
import { ContextProvider } from 'context/ContextProvider';
import { SearchResultProps } from 'types/search-result';
import { SearchParams } from 'types/search-params';

type ContextProps = {
    initialResult: SearchResultProps;
    initialParams?: SearchParams;
};

/**
 * Makes `componentProps` optional only when every property of `P` is
 * optional (i.e. the component takes no required props). Otherwise
 * `componentProps` is required, so a test can't silently omit props the
 * component actually needs.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- `{}` here means "a type with no required properties", not "any value"
type RequiredIfComponentHasProps<P> = {} extends P ? P | undefined : P;

type TestConfigProps<P extends object> = {
    Component: React.ComponentType<P>;
    contextProps: ContextProps;
    componentProps: RequiredIfComponentHasProps<P>;
};

export const componentSetup = <P extends object>({
    Component,
    contextProps,
    componentProps,
}: TestConfigProps<P>) => {
    const { initialResult, initialParams } = contextProps;
    const utils = render(
        <ContextProvider
            initialResult={initialResult}
            initialParams={initialParams}
        >
            <Component {...(componentProps as P)} />
        </ContextProvider>
    );

    return {
        ...utils,
    };
};
