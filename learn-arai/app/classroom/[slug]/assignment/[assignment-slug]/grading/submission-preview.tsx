'use client';

import PDFViewer from "@/components/ui/pdf-viewer";
import { useEffect, useState } from "react";
import { useClassroomAssignment } from "@/components/hooks/useClassroomAssignment";

interface SubmissionFile {
    file_id: string;
    // Add other properties if there are more
}

export default function SubmissionPreview(props: {
    userId: string,
    classroomSlug: string,
    assignmentSlug: string,
}) {
    const { classroomSlug, userId, assignmentSlug } = props;
    const { getSubmissionFile } = useClassroomAssignment(classroomSlug);
    const [fileId, setFileId] = useState<SubmissionFile[]>([]); // Empty array of SubmissionFile objects

    useEffect(() => {
        const fetchData = async () => {
            const file = await getSubmissionFile(userId, assignmentSlug);
            setFileId(file.data);
        };
        fetchData();
    }, [userId]);

    const FileId = fileId.length > 0 ? fileId[0].file_id :'';
    console.log(FileId);
    return <>
        <PDFViewer
            url={`${process.env.NEXT_PUBLIC_BACKEND_URL}/file/${FileId}.pdf`}
        />
    </>
}
