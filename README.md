# @lp-labs/robots-txt-policy

Small robots.txt parser and deterministic user-agent/path allow-disallow evaluator.

Original, standalone MIT TypeScript implementation with **zero runtime or peer dependencies**. ESM/CommonJS exports and separate declarations; Node18+ and compatible ES2022 browsers. No service, filesystem, network, clock or browser globals accessed on import. Compiler/formatter dependencies are development-only.

## Install

```sh
npm install @lp-labs/robots-txt-policy
```

## Working example

```js
import { isAllowed } from '@lp-labs/robots-txt-policy';
const policy = 'User-agent: *\nDisallow: /private\nAllow: /private/public';
if (isAllowed(policy, 'ExampleBot', '/private/account')) throw new Error('Disallow was ignored');
```

CommonJS: `const api = require('@lp-labs/robots-txt-policy')`.

## Behavior, customization and limits

Implements an explicit robots.txt subset: user-agent groups, allow/disallow, wildcard * and terminal $. Longest matching agent group and path rule win; allow wins equal-length ties. It is not a crawler, does not fetch files, and does not implement sitemap or crawl-delay extensions.

Use the explicit function arguments and public types below to customize the documented behavior. There are no hidden environment settings or sibling-library requirements. Array inputs must be dense; sparse entries are invalid. Inputs are validated before a successful result is returned. Outputs do not mutate caller-owned inputs. Hostile proxies/getters and concurrent mutation are outside the contract.

## Errors and integration

Invalid data never produces an empty success-shaped substitute. TypeError reports incompatible runtime types/nonfinite numbers; RangeError reports unsupported ranges, invalid syntax, inconsistent states and exceeded budgets. Functions that explicitly return null, false or empty arrays describe those legitimate outcomes above. Errors propagate to callers; UI applications should catch at their boundary and visibly notify users. Numerical calculations use JavaScript IEEE754 unless the API explicitly uses bigint; compare approximate numerical results with application-appropriate tolerances.

## Complete public API

```ts
export declare function isAllowed(text: string, userAgent: string, path: string): boolean;
```

## Performance and portability

Complexity and resource ceilings are specified above. Buffered synchronous algorithms do not create workers or timers; callers can move expensive work to their own worker. Limits are enforced, not silently truncated. No runtime imports from any other library. No compatibility or completeness claims beyond the stated scope.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
