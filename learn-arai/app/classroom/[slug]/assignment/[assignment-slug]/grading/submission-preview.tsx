'use client';

import { useEffect } from 'react';

import { useClassroomAssignment } from '@/components/hooks/useClassroomAssignment';

export default function SubmissionPreview(props: {
    userId: string;
    classroomSlug: string;
    assignmentSlug: string;
}) {
    const { classroomSlug, userId, assignmentSlug } = props;
    const { getSubmissionFile } = useClassroomAssignment(classroomSlug);

    useEffect(() => {
        getSubmissionFile(userId, assignmentSlug);
    }, [userId, assignmentSlug, getSubmissionFile]);

    return (
        <>
            <p>{userId}</p>

            <p>display user&apos;s file here</p>
        </>
    );
}
