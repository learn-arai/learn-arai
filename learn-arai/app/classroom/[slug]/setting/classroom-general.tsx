import { FaLock } from 'react-icons/fa';

import { Plus, Settings } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CodeLine from '@/components/ui/code-line';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function ClassroomGeneral() {
    return (
        <Card id="classroom-general">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    General
                </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
                <div className="pb-4 px-6">
                    <h3 className="font-medium pb-2 text-lg">Invite Code</h3>
                    ...
                </div>

                <Separator className="w-[98%] mx-auto" />

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
                            <TableRow>
                                <TableCell className="font-medium w-[1%] whitespace-nowrap">
                                    <CodeLine content="xxxxxx" />
                                </TableCell>
                                <TableCell className="">
                                    <span className="flex items-center gap-2">
                                        General
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
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
