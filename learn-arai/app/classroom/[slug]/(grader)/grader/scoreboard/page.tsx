import { ListOrdered } from 'lucide-react';

import { Card } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function Page() {
    return (
        <>
            <div className="relative h-full bg-muted p-4">
                <Card className="h-full">
                    <Table>
                        <TableHeader>
                            <TableRow className="*:p-2">
                                <TableHead className="w-0 border-r">
                                    <ListOrdered className="h-4 w-4" />
                                </TableHead>
                                <TableHead className="border-r">Name</TableHead>
                                <TableHead>Score</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="border-b odd:bg-red-500">
                            <TableRow className="*:p-2 odd:bg-green-500/5">
                                <TableCell className="w-0 last:border-r-0 border-r text-center">
                                    1.
                                </TableCell>
                                <TableCell className="last:border-r-0 border-r">x</TableCell>
                                <TableCell className="last:border-r-0 border-r">x</TableCell>
                            </TableRow>
                            <TableRow className="*:p-2 odd:bg-green-500/5">
                                <TableCell className="w-0 last:border-r-0 border-r text-center">
                                    2.
                                </TableCell>
                                <TableCell className="last:border-r-0 border-r">x</TableCell>
                                <TableCell className="last:border-r-0 border-r">x</TableCell>
                            </TableRow>
                            <TableRow className="*:p-2 odd:bg-green-500/5">
                                <TableCell className="w-0 last:border-r-0 border-r text-center">
                                    3.
                                </TableCell>
                                <TableCell className="last:border-r-0 border-r">x</TableCell>
                                <TableCell className="last:border-r-0 border-r">x</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </>
    );
}
