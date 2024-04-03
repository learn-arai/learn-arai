'use client';

import { useClassroomAssignment } from "@/components/hooks/useClassroomAssignment";
import { useEffect, useState } from "react";


export default function Page({
    params,
}: {
    params: { slug: string; 'assignment-slug': string };
}) {
    type DataType = {
        first_name: string;
        last_name: string;
        id: string;
        score: string;
    };
    const { slug, 'assignment-slug': assignmentSlug } = params;
    const { getUserSubmission } = useClassroomAssignment(slug);
    const [data, setData] = useState<DataType[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const resName = await getUserSubmission(assignmentSlug);
            setData(resName.data);
        }
        fetchData();
    }, [assignmentSlug])
    console.log('list = ',data);


    return (
        <>

        </>
    );
}
