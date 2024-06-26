import { describe, expect, test } from 'bun:test';

import { signIn, userTeacher1 } from './auth';
import { classroomData } from './classroom';

const apiURL = process.env.API_URL;

let graderData = {
    slug: '',
};

export default function runTest() {
    describe('Grader System', () => {
        test('Create', async () => {
            const { cookie } = await signIn(
                userTeacher1.email,
                userTeacher1.password,
            );

            const instructionFile = await Bun.file(
                'test/assets/average_shortest/avg_shortest.pdf',
            ).arrayBuffer();

            const body = new FormData();
            body.append('name', 'Lab1_1');
            body.append(
                'instruction_file',
                new File([instructionFile], 'avg_shortest.pdf', {
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

        test('Get Detail', async () => {
            const { cookie } = await signIn(
                userTeacher1.email,
                userTeacher1.password,
            );

            const response = await fetch(
                `${apiURL}/c/${classroomData.classroomSlug}/gd/${graderData.slug}`,
                {
                    headers: {
                        cookie: cookie,
                    },
                },
            );
            const json = await response.json();

            expect(json).toMatchObject({
                status: 'success',
            });
            expect(json.data).toMatchObject({
                name: 'Lab1_1',
                cpu_limit: '500.000',
                mem_limit: '10.000',
            });
            expect(json.data).toContainKeys([
                'name',
                'cpu_limit',
                'mem_limit',
                'instruction_file',
            ]);
        });

        test('Add test-case #1', async () => {
            const { cookie } = await signIn(
                userTeacher1.email,
                userTeacher1.password,
            );

            const json = await addTestCase(
                cookie,
                'test/assets/average_shortest/1.in',
                'test/assets/average_shortest/1.sol',
                '10',
                classroomData.classroomSlug,
                graderData.slug,
            );

            expect(json).toMatchObject({
                status: 'success',
                message: 'Test case added successfully',
            });
        });

        test('Add test-case #2', async () => {
            const { cookie } = await signIn(
                userTeacher1.email,
                userTeacher1.password,
            );

            const json = await addTestCase(
                cookie,
                'test/assets/average_shortest/2.in',
                'test/assets/average_shortest/2.sol',
                '10',
                classroomData.classroomSlug,
                graderData.slug,
            );

            expect(json).toMatchObject({
                status: 'success',
                message: 'Test case added successfully',
            });
        });
    });
}

async function addTestCase(
    cookie: string,
    input: string,
    output: string,
    score: string,
    classroomSlug: string,
    graderSlug: string,
) {
    const inputFile = await Bun.file(input).arrayBuffer();
    const outputFile = await Bun.file(output).arrayBuffer();

    const body = new FormData();
    body.append('score', score);
    body.append('input', new File([inputFile], '1.in'));
    body.append('output', new File([outputFile], '1.sol'));

    const response = await fetch(
        `${apiURL}/c/${classroomSlug}/gd/${graderSlug}/add-test-case`,
        {
            method: 'POST',
            headers: {
                cookie: cookie,
            },
            body,
        },
    );
    const json = await response.json();
    return json;
}
