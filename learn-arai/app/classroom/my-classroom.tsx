'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useClassroom } from '@/components/hooks/useClassroom';
import type { Classroom } from '@/components/hooks/useClassroom';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyClassroom() {
    const { useGetMyClassroom } = useClassroom();
    const { data, isLoading } = useGetMyClassroom();

    return (
        <>
            <div className="flex flex-wrap p-6 gap-4">
                {isLoading &&
                    [1, 2, 3, 4].map((i) => <ClassroomCard key={i} loading />)}

                {data?.status === 'success' &&
                    data.data.map((cl) => (
                        <ClassroomCard
                            data={cl}
                            key={cl.slug}
                            loading={false}
                        />
                    ))}
            </div>
        </>
    );
}

interface ClassroomCardProps {
    data?: Classroom;
    loading: boolean;
}

function ClassroomCard(props: ClassroomCardProps) {
    if (props.loading || !props.data) {
        return (
            <>
                <Card className="w-[300px] h-[350px] overflow-clip hover:shadow-lg transition-all flex flex-col">
                    <CardHeader className="p-0 w-full relative bg-black/50">
                        <Skeleton className="rounded-none object-cover aspect-[3/1] opacity-85" />

                        <div className="absolute text-primary-foreground p-4 max-w-[300px]">
                            <h2 className="font-semibold text-xl leading-none truncate">
                                <Skeleton className="w-[120px] h-[22px] rounded" />
                            </h2>
                            <div className="leading-none pt-2 text-sm">
                                <Skeleton className="w-[70px] h-[16px] rounded" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 w-full flex-grow">
                        <Skeleton className="w-full h-full" />
                    </CardContent>
                    <Separator />
                    <CardFooter className="p-4">
                        <p>Card Footer</p>
                    </CardFooter>
                </Card>
            </>
        );
    }

    const { slug, name, description } = props.data;
    const link = `/classroom/${slug}`;

    return (
        <>
            <Link href={link}>
                <Card className="w-[300px] h-[350px] overflow-clip hover:shadow-lg transition-all flex flex-col">
                    <CardHeader className="p-0 w-full relative bg-black">
                        <Image
                            src="/login/teaching.jpeg"
                            alt="Classroom thumbnail"
                            width="300"
                            height="100"
                            className="object-cover aspect-[3/1] opacity-65"
                        />
                        <div className="absolute text-primary-foreground p-4 max-w-[300px] hover:underline">
                            <h2 className="font-semibold text-xl leading-none truncate">
                                {name}
                            </h2>
                            <p className="leading-none pt-2 text-sm">
                                {description}
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 flex-grow">
                        <p>Card Content</p>
                    </CardContent>
                    <Separator />
                    <CardFooter className="p-4">
                        <p>Card Footer</p>
                    </CardFooter>
                </Card>
            </Link>
        </>
    );
}
