import { IoIosCheckmarkCircle } from 'react-icons/io';
import { MdOutlineError } from 'react-icons/md';

import { CornerDownRight } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

export default function FileDetail() {
    return (
        <Card className="text-sm font-semibold">
            <CardContent className="p-3">
                <div className="flex items-center gap-2">
                    <IoIosCheckmarkCircle className="text-green-500" />
                    PDF Instruction
                </div>

                <div className="flex items-center gap-2 pt-1">
                    <MdOutlineError className="text-destructive" />
                    Test case #1
                </div>
                <div className="">
                    <div className="flex items-center gap-1 pt-1">
                        <CornerDownRight className="ml-1 h-4 w-4 opacity-50" />
                        <IoIosCheckmarkCircle className="text-green-500" />
                        1.in
                    </div>
                    <div className="flex items-center gap-1 pt-1">
                        <CornerDownRight className="ml-1 h-4 w-4 opacity-50" />
                        <MdOutlineError className="text-destructive" />
                        1.sol
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
