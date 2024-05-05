'use client';

import Image from 'next/image';
import Link from 'next/link';

import { timeAgo } from '@/lib/utils';

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
            <div className="flex flex-wrap gap-4 p-6">
                {isLoading &&
                    Array.from({ length: 4 }).map((_, i) => (
                        <ClassroomCard key={i} loading />
                    ))}

                {data?.status === 'success' &&
                    data.data.map((cl) => (
                        <ClassroomCard
                            data={cl}
                            key={cl.slug}
                            loading={false}
                        />
                    ))}
            </div>

            {data?.status === 'error' && (
                <p className="flex flex-grow items-center justify-center text-center text-sm text-muted-foreground">
                    {data.message}
                </p>
            )}
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
                <Card className="flex h-[350px] w-[300px] flex-col overflow-clip transition-all hover:shadow-lg">
                    <CardHeader className="relative w-full bg-black/50 p-0">
                        <Skeleton className="aspect-[3/1] rounded-none object-cover opacity-85" />

                        <div className="absolute max-w-[300px] p-4 pt-2 text-primary-foreground">
                            <h2 className="truncate text-xl font-semibold leading-none">
                                <Skeleton className="h-[20px] w-[120px] rounded" />
                            </h2>
                            <div className="pt-[0.5rem] text-sm leading-none">
                                <Skeleton className="h-[15px] w-[30px] rounded" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="w-full flex-grow p-4">
                        <Skeleton className="h-full w-full" />
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
        <div className="relative">
            <Link href={link}>
                <Card className="flex h-[350px] w-[300px] flex-col overflow-clip transition-all hover:shadow-lg">
                    <CardHeader className="group relative w-full space-y-0 bg-black p-0">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${slug}/thumbnail`}
                            alt="Classroom thumbnail"
                            width="300"
                            height="100"
                            className="aspect-[3/1] object-cover opacity-65"
                        />
                        <div className="absolute flex w-full justify-between">
                            <div className="max-w-[300px] p-4 pt-2 text-primary-foreground group-hover:underline">
                                <h2 className="truncate text-xl font-semibold leading-normal">
                                    {name}
                                </h2>
                                <p className="-mt-0.5 text-sm leading-normal">
                                    {description}
                                </p>
                            </div>
                        </div>

                        <p className="absolute bottom-4 left-4 text-sm text-primary-foreground group-hover:underline">
                            สถิตย์ ประสมพันธ์
                        </p>
                    </CardHeader>
                    <CardContent className="flex-grow p-4">
                        <p>Card Content</p>
                    </CardContent>
                    <Separator />
                    <CardFooter className="p-4">
                        <p>Card Footer</p>
                    </CardFooter>
                </Card>
            </Link>
        </div>
    );
}
