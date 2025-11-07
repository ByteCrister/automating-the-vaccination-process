// MSW server setup for Next.js
import { setupServer } from 'msw/node';
import { handlers } from './msw.handlers';

export const server = setupServer(...handlers);
