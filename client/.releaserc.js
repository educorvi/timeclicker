module.exports = {
    branches: ['main', { name: 'beta', prerelease: true }],
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        [
            '@semantic-release/changelog',
            {
                changelogFile: 'public/CHANGELOG.md',
            },
        ],
        [
            '@semantic-release/npm',
            {
                publish: false,
            },
        ],
        '@semantic-release/github',
    ],
};
