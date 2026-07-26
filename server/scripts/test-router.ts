import { authRouter } from '../auth/routes.js';
console.log(typeof authRouter, authRouter.stack ? authRouter.stack.length : 0);
