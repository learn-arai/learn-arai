import { describe, expect, test } from 'bun:test';

import { signIn, userStudent1, userTeacher1 } from './auth.test';

const apiURL = process.env.API_URL;

describe('Classroom System', () => {
    let classroomSlug: string;
    let inviteCode: string;

    test('Create', async () => {
        const { cookie } = await signIn(
            userTeacher1.email,
            userTeacher1.password,
        );

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
        console.log('Classroom slug:', classroomSlug);
    });

    test('Create invite code (Default Group)', async () => {
        const { cookie } = await signIn(
            userTeacher1.email,
            userTeacher1.password,
        );

        const body = new FormData();
        body.append('group_slug', JSON.stringify([]));

        const response = await fetch(
            `${apiURL}/c/${classroomSlug}/create-invite-code`,
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
        });
        expect(json).toContainKeys(['status', 'message', 'invite_code']);

        inviteCode = json.invite_code;
        console.log('Invite code:', inviteCode);
    });

    test('Join classroom', async () => {
        const { cookie } = await signIn(
            userStudent1.email,
            userStudent1.password,
        );

        const body = new FormData();
        body.append('classroom_code', inviteCode);

        const response = await fetch(`${apiURL}/c/join-classroom`, {
            method: 'POST',
            headers: {
                cookie: cookie,
            },
            body,
        });
        const json = await response.json();

        expect(json).toMatchObject({
            status: 'success',
            message: 'You have joined the classroom.',
            slug: classroomSlug,
        });
    });

    test('Members list', async () => {
        const { cookie } = await signIn(
            userStudent1.email,
            userStudent1.password,
        );

        const response = await fetch(`${apiURL}/c/${classroomSlug}/members`, {
            method: 'GET',
            headers: {
                cookie: cookie,
            },
        });
        const json = await response.json();

        expect(json).toMatchObject({
            status: 'success',
        });
        expect(json.data).toContainKeys(['student', 'teacher']);
        expect(json.data.student).toHaveLength(1);
        expect(json.data.teacher).toHaveLength(1);
    });

    test('Groups list', async () => {
        const { cookie } = await signIn(
            userTeacher1.email,
            userTeacher1.password,
        );

        const response = await fetch(`${apiURL}/c/${classroomSlug}/g/list`, {
            method: 'GET',
            headers: {
                cookie: cookie,
            },
        });
        const json = await response.json();

        expect(json).toMatchObject({
            status: 'success',
        });
        expect(json).toContainKeys(['status', 'data', 'default_group']);
        expect(json.data).toHaveLength(1);
        expect(json.data[0]).toMatchObject({
            slug: json.default_group,
            title: 'General',
        });
    });
});
