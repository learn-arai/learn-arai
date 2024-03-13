'use client';

import { useContext } from 'react';
import { FaLock } from 'react-icons/fa';

import { Plus, Settings } from 'lucide-react';

import SlugContext from '@/components/context/SlugContext';
import { useClassroom } from '@/components/hooks/useClassroom';
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
    const { data } = useGetGroupList(slug);

    return (
        <div className="pt-4 px-6">
            <h3 className="font-medium pb-2 text-lg flex items-center justify-between">
                Group / Section
                <Button className="flex items-center gap-1" size="sm">
                    Create Group <Plus className="w-4 h-4" />
                </Button>
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
                    {data?.status === 'success' &&
                        data.data.map((g) => (
                            <TableRow key={g.slug}>
                                <TableCell className="font-medium w-[1%] whitespace-nowrap">
                                    <CodeLine content={g.slug} />
                                </TableCell>
                                <TableCell className="">
                                    <span className="flex items-center gap-2">
                                        {g.title}
                                        <FaLock className="text-blue-500" />
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
                                    <Button size="icon" variant="outline">
                                        <Settings className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
    );
}
