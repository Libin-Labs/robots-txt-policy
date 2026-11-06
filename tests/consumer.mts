import * as api from '@lp-labs/robots-txt-policy';
import { isAllowed } from '@lp-labs/robots-txt-policy';
const policy = 'User-agent: *\nDisallow: /private\nAllow: /private/public';
if (isAllowed(policy, 'ExampleBot', '/private/account')) throw new Error('Disallow was ignored');
// @ts-expect-error invalid argument must be rejected by declarations
api.isAllowed(4, 'Bot', '/');
