import React from 'react';
import { render } from '@testing-library/react';
import { ContextProvider } from 'context/ContextProvider';
import { SearchResultProps } from 'types/search-result';
import { SearchParams } from 'types/search-params';

type ContextProps = {
    initialResult: SearchResultProps;
    initialParams?: SearchParams;
};

type ComponentProps = { [key: string]: unknown };

type TestConfigProps = {
    Component: React.FC<unknown>;
    contextProps: ContextProps;
    componentProps?: ComponentProps;
};

export const componentSetup = ({
    Component,
    contextProps,
    componentProps = {},
}: TestConfigProps) => {
    const { initialResult, initialParams } = contextProps;
    const utils = render(
        <ContextProvider
            initialResult={initialResult}
            initialParams={initialParams}
        >
            <Component {...componentProps} />
        </ContextProvider>
    );

    return {
        ...utils,
    };
};
