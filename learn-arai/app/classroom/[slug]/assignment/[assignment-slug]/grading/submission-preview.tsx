'use client';

import { useEffect, useState } from 'react';

import { useClassroomAssignment } from '@/components/hooks/useClassroomAssignment';
import PDFViewer from '@/components/ui/pdf-viewer';


export default function SubmissionPreview(props: {
    file_id: string;
}) {


    return (
        <> 
            <PDFViewer
                url={`${process.env.NEXT_PUBLIC_BACKEND_URL}/file/${props.file_id}.pdf`}
            />
        </>
    );
}
