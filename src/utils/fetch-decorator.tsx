import React from 'react';
import Config from '../config';
import {
    DecoratorEnvProps,
    fetchDecoratorReact,
} from '@navikt/nav-dekoratoren-moduler/ssr';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';

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
              // Service discovery only works when running on k8s
              // Do not use during CI build
              serviceDiscovery:
                  process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD,
          };

const decoratorProps = { ...envProps, params: Config.VARS.decoratorParams };

export const getDecorator = async () => {
    return fetchDecoratorReact(decoratorProps);
};
