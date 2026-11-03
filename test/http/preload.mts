/*
 * Loaded with `node --import` into the server process under test. Installs an
 * undici global dispatcher that sends every request to a non-loopback host to
 * the test stub instead (STUB_ORIGIN), keeping the original host in the Host
 * header, so the server never reaches the real network and the test can see
 * what it sent.
 *
 * .mts until package.json has "type": "module"
 */

import { Agent, setGlobalDispatcher, type Dispatcher } from 'undici';

const stubOrigin = process.env.STUB_ORIGIN;
const loopback = new Set(['localhost', '127.0.0.1', '[::1]']);

if (!stubOrigin) {
    throw new Error('STUB_ORIGIN must be set');
}

// fetch hands the dispatcher its headers as a plain object
const toStub: Dispatcher.DispatcherComposeInterceptor =
    (dispatch) => (opts, handler) => {
        const { host, hostname } = new URL(String(opts.origin));
        if (loopback.has(hostname)) {
            return dispatch(opts, handler);
        }
        return dispatch(
            { ...opts, origin: stubOrigin, headers: { ...opts.headers, host } },
            handler
        );
    };

setGlobalDispatcher(new Agent().compose(toStub));
