import { isBrowser, isNode } from 'browser-or-node';

export const isBrowserEnv: boolean = !isNode && isBrowser;
