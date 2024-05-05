'use client';

import { useEffect, useState } from 'react';

import { useClassroomAssignment } from '@/components/hooks/useClassroomAssignment';

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

    type ListType = {
        num_assigned: number;
        num_turned_in: number;
        title: string;
        assignment_slug: string;
        max_score: string;
    };

    const { slug, 'assignment-slug': assignmentSlug } = params;
    const { getUserSubmission, getAssignmentList } =
        useClassroomAssignment(slug);
    const [list, setList] = useState<DataType[]>([]);
    const [assignmentList, setAssignmentList] = useState<ListType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const resName = await getUserSubmission(assignmentSlug);
            setList(resName.data);
        };

        const fetchAssignment = async () => {
            const resAssi = await getAssignmentList();
            if (resAssi.status === 'success') {
                // Filter assignments by assignmentSlug
                const formattedAssignmentList: ListType[] = resAssi.data.map(
                    (assi) => ({
                        num_assigned: assi.num_assigned,
                        num_turned_in: assi.num_turned_in,
                        title: assi.title,
                        assignment_slug: assi.slug,
                        max_score: assi.max_score,
                    })
                );
                const result: ListType[] = formattedAssignmentList.filter(
                    (item) => item.assignment_slug === assignmentSlug
                );
                setAssignmentList(result);
            } else {
                console.error('Error fetching assignment list');
            }
        };

        fetchAssignment();
        fetchData();
    }, [assignmentSlug, getAssignmentList, getUserSubmission]);

    // Access the title of the first item in assignmentList or use a default value if assignmentList is empty
    const assignmentTitle =
        assignmentList.length > 0 ? assignmentList[0].title : 'No Title';
    const assignmentTurnedIn =
        assignmentList.length > 0 ? assignmentList[0].num_turned_in : '-';
    const assignmentAssign =
        assignmentList.length > 0 ? assignmentList[0].num_assigned : '-';
    const assignmentMaxscore =
        assignmentList.length > 0 ? assignmentList[0].max_score : '-';

    return (
        <>
            <div className="mt-4 flex flex-col">
                <h1 className="font-normal">{assignmentTitle}</h1>
                <div className="flex">
                    <div className="turn-in flex flex-col border-r p-4">
                        <p className="text-center text-2xl font-bold">
                            {assignmentTurnedIn}
                        </p>
                        <p>Turned in</p>
                    </div>
                    <div className="assi flex flex-col p-4">
                        <p className="text-center text-2xl font-bold">
                            {assignmentAssign}
                        </p>
                        <p>Assigned</p>
                    </div>
                </div>
                <div className="mt-4 flex flex-col">
                    <div className="mb-4 flex justify-between">
                        <p className="text-xl opacity-70">Name</p>
                        <p className="text-xl opacity-70">
                            score({assignmentMaxscore})
                        </p>
                    </div>
                    {list.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between border-b pb-2"
                        >
                            <div className="flex">
                                <p className="pr-4 text-2xl">
                                    {item.first_name}
                                </p>
                                <p className="pr-4 text-2xl">
                                    {item.last_name}
                                </p>
                            </div>
                            <div>
                                <p className="text-2xl text-green-500">
                                    {item.score === null ? '-' : item.score}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
