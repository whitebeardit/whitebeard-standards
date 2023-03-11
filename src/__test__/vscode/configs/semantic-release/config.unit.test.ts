process.env.GITHUB_REMOTE_URL =
  'git@github.com:whitebeardit/whitebeard-standards.git';
process.env.GITHUB_REF_NAME = 'main';

import config from '../../../../vscode/configs/semantic-release/config';

describe('Config Semantic-Release', () => {
  it('Should return a right configuration', async () => {
    expect(config).toMatchObject({
      branches: [
        { name: 'main' },
        { channel: 'beta', name: 'staging', prerelease: 'beta' },
      ],
      plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        ['@semantic-release/changelog', { changelogFile: 'CHANGELOG_main.md' }],
        ['@semantic-release/npm', { npmPublish: false }],
        [
          '@semantic-release/exec',
          {
            prepareCmd:
              './setup/set-version.sh -b ${branch.name} -v ${nextRelease.version}',
          },
        ],
        [
          '@semantic-release/git',
          {
            assets: ['version_main.json', 'CHANGELOG_main.md'],
            message: 'ci: release <%= nextRelease.version %> [skip ci]',
          },
        ],
      ],
      type: 'git',
      url: 'git@github.com:whitebeardit/whitebeard-standards.git',
    });
  });
});
