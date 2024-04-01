'use client';

import { useEffect } from "react";
import { useClassroomAssignment } from "@/components/hooks/useClassroomAssignment";
import { get } from "http";
export default function SubmissionPreview(props: {
    userId: string ,
    classroomSlug: string,
    assignmentSlug: string,
}) {
    const { classroomSlug,userId,assignmentSlug } = props;
    const { getSubmissionFile } = useClassroomAssignment(classroomSlug);
    
    useEffect(() => {
        getSubmissionFile(userId,assignmentSlug);
    }, [userId]);

    return <>
        <p>
            {userId}
        </p>
        <p>
            display user's file here
        </p>
    </>
}