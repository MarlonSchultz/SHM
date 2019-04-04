import { DraftProject, Project } from 'actions/projects';
import { useApiResource, ApiResourceState } from './useApiResource';
import { useApiResourcePost } from './useApiResourcePost';

export function useGetProjects(): ApiResourceState<Project[]> {
    return useApiResource<Project[]>('/projects', undefined, {method:'GET'});
}

export function useAddProject(
    draft: DraftProject,
): [() => Promise<boolean>, ApiResourceState<unknown>] {
    const [startRequest, apiResourceState] = useApiResourcePost<
        unknown,
        DraftProject
    >('/projects');

    return [
        () =>
            startRequest(draft)
                .then(
                    ([, response]: [unknown, Response]) =>
                        response.status === 201
                )
                .catch(() => false),
        apiResourceState
    ];
}
