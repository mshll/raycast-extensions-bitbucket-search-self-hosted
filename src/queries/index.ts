import { bitbucketFetchObject } from "../helpers/bitbucket";

interface RepositoriesResponse {
  values: any[];
  nextPageStart?: number;
}

/**
 * @param key
 * @param start
 * @param repositories
 * @returns
 * @see https://developer.atlassian.com/server/bitbucket/rest/v805/api-group-repository/#api-api-latest-repos-get
 */
export async function getRepositories(key: string, start = 0, repositories: any[] = []): Promise<any[]> {
  const data = await bitbucketFetchObject<RepositoriesResponse>("/rest/api/latest/repos", {
    start,
    limit: 200,
  });

  repositories = repositories.concat(data.values);
  if (data.nextPageStart) {
    return getRepositories(key, data.nextPageStart, repositories);
  }

  return repositories;
}

interface PullRequestsResponse {
  values: any[];
  nextPageStart?: number;
}

/**
 * @param repository
 * @param start
 * @param pullRequests
 * @returns
 * @see https://developer.atlassian.com/server/bitbucket/rest/v805/api-group-pull-requests/#api-api-latest-projects-projectkey-repos-repositoryslug-pull-requests-get
 */
export async function pullRequestsGetQuery(
  repository: { project: { key: string }; slug: string },
  start = 0,
  pullRequests: any[] = []
): Promise<any[]> {
  const data = await bitbucketFetchObject<PullRequestsResponse>(
    `/rest/api/latest/projects/${repository.project.key}/repos/${repository.slug}/pull-requests`,
    {
      avatarSize: 64,
      order: "newest",
      state: "OPEN",
      start,
    }
  );

  pullRequests = pullRequests.concat(data.values);
  if (data.nextPageStart) {
    return pullRequestsGetQuery(repository, data.nextPageStart, pullRequests);
  }

  return pullRequests;
}

/**
 * @param start
 * @param pullRequests
 * @returns
 * @see https://developer.atlassian.com/server/bitbucket/rest/v805/api-group-dashboard/#api-api-latest-dashboard-pull-requests-get
 */
export async function getMyOpenPullRequests(start = 0, pullRequests: any[] = []): Promise<any[]> {
  const data = await bitbucketFetchObject<PullRequestsResponse>("/rest/api/latest/dashboard/pull-requests", {
    state: "OPEN",
    start,
  });

  pullRequests = pullRequests.concat(data.values);
  if (data.nextPageStart) {
    return getMyOpenPullRequests(data.nextPageStart, pullRequests);
  }

  return pullRequests;
}
