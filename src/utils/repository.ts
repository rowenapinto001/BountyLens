const REPO_URL_PREFIX = "https://api.github.com/repos/";

export function extractRepositoryName(repositoryUrl: string): string {
  if (!repositoryUrl.startsWith(REPO_URL_PREFIX)) {
    return "Unknown repository";
  }

  const repoPath = repositoryUrl.slice(REPO_URL_PREFIX.length).split("/").slice(0, 2).join("/");
  return repoPath || "Unknown repository";
}
