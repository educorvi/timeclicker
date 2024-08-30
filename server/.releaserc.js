/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
    branches: ['main', { name: 'beta', prerelease: true }],
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        [
            '@semantic-release/changelog',
            {
                changelogFile: 'CHANGELOG.md',
            },
        ],
        [
            'semantic-release-yarn',
            {
                publish: false,
            },
        ],
        '@semantic-release/github',
    ],
};
