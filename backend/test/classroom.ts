import { describe, expect, test } from 'bun:test';

import { signIn, userStudent1, userStudent2, userTeacher1 } from './auth';

const apiURL = process.env.API_URL;

export let classroomData = {
    classroomSlug: '',
    inviteCode: '',
    defaultGroupSlug: '',
    groupSlug: '',
    inviteCodeGroup: '',
};

export default function runTest() {
    describe('Classroom System', () => {
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
            body.append('thumbnail', new File([thumbnail], 'thumbnail.jpg'));

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

            classroomData.classroomSlug = json.data.classroom.slug;
            console.log('Classroom slug:', classroomData.classroomSlug);
        });

        test('Create invite code #1 (Default Group)', async () => {
            const { cookie } = await signIn(
                userTeacher1.email,
                userTeacher1.password,
            );

            const body = new FormData();
            body.append('group_slug', JSON.stringify([]));

            const response = await fetch(
                `${apiURL}/c/${classroomData.classroomSlug}/create-invite-code`,
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

            classroomData.inviteCode = json.invite_code;
            console.log('Invite code:', classroomData.inviteCode);
        });

        test('Join classroom #1 (Default Group)', async () => {
            const { cookie } = await signIn(
                userStudent1.email,
                userStudent1.password,
            );

            const body = new FormData();
            body.append('classroom_code', classroomData.inviteCode);

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
                slug: classroomData.classroomSlug,
            });
        });

        test('Create Group', async () => {
            const { cookie } = await signIn(
                userTeacher1.email,
                userTeacher1.password,
            );

            const body = new FormData();
            body.append('title', 'Section 1.');

            const response = await fetch(
                `${apiURL}/c/${classroomData.classroomSlug}/g/create`,
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
            expect(json).toContainKeys(['status', 'message', 'data']);
            expect(json.data).toContainKeys(['slug']);

            classroomData.groupSlug = json.data.slug;
            console.log('Group slug:', classroomData.groupSlug);
        });

        test('Create invite code #2 (Specific Group)', async () => {
            const { cookie } = await signIn(
                userTeacher1.email,
                userTeacher1.password,
            );

            const body = new FormData();
            body.append(
                'group_slug',
                JSON.stringify([classroomData.groupSlug]),
            );

            const response = await fetch(
                `${apiURL}/c/${classroomData.classroomSlug}/create-invite-code`,
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

            classroomData.inviteCodeGroup = json.invite_code;
            console.log(
                'Invite code (Specific Group):',
                classroomData.inviteCodeGroup,
            );
        });

        test('Join classroom #2 (Specific Group)', async () => {
            const { cookie } = await signIn(
                userStudent2.email,
                userStudent2.password,
            );

            const body = new FormData();
            body.append('classroom_code', classroomData.inviteCodeGroup);

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
                slug: classroomData.classroomSlug,
            });
        });

        test('Members list', async () => {
            const { cookie } = await signIn(
                userStudent1.email,
                userStudent1.password,
            );

            const response = await fetch(
                `${apiURL}/c/${classroomData.classroomSlug}/members`,
                {
                    method: 'GET',
                    headers: {
                        cookie: cookie,
                    },
                },
            );
            const json = await response.json();

            expect(json).toMatchObject({
                status: 'success',
            });
            expect(json.data).toContainKeys(['student', 'teacher']);
            expect(json.data.student).toHaveLength(2);
            expect(json.data.teacher).toHaveLength(1);
        });

        test('Groups list', async () => {
            const { cookie } = await signIn(
                userTeacher1.email,
                userTeacher1.password,
            );

            const response = await fetch(
                `${apiURL}/c/${classroomData.classroomSlug}/g/list`,
                {
                    method: 'GET',
                    headers: {
                        cookie: cookie,
                    },
                },
            );
            const json = await response.json();

            expect(json).toMatchObject({
                status: 'success',
            });
            expect(json).toContainKeys(['status', 'data', 'default_group']);
            expect(json.data).toHaveLength(2);
            expect(json.data[0]).toMatchObject({
                slug: json.default_group,
                title: 'General',
            });

            classroomData.defaultGroupSlug = json.default_group;
        });

        test('Groups Member #1 (Default Group)', async () => {
            const { cookie } = await signIn(
                userTeacher1.email,
                userTeacher1.password,
            );

            const response = await fetch(
                `${apiURL}/c/${classroomData.classroomSlug}/g/${classroomData.defaultGroupSlug}/members`,
                {
                    method: 'GET',
                    headers: {
                        cookie: cookie,
                    },
                },
            );
            const json = await response.json();

            expect(json).toMatchObject({
                status: 'success',
            });
            expect(json).toContainKeys(['status', 'data']);
            expect(json.data).toHaveLength(2);
        });

        test('Groups Member #2 (Specific Group)', async () => {
            const { cookie } = await signIn(
                userTeacher1.email,
                userTeacher1.password,
            );

            const response = await fetch(
                `${apiURL}/c/${classroomData.classroomSlug}/g/${classroomData.groupSlug}/members`,
                {
                    method: 'GET',
                    headers: {
                        cookie: cookie,
                    },
                },
            );
            const json = await response.json();

            expect(json).toMatchObject({
                status: 'success',
            });
            expect(json).toContainKeys(['status', 'data']);
            expect(json.data).toHaveLength(1);
            expect(json.data[0]).toMatchObject({
                email: userStudent2.email,
            });
        });
    });
}
