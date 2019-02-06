import { getProjects } from "./projects";

it('returns a list of projects', () => {
    const mockSuccessResponse = [
        {
            'id': 1,
            'name': 'Eins',
            'description': 'Das Erste',
        },
        {
            'id': 2,
            'name': 'Zwei',
            'description': 'Das Zweite',
        },
    ];
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const mockFetchPromise = Promise.resolve({ // 3
      json: () => mockJsonPromise,
    });
    
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise); // 4

    return getProjects().then(data => {
        expect(data).toHaveLength(2);
        expect(data[0].id).toBe(1);
        expect(data[0].name).toBe('Eins');
    });
});