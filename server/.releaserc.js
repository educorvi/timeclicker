module.exports = {
    branches: ["main", {"name": "beta", "prerelease": true}],
    plugins: [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        ["@semantic-release/npm", {
            publish: false
        }],
        "@semantic-release/github"
    ]
}
