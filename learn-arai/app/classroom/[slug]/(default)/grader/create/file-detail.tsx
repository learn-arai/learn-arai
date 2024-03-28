import { IoIosCheckmarkCircle } from 'react-icons/io';
import { MdOutlineError } from 'react-icons/md';

import { CornerDownRight } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

export default function FileDetail() {
    return (
        <Card className="font-semibold text-sm">
            <CardContent className="p-3">
                <div className="items-center gap-2 flex">
                    <IoIosCheckmarkCircle className="text-green-500" />
                    PDF Instruction
                </div>

                <div className="pt-1 items-center gap-2 flex">
                    <MdOutlineError className="text-destructive" />
                    Test case #1
                </div>
                <div className="">
                    <div className="pt-1 items-center gap-1 flex">
                        <CornerDownRight className="w-4 h-4 opacity-50 ml-1" />
                        <IoIosCheckmarkCircle className="text-green-500" />
                        1.in
                    </div>
                    <div className="pt-1 items-center gap-1 flex">
                        <CornerDownRight className="w-4 h-4 opacity-50 ml-1" />
                        <MdOutlineError className="text-destructive" />
                        1.sol
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
