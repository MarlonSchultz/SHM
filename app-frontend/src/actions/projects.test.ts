import * as http from './http';
import { getProjects, addProject, updateProject, DraftProject, Project } from './projects';

jest.mock('./http');

describe('Project Tests', () => {
    it('returns a list of projects', (done) => {
        const mockSuccessResponse = [
            {
                id: 1,
                name: 'Eins',
                description: 'Das Erste',
            },
            {
                id: 2,
                name: 'Zwei',
                description: 'Das Zweite',
            },
        ];
        const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
        const mockFetchPromise = Promise.resolve({
            // 3
            json: () => mockJsonPromise,
        });

        const mockedDependency = http.getData as jest.Mock;
        mockedDependency.mockReturnValueOnce(mockFetchPromise);

        return getProjects().then((data) => {
            expect(data).toHaveLength(2);
            expect(data[0].id).toBe(1);
            expect(data[0].name).toBe('Eins');

            mockedDependency.mockReset();
            done();
        });
    });

    it('adds a project', (done) => {
        const mockedDependency = http.postData as jest.Mock;
        mockedDependency.mockReturnValueOnce(Promise.resolve({ status: 201 }));

        const input: DraftProject = {
            name: 'Conject',
            description: 'A Project',
        };

        addProject(input).then((value) => {
            expect(value).toBe(true);
            expect(mockedDependency.mock.calls[0][0]).toEqual('/projects');
            expect(mockedDependency.mock.calls[0][1]).toEqual({
                name: 'Conject',
                description: 'A Project',
            });

            mockedDependency.mockReset();
            done();
        });
    });

    it('updates a project', (done) => {
        const mockedDependency = http.postData as jest.Mock;
        mockedDependency.mockReturnValueOnce(Promise.resolve({ status: 201 }));

        const update: Project = {
            id: 1,
            name: 'New Name',
            description: 'New Desc',
        };

        updateProject(update).then((value) => {
            expect(value.id).toEqual(1);
            expect(value.name).toEqual('New Name');
            expect(value.description).toEqual('New Desc');

            expect(mockedDependency.mock.calls[0][0]).toEqual('/project/1');
            expect(mockedDependency.mock.calls[0][1]).toEqual({
                id: 1,
                name: 'New Name',
                description: 'New Desc',
            });

            mockedDependency.mockReset();
            done();
        });
    });
});
