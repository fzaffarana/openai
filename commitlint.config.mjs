export default {
  extends: ['@commitlint/config-conventional'],
  ignores: [
    (commit) => commit.startsWith('chore(deps)'),
    (commit) => commit.startsWith('chore(deps-dev)'),
    (commit) => commit.startsWith('chore(release)'),
  ],
};
