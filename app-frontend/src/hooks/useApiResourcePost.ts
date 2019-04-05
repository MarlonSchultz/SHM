// tslint:disable
// this has no use if I don't have your prettierrc

import { ApiContext } from '../components/ApiContext';
import { useState, useRef, useContext } from 'react';

export type ApiResourceState<T> =
    | {
          state: 'not_initialized';
      }
    | {
          state: 'loading';
      }
    | {
          state: 'success';
          data: T;
      }
    | {
          state: 'error';
          error: Error;
      };

export function useApiResourcePost<Data, RequestVariables = never>(
    url: string,
    request?: Partial<RequestInit>
): [(data: RequestVariables) => Promise<[Data, Response]>, ApiResourceState<Data>] {
    const [state, setState] = useState<ApiResourceState<Data>>({
        state: 'not_initialized',
    });
    const api = useContext(ApiContext);

    const abortController = useRef<AbortController | undefined>(undefined);

    const startRequest = (data: RequestVariables) => {
        if (!api) {
            throw new Error('useApiResource can only be used when wrapped in ApiContext.Provider');
        }
        if (abortController.current) {
            abortController.current.abort();
        }
        abortController.current = new AbortController();
        let fetchParams: RequestInit = {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrer: 'no-referrer',
            body: !data ? undefined : JSON.stringify(data),
            signal: abortController.current.signal,
        };
        if (request) {
            fetchParams = { ...fetchParams, ...request };
        }
        setState({ state: 'loading' });
        return fetch(`${api.api}${url}`, fetchParams)
            .then((response) => Promise.all([response.json(), response]))
            .then(([data, response]: [Data, Response]) => {
                abortController.current = undefined;
                setState({ state: 'success', data });
                return [data, response] as [Data, Response];
            })
            .catch((e) => {
                if ('name' in e && (e as DOMException).name === 'AbortError') {
                    setState({ state: 'not_initialized' });
                    throw e;
                } else {
                    setState({ state: 'error', error: e });
                    throw e;
                }
            });
    };

    return [startRequest, state];
}
