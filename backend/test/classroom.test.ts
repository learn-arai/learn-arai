import { describe, expect, test } from 'bun:test';

import { signIn } from './auth.test';

const apiURL = process.env.API_URL;

describe('Classroom System', () => {
    let classroomSlug;

    test('Create', async () => {
        const { cookie } = await signIn('johndoe@gmail.com', 'aA112233');
        const thumbnail = await Bun.file(
            'test/assets/thumbnail.jpg',
        ).arrayBuffer();

        const body = new FormData();
        body.append('name', 'Algorithm 2566/2 (Test)');
        body.append('description', '');
        body.append('thumbnail', new Blob([thumbnail]));

        const response = await fetch(`${apiURL}/c/create`, {
            method: 'POST',
            headers: {
                cookie: cookie,
            },
            body,
        });
        const json = await response.json();

        expect(json).toMatchObject({
            status: 'success',
        });
        expect(json.data).toContainKeys(['classroom', 'thumbnail']);
        expect(json.data.classroom).toContainKeys([
            'createdat',
            'createdby',
            'description',
            'name',
            'slug',
        ]);

        classroomSlug = json.data.classroom.slug;
    });
});
