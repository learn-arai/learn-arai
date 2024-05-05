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
            <div className="grid w-full gap-2">
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
            <Card className="group relative flex overflow-clip p-0 hover:cursor-pointer">
                <Skeleton className="aspect-[4/3] h-full rounded-none bg-primary/35" />
                <CardContent className="p-4">
                    <div className="font-semibold group-hover:underline">
                        <Skeleton className="h-[18px] w-[85px] bg-primary/35" />
                    </div>
                    <Skeleton className="mt-1.5 h-[16px] w-[40px] bg-primary/35" />
                </CardContent>

                <Button
                    variant="none"
                    size="none"
                    className="absolute right-6 top-1/2 w-fit -translate-y-1/2 rounded-full p-3 transition-all hover:bg-muted"
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
            <Card className="group relative flex w-full overflow-clip p-0 text-sm hover:cursor-pointer">
                <div className="aspect-[4/3] h-full bg-muted" />
                <CardContent className="p-4">
                    <p className="font-semibold group-hover:underline">
                        {data.name}
                    </p>
                    <p>{data.type}</p>
                </CardContent>

                <Button
                    variant="none"
                    size="none"
                    className="absolute right-6 top-1/2 w-fit -translate-y-1/2 rounded-full p-3 transition-all hover:bg-muted"
                >
                    <MdDeleteForever className="h-5 w-5 text-muted-foreground" />
                </Button>
            </Card>
        </Link>
    );
}
