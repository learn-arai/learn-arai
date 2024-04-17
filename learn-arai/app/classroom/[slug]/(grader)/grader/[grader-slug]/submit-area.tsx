'use client';

import { useContext, useEffect, useState } from 'react';
import { FaRegCheckSquare } from 'react-icons/fa';
import { FaTerminal } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import { useQueryClient } from 'react-query';

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
    const queryClient = useQueryClient();

    useEffect(() => {
        let id = undefined;
        if (subId) {
            id = setInterval(async () => {
                await queryClient.invalidateQueries({
                    queryKey: ['get-submission-list', slug, graderSlug],
                });

                const status = await getSubmissionStatus(graderSlug, subId);
                console.log(JSON.stringify(status, null, 2));

                if (status.status === 'error') return props.setSubId(undefined);
                if (status.data.is_completed) return props.setSubId(undefined);
            }, 1000);
        }

        return () => {
            clearInterval(id);
        };
    }, [getSubmissionStatus, graderSlug, props, queryClient, slug, subId]);

    return (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full p-2">
            <Card className="p-1.5 text-sm">
                <div className="flex items-center gap-2">
                    <Button
                        className="flex items-center gap-1 h-7"
                        variant={
                            menuOpened && tab === 'testcase'
                                ? 'default'
                                : 'outline'
                        }
                        size="sm"
                        onClick={() => toggleMenu('testcase')}
                    >
                        <FaRegCheckSquare className="text-success" />
                        Testcase
                    </Button>
                    <Separator orientation="vertical" className="h-5" />

                    <Button
                        className="flex items-center gap-1 h-7"
                        variant={
                            menuOpened && tab === 'test-result'
                                ? 'default'
                                : 'outline'
                        }
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

                <Separator
                    orientation="horizontal"
                    className={cn(
                        'w-full',
                        menuOpened ? 'max-h-none mt-1.5' : 'max-h-0 mt-0'
                    )}
                />

                <div
                    className={cn(
                        'w-full h-[20rem] transition-all overflow-x-hidden overflow-y-scroll duration-200',
                        menuOpened ? 'max-h-[505px]' : 'max-h-0'
                    )}
                >
                    {tab === 'testcase' ? (
                        <div className="p-2">
                            <div className="flex items-center gap-2 pb-2 pt-1">
                                <CaseChip caseId={1} selected noResult />
                                <CaseChip caseId={2} noResult />
                                <CaseChip caseId={3} noResult />
                            </div>

                            <div>
                                <h5 className="">Input</h5>
                                <div className="prose max-w-none pt-1">
                                    <pre>1 2 2 4 1 3 3 1 4 3 0 0</pre>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-2">
                            <h4 className="text-lg text-destructive flex items-center gap-4 pb-2 font-semibold">
                                Wrong Answer
                                <span className="text-sm text-muted-foreground font-normal">
                                    Runtime: 31 ms
                                </span>
                            </h4>
                            <div className="flex items-center gap-2 pb-2">
                                <CaseChip caseId={1} selected correct />
                                <CaseChip caseId={2} />
                                <CaseChip caseId={3} correct />
                            </div>

                            <div>
                                <h5 className="">Input</h5>
                                <div className="prose max-w-none pt-1">
                                    <pre>1 2 2 4 1 3 3 1 4 3 0 0</pre>
                                </div>
                            </div>

                            <div className="pt-4">
                                <h5 className="">Output</h5>
                                <div className="prose max-w-none pt-1">
                                    <pre>1.833</pre>
                                </div>
                            </div>

                            <div className="pt-1">
                                <h5 className="">Expected</h5>
                                <div className="prose max-w-none pt-1">
                                    <pre>1.833</pre>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}

function CaseChip(props: {
    caseId: number;
    selected?: boolean;
    correct?: boolean;
    noResult?: boolean;
}) {
    const { caseId, selected, correct, noResult } = props;

    return (
        <div
            className={cn(
                'border border-border py-1.5 px-4 rounded-lg flex items-center  hover:cursor-pointer text-sm',
                selected
                    ? 'bg-primary border-none text-primary-foreground hover:bg-primary/80'
                    : 'bg-transparent hover:bg-muted'
            )}
        >
            {!noResult && (
                <div
                    className={cn(
                        'w-[5px] h-[5px] rounded-full mr-1.5',
                        correct ? 'bg-success' : 'bg-destructive'
                    )}
                />
            )}
            Case {caseId}
        </div>
    );
}