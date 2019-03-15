// tslint:disable
// this has no use if I don't have your prettierrc

import { ApiContext } from '../components/ApiContext';
import { useState, useRef, useEffect, useContext } from 'react';

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

export function useApiResource<Data, RequestVariables = never>(
    url: string,
    data?: RequestVariables
): ApiResourceState<Data> {
    const [state, setState] = useState<ApiResourceState<Data>>({
        state: 'not_initialized'
    });
    const api = useContext(ApiContext);

    useEffect(() => {
        if (!api) {
            throw new Error(
                'useApiResource can only be used when wrapped in ApiContext.Provider'
            );
        }

        // if you want to add caching, here would be a good place to do something with api.cache

        let abortController: AbortController | null = new AbortController();
        fetch(`${api.api}${url}`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrer: 'no-referrer',
            body: !data ? undefined : JSON.stringify(data),
            signal: abortController.signal
        })
            .then(response => response.json())
            .then((data: Data) => {
                abortController = null;
                setState({ state: 'success', data });
            })
            .catch(e => {
                if ('name' in e && (e as DOMException).name === 'AbortError') {
                    setState({ state: 'not_initialized' });
                } else {
                    setState({ state: 'error', error: e });
                }
            });
        return () => void (abortController && abortController.abort());
    }, [url, data]);

    return state;
}
