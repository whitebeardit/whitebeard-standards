import { gitRemoteOriginUrl } from '../../../helpers';
require('dotenv').config();

const setup = async () => {
  const branch = process.env.GITHUB_REF_NAME;

  console.log(`Configuring the changelog semantic-release to branch ${branch}`);
  console.log(`GITHUB_REF_NAME=${process.env.GITHUB_REF_NAME}`);

  const gitRemoteUrl = await gitRemoteOriginUrl();
  console.log(`gitRemoteUrl=${gitRemoteUrl}`);

  const config = {
    plugins: [
      '@semantic-release/commit-analyzer',
      '@semantic-release/release-notes-generator',
      [
        '@semantic-release/changelog',
        {
          changelogFile: `CHANGELOG_${branch}.md`,
        },
      ],
      [
        '@semantic-release/npm',
        {
          npmPublish: false,
        },
      ],
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
          message: 'ci: release <%= nextRelease.version %> [skip ci]',
          assets: [`version_${branch}.json`, `CHANGELOG_${branch}.md`],
        },
      ],
    ],
    branches: [
      { name: 'main' },
      { name: 'staging', channel: 'beta', prerelease: 'beta' },
    ],
    type: 'git',
    url: gitRemoteUrl,
  };

  module.exports = config;
};

setup();
