import { getData, postData } from './http';

export function addProject(draft: DraftProject): Promise<boolean> {
    return postData('/projects', draft)
    .then((response: Response): boolean => response.status === 201);
}

export function updateProject(update: Project): Promise<Project> {
    return postData(`/project/${update.id}`, update)
    .then((response: Response) => update);
}

export function getProjects(): Promise<Project[]> {
    return getData('/projects')
    .then((response: Response) => response.json());
}

export interface DraftProject {
    name: string;
    description?: string;
}

export interface Project extends DraftProject {
    id: number;
}
