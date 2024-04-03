import Link from 'next/link';

import { MdDeleteForever } from 'react-icons/md';

import {
    Attachment,
    useClassroomAssignment,
} from '@/components/hooks/useClassroomAssignment';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AttachmentList(props: {
    classSlug: string;
    assignmentSlug: string;
}) {
    const { classSlug, assignmentSlug } = props;

    const { useGetAttachmentList } = useClassroomAssignment(classSlug);
    const { data, isLoading } = useGetAttachmentList(assignmentSlug);

    return (
        <>
            <div className="grid gap-2 w-full">
                {isLoading && <AttachmentCard />}

                {data?.status === 'success' &&
                    data.data.map((a) => (
                        <AttachmentCard key={a.file_id} data={a} />
                    ))}
            </div>
        </>
    );
}

function AttachmentCard(props: { data?: Attachment }) {
    const { data } = props;

    if (!data) {
        return (
            <Card className="p-0 flex overflow-clip hover:cursor-pointer group relative">
                <Skeleton className="h-full aspect-[4/3] bg-primary/35 rounded-none" />
                <CardContent className="p-4">
                    <div className="font-semibold group-hover:underline">
                        <Skeleton className="h-[18px] w-[85px] bg-primary/35" />
                    </div>
                    <Skeleton className="h-[16px] w-[40px] bg-primary/35 mt-1.5" />
                </CardContent>

                <Button
                    variant="none"
                    size="none"
                    className="p-3 rounded-full hover:bg-muted absolute top-1/2 -translate-y-1/2 right-6 transition-all w-fit"
                    disabled
                >
                    <MdDeleteForever className="h-5 w-5 text-muted-foreground" />
                </Button>
            </Card>
        );
    }

    return (
        <Link
            href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/file/${data.file_id}`}
            target="_blank"
            className="flex w-full"
        >
            <Card className="p-0 flex overflow-clip hover:cursor-pointer group w-full text-sm relative">
                <div className="bg-muted h-full aspect-[4/3]" />
                <CardContent className="p-4">
                    <p className="font-semibold group-hover:underline">
                        {data.name}
                    </p>
                    <p>{data.type}</p>
                </CardContent>

                <Button
                    variant="none"
                    size="none"
                    className="p-3 rounded-full hover:bg-muted absolute top-1/2 -translate-y-1/2 right-6 transition-all w-fit"
                >
                    <MdDeleteForever className="h-5 w-5 text-muted-foreground" />
                </Button>
            </Card>
        </Link>
    );
}
