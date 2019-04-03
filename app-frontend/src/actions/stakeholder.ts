import { getData, postData } from './http';

export function addStakeholder(stakeholder: DraftStakeholder): Promise<boolean> {
    return postData(`/project/${stakeholder.projectId}/stakeholder`, stakeholder)
    .then((response: Response): boolean => response.status === 201);
}

export function updateStakeholder(stakeholder: Stakeholder): Promise<boolean> {
    return postData(`/project/${stakeholder.projectId}/stakeholder/${stakeholder.id}`, stakeholder)
        .then((response: Response): boolean => response.status === 201);

}

export function getStakeholders(projectId: number): Promise<Stakeholder[]> {
    return getData(`/project/${projectId}/stakeholder`)
        .then((response: Response) => response.json());
}

export interface DraftStakeholder {
    projectId: number;
    name: string;
    company?: string;
    role?: string;
    attitude?: string;
    archived?: boolean;
}

export interface Stakeholder extends DraftStakeholder {
    id: number;
}
