import React from 'react';
import Config from '../config';
import {
    DecoratorEnvProps,
    fetchDecoratorReact,
} from '@navikt/nav-dekoratoren-moduler/ssr';

const { DECORATOR_LOCAL_URL, ENV } = process.env;

const envMap: Record<typeof ENV, DecoratorEnvProps['env']> = {
    localhost: 'localhost',
    dev1: 'dev',
    dev2: 'beta',
    prod: 'prod',
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

const decoratorProps = { ...envProps, params: Config.VARS.decoratorParams };

export const getDecorator = async () => {
    return fetchDecoratorReact(decoratorProps);
};
