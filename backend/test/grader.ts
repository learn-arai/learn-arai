import { describe, expect, test } from 'bun:test';

import { signIn, userTeacher1 } from './auth';
import { classroomData } from './classroom';

const apiURL = process.env.API_URL;

let graderData = {
    slug: '',
};

export default function runTest() {
    describe('Grader System', () => {
        test('Create Grader Problem', async () => {
            const { cookie } = await signIn(
                userTeacher1.email,
                userTeacher1.password,
            );

            const instructionFile = await Bun.file(
                'test/assets/week1_1.pdf',
            ).arrayBuffer();

            const body = new FormData();
            body.append('name', 'Lab1_1');
            body.append(
                'instruction_file',
                new File([instructionFile], 'week1_1.pdf', {
                    type: 'application/pdf',
                }),
            );
            body.append('cpu_limit', '500');
            body.append('mem_limit', '10');

            const response = await fetch(
                `${apiURL}/c/${classroomData.classroomSlug}/gd/create`,
                {
                    method: 'POST',
                    headers: {
                        cookie: cookie,
                    },
                    body,
                },
            );
            const json = await response.json();

            expect(json).toMatchObject({
                status: 'success',
                message: 'Grader Problem created successfully',
            });
            expect(json.data).toContainKeys(['slug']);

            graderData.slug = json.data.slug;
        });
    });
}
