import * as http from './http'
import { addStakeholder } from './stakeholder'

jest.mock('./http');

describe('Stakeholder Tests', () => {

    it('adds a stakeholder', (done) => {
        const mockedDependency = <jest.Mock>http.postData;
        mockedDependency.mockReturnValueOnce(Promise.resolve({ status: 201 }));

        addStakeholder({
            projectId: 1,
            name: 'Bernd',
            company: 'Kika',
            role: 'Brot',
            attitude: 'Mist'
        }).then((value) => {
            expect(value).toEqual(true);
            expect(mockedDependency.mock.calls[0][0]).toEqual('/project/1/stakeholder');
            expect(mockedDependency.mock.calls[0][1]).toEqual({
                projectId: 1,
                name: 'Bernd',
                company: 'Kika',
                role: 'Brot',
                attitude: 'Mist'
            })

            mockedDependency.mockReset();
            done();
        });

    });

});