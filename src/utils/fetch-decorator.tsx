import React from 'react';
import Config from '../config';
import {
    DecoratorEnvProps,
    DecoratorParams,
    fetchDecoratorReact,
} from '@navikt/nav-dekoratoren-moduler/ssr';

const { DECORATOR_LOCAL_URL, ENV } = process.env;
type DecoratorContext = DecoratorParams['context'];

const envMap: Record<typeof ENV, DecoratorEnvProps['env']> = {
    localhost: 'localhost',
    dev1: 'dev',
    dev2: 'beta',
    prod: 'prod',
    prodbeta: 'prod',
};

const decoratorEnv = envMap[process.env.ENV] || 'prod';

const envProps =
    decoratorEnv === 'localhost'
        ? {
              env: decoratorEnv,
              localUrl: DECORATOR_LOCAL_URL,
          }
        : {
              env: decoratorEnv,
          };

export const getDecorator = async (context: DecoratorContext) => {
    const decoratorProps = {
        ...envProps,
        params: { ...Config.VARS.decoratorParams, context },
    };
    return fetchDecoratorReact(decoratorProps);
};
