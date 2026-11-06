export function isAllowed(text: string, userAgent: string, path: string): boolean {
  if (
    typeof text !== 'string' ||
    text.length > 65536 ||
    typeof userAgent !== 'string' ||
    typeof path !== 'string'
  )
    throw new TypeError('Expected bounded policy and strings');
  if (!userAgent.trim() || !path.startsWith('/'))
    throw new RangeError('User agent and absolute path are required');
  type Rule = { allow: boolean; pattern: string };
  type Group = { agents: string[]; rules: Rule[] };
  const groups: Group[] = [];
  let group: Group | null = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.split('#', 1)[0]!.trim();
    if (!line) continue;
    const i = line.indexOf(':');
    if (i < 1) continue;
    const key = line.slice(0, i).trim().toLowerCase(),
      value = line.slice(i + 1).trim();
    if (key === 'user-agent') {
      if (!group || group.rules.length) {
        group = { agents: [], rules: [] };
        groups.push(group);
      }
      group.agents.push(value.toLowerCase());
    } else if (group && (key === 'allow' || key === 'disallow') && value)
      group.rules.push({ allow: key === 'allow', pattern: value });
  }
  const ua = userAgent.toLowerCase();
  const matching = groups
    .map((g) => ({
      g,
      n: Math.max(
        -1,
        ...g.agents
          .filter((a) => a === '*' || ua.includes(a))
          .map((a) => (a === '*' ? 0 : a.length)),
      ),
    }))
    .filter((x) => x.n >= 0);
  if (!matching.length) return true;
  const best = Math.max(...matching.map((x) => x.n));
  const rules = matching.filter((x) => x.n === best).flatMap((x) => x.g.rules);
  const matches = (pattern: string, candidate: string) => {
    const terminal = pattern.endsWith('$'),
      body = terminal ? pattern.slice(0, -1) : pattern,
      parts = body.split('*');
    let cursor = 0;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]!;
      if (!part) continue;
      const at = candidate.indexOf(part, cursor);
      if (at < 0 || (i === 0 && at !== 0)) return false;
      cursor = at + part.length;
    }
    return !terminal || cursor === candidate.length;
  };
  let winner: Rule | null = null;
  for (const rule of rules)
    if (
      matches(rule.pattern, path) &&
      (!winner ||
        rule.pattern.length > winner.pattern.length ||
        (rule.pattern.length === winner.pattern.length && rule.allow))
    )
      winner = rule;
  return winner?.allow ?? true;
}
