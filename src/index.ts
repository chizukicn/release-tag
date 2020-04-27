import { getInput, setFailed } from "@actions/core"
import { context, getOctokit } from "@actions/github"

async function run() {
    try {
        // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
        const github = getOctokit(process.env.GITHUB_TOKEN!)

        // Get owner and repo from context of payload that triggered the action
        const { owner, repo } = context.repo

        // Get the inputs from the workflow file: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
        const tagName = getInput("tag_name", { required: true })

        // This removes the 'refs/tags' portion of the string, i.e. from 'refs/tags/v1.10.15' to 'v1.10.15'
        const tag = tagName.replace("refs/tags/", "")
        const releaseName = getInput("release_name", { required: false }) || tag
        const body = getInput("body", { required: false }) || ""
        const draft = getInput("draft", { required: false }) === "true"
        const prerelease = /\d-[a-z]/.test(tag)

        // Create a release
        // API Documentation: https://developer.github.com/v3/repos/releases/#create-a-release
        // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-create-release

        await github.rest.repos.createRelease({
            owner,
            repo,
            tag_name: tag,
            name: releaseName,
            body,
            draft,
            prerelease
        })
    } catch (error: any) {
        setFailed(error.message)
    }
}

run()
