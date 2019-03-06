import { getData, postData } from './http';

export function addProject(name: string, description?: string): Promise<boolean> {
    return postData('/projects', {
        name,
        description,
    })
    .then((response: Response): boolean => response.status === 201);
}

export function updateProject(id: number, name: string, description?: string): Promise<Project> {
    return postData(`/project/${id}`, {
        name,
        description,
    })
    .then((response: Response) => ({
            id,
            name,
            description,
        }),
    );
}

export function getProjects(): Promise<Project[]> {
    return getData('/projects')
    .then((response: Response) => response.json());
}

export interface Project {
    id?: number;
    name: string;
    description?: string;
}
