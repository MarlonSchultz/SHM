import { getData, postData } from './http';

export function addStakeholder(stakeholder: DraftStakeholder): Promise<boolean> {
    return postData(`/project/${stakeholder.projectId}/stakeholder`, stakeholder)
    .then((response: Response): boolean => response.status === 201);
}

export interface DraftStakeholder {
    projectId: number;
    name: string;
    company?: string;
    role?: string;
    attitude?: string;
}

export interface Stakeholder extends DraftStakeholder {
    id: number;
}
