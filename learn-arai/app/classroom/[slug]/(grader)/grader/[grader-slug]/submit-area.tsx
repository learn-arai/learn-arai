'use client';

import { useContext, useEffect, useState } from 'react';
import { FaRegCheckSquare } from 'react-icons/fa';
import { FaTerminal } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';

import { cn } from '@/lib/utils';

import SlugContext from '@/components/context/SlugContext';
import { useClassroomGrader } from '@/components/hooks/useClassroomGrader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type TabType = 'testcase' | 'test-result';

export default function SubmitArea(props: {
    onSubmit: () => void;
    setSubId: (subId: string | undefined) => void;
    subId: string | undefined;
    graderSlug: string;
}) {
    const { subId, graderSlug } = props;

    const slug = useContext(SlugContext);
    const [menuOpened, setMenuOpened] = useState(false);
    const [tab, setTab] = useState<TabType>('testcase');

    const toggleMenu = (_tab: TabType) => {
        if (tab === _tab) return setMenuOpened((prev) => !prev);
        if (tab !== _tab) {
            setTab(_tab);
            setMenuOpened(true);
        }
    };

    const { getSubmissionStatus } = useClassroomGrader(slug);

    useEffect(() => {
        let id = undefined;
        if (subId) {
            id = setInterval(async () => {
                const status = await getSubmissionStatus(graderSlug, subId);
                console.log(JSON.stringify(status, null, 2));

                if (status.status === 'error') return props.setSubId(undefined);
                if (status.data.is_completed) return props.setSubId(undefined);
            }, 1000);
        }

        return () => {
            clearInterval(id);
        };
    }, [getSubmissionStatus, graderSlug, props, subId]);

    return (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full p-2">
            <Card className="p-1.5 text-sm">
                <div className="flex items-center gap-2">
                    <Button
                        className="flex items-center gap-1 h-7"
                        variant="outline"
                        size="sm"
                        onClick={() => toggleMenu('testcase')}
                    >
                        <FaRegCheckSquare className="text-success" />
                        Testcase
                    </Button>
                    <Separator orientation="vertical" className="h-5" />

                    <Button
                        className="flex items-center gap-1 h-7"
                        variant="outline"
                        size="sm"
                        onClick={() => toggleMenu('test-result')}
                    >
                        <FaTerminal />
                        Test Result
                    </Button>
                    <Separator orientation="vertical" className="h-5" />

                    <Button
                        className="flex items-center gap-1 h-7 px-1.5"
                        variant="outline"
                        size="sm"
                        onClick={() => setMenuOpened((prev) => !prev)}
                    >
                        <IoIosArrowDown
                            className={cn(
                                'transition-all duration-200',
                                menuOpened ? 'rotate-0' : 'rotate-180'
                            )}
                        />
                    </Button>

                    <Button size="sm" className="h-7 mx-auto mr-0">
                        Run
                    </Button>
                    <Button
                        variant="success"
                        size="sm"
                        className="h-7 mr-0"
                        onClick={() => {
                            setMenuOpened(true);
                            setTab('test-result');
                            props.onSubmit();
                        }}
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

                    {tab === 'testcase' ? <>Ola</> : <>Test Result</>}
                </div>
            </Card>
        </div>
    );
}
