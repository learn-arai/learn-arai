'use client';

import { useState } from 'react';
import { FaRegCheckSquare } from 'react-icons/fa';
import { FaTerminal } from 'react-icons/fa';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function SubmitArea(props: {
    setIsSubmit: (isSubmit: boolean) => void;
}) {
    const [menuOpened, setMenuOpened] = useState(false);

    const toggleMenu = () => {
        setMenuOpened((prev) => !prev);
    };

    return (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full p-2">
            <Card className="p-1.5 text-sm">
                <div className="flex items-center gap-2">
                    <Button
                        className="flex items-center gap-1 h-7"
                        variant="outline"
                        size="sm"
                        onClick={toggleMenu}
                    >
                        <FaRegCheckSquare className="text-success" />
                        Testcase
                    </Button>
                    <Separator orientation="vertical" className="h-5" />

                    <Button
                        className="flex items-center gap-1 h-7"
                        variant="outline"
                        size="sm"
                        onClick={toggleMenu}
                    >
                        <FaTerminal />
                        Test Result
                    </Button>

                    <Button size="sm" className="h-7 mx-auto mr-0">
                        Run
                    </Button>
                    <Button
                        variant="success"
                        size="sm"
                        className="h-7 mr-0"
                        onClick={() => props.setIsSubmit(true)}
                    >
                        Submit
                    </Button>
                </div>

                <div
                    className={cn(
                        'w-full h-[20rem] transition-all overflow-hidden duration-200',
                        menuOpened ? 'max-h-[512px]' : 'max-h-0'
                    )}
                >
                    <Separator
                        orientation="horizontal"
                        className="w-full mt-1.5"
                    />
                    Ola
                </div>
            </Card>
        </div>
    );
}
