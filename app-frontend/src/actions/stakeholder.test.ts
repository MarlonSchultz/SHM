import * as http from './http'
import { addStakeholder } from './stakeholder'

jest.mock('./http');

describe('Stakeholder Tests', () => {

    jest.mock('./http');

    it('adds a stakeholder', () => {
        expect.assertions(1);

        const mockedDependency = <jest.Mock>http.postData;
        mockedDependency.mockReturnValueOnce(new Promise((resolve, reject) => {
            resolve({status: 201});
        }));

        addStakeholder({
            projectId: 1,
            name: 'Bernd',
            company: 'Kika',
            role: 'Brot',
            attitude: 'Mist'
        }).then((value) => {
            expect(value).toEqual(true);
        })
    });

});