import { createContext } from 'react';

// if you want caching, this is the place for a cache type
export type Cache = never;

export interface ApiContextShape {
    api: string;
    cache?: Cache;
}

export const ApiContext = createContext<ApiContextShape | undefined>(undefined);
