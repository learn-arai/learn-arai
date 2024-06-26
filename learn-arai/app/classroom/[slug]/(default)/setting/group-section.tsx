'use client';

import { useContext } from 'react';
import { FaLock } from 'react-icons/fa';
import { FaRegClipboard } from 'react-icons/fa';
import { RiLoader5Fill } from 'react-icons/ri';

import { Settings } from 'lucide-react';

import SlugContext from '@/components/context/SlugContext';
import { useClassroom } from '@/components/hooks/useClassroom';
import CreateGroup from '@/components/module/classroom/create-group/create-group';
import DeleteGroup from '@/components/module/classroom/delete-group/delete-group';
import ManageGroupMember from '@/components/module/classroom/manage-group-member/manage-group-member';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import CodeLine from '@/components/ui/code-line';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function GroupSection() {
    const slug = useContext(SlugContext);

    const { useGetGroupList } = useClassroom();
    const { data, isLoading } = useGetGroupList(slug);

    return (
        <div className="px-6 pt-4">
            <h3 className="flex items-center justify-between pb-2 text-lg font-medium">
                Group / Section
                <CreateGroup />
            </h3>

            <Table className="">
                <TableCaption>A list of your group.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Slug</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Students</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && (
                        <TableRow>
                            <TableCell colSpan={3}>
                                <div className="mx-auto flex items-center justify-center gap-2 py-12 text-center text-muted-foreground">
                                    Loading...
                                    <RiLoader5Fill className="animate-spin" />
                                </div>
                            </TableCell>
                        </TableRow>
                    )}

                    {data?.status === 'success' &&
                        data.data.map((g) => (
                            <TableRow key={g.slug}>
                                <TableCell className="w-[1%] whitespace-nowrap font-medium">
                                    <div className="flex items-center gap-1">
                                        <CodeLine
                                            content={g.slug}
                                            className="w-fit font-mono"
                                        />

                                        <Button
                                            variant="none"
                                            size="none"
                                            className="hover:text-primary/75"
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    g.slug
                                                );
                                            }}
                                        >
                                            <FaRegClipboard />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell className="">
                                    <span className="flex items-center gap-2">
                                        {g.title}

                                        {g.slug === data.default_group && (
                                            <FaLock className="text-blue-500" />
                                        )}
                                    </span>
                                </TableCell>
                                <TableCell className="flex -space-x-4">
                                    <Avatar className="border-2 border-primary-foreground">
                                        <AvatarImage src="https://github.com/tonkaew131.png" />
                                        <AvatarFallback>AL</AvatarFallback>
                                    </Avatar>
                                    <Avatar className="border-2 border-primary-foreground">
                                        <AvatarImage src="https://github.com/MonitorIizard.png" />
                                        <AvatarFallback>MM</AvatarFallback>
                                    </Avatar>
                                    <Avatar className="border-2 border-primary-foreground">
                                        <AvatarImage src="https://github.com/Gapraomoosap.png" />
                                        <AvatarFallback>PS</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="w-[1%] whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <ManageGroupMember
                                            groupSlug={g.slug}
                                            defaultGroup={
                                                g.slug === data.default_group
                                            }
                                        />

                                        {g.slug !== data.default_group && (
                                            <>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                >
                                                    <Settings className="h-4 w-4" />
                                                </Button>

                                                <DeleteGroup
                                                    groupSlug={g.slug}
                                                    name={g.title}
                                                />
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
    );
}
