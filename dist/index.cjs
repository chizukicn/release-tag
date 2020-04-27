'use strict';

const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const github$1 = github.getOctokit(process.env.GITHUB_TOKEN);
    const { owner, repo } = github.context.repo;
    const tagName = core.getInput("tag_name", { required: true });
    const tag = tagName.replace("refs/tags/", "");
    const releaseName = core.getInput("release_name", { required: false }) || tag;
    const body = core.getInput("body", { required: false }) || "";
    const draft = core.getInput("draft", { required: false }) === "true";
    const prerelease = /\d-[a-z]/.test(tag);
    await github$1.rest.repos.createRelease({
      owner,
      repo,
      tag_name: tag,
      name: releaseName,
      body,
      draft,
      prerelease
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
