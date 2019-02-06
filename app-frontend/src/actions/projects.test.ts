import { getProjects } from "./projects";

it('returns a list of projects', () => {
    let result = getProjects();
    expect(result).toBeTruthy();
});