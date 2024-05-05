import { RiLoader5Fill } from 'react-icons/ri';

import { Plus, Terminal, Trash2 } from 'lucide-react';

import {
    TestCaseListItem,
    useClassroomGrader,
} from '@/components/hooks/useClassroomGrader';
import AddTestCaseButton from '@/components/module/classroom/grader/add-testcase/add-testcase-button';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTriggerMinimal,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function TestCaseSection(props: {
    classroomSlug: string;
    graderSlug: string;
}) {
    const { classroomSlug, graderSlug } = props;

    const { useGetTestCaseList } = useClassroomGrader(classroomSlug);
    const { data, isLoading } = useGetTestCaseList(graderSlug);

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2">
                            <Terminal className="" /> Test-cases
                        </span>

                        <AddTestCaseButton
                            classroomSlug={classroomSlug}
                            graderSlug={graderSlug}
                        />
                    </CardTitle>
                    <CardDescription>
                        You can add and manage test-cases here
                    </CardDescription>
                </CardHeader>
                <CardContent className="">
                    <div className="grid gap-2">
                        {isLoading && (
                            <div className="mx-auto flex items-center justify-center gap-2 py-12 text-center text-muted-foreground">
                                Loading...
                                <RiLoader5Fill className="animate-spin" />
                            </div>
                        )}

                        {data?.status === 'success' && (
                            <>
                                {data.data.length === 0 && (
                                    <p className="w-full py-12 text-center text-sm text-muted-foreground">
                                        You don&apos;t have any test-cases yet.{' '}
                                        <br />
                                        Click &quot;Add +&quot; to add a new
                                        test-case.
                                    </p>
                                )}

                                <Accordion
                                    type="multiple"
                                    className="space-y-2"
                                >
                                    {data.data.map((tc, idx) => (
                                        <TestCaseCard
                                            idx={idx + 1}
                                            data={tc}
                                            key={idx}
                                        />
                                    ))}
                                </Accordion>
                            </>
                        )}

                        {data?.status === 'error' && (
                            <>
                                <p className="w-full py-16 text-center text-sm text-destructive">
                                    {data?.message}
                                </p>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

function TestCaseCard(props: { idx: number; data: TestCaseListItem }) {
    const { idx, data } = props;

    return (
        <AccordionItem value={`test-case-${idx}`} className="border-b-0">
            <Card className="">
                <div className="relative">
                    <AccordionTriggerMinimal className="flex items-center justify-start p-4">
                        <span>#{idx}</span>
                        <span className="ml-2 font-mono hover:no-underline">
                            ({data.score}{' '}
                            <span className="font-normal text-muted-foreground">
                                score
                            </span>
                            )
                        </span>
                    </AccordionTriggerMinimal>

                    <Button
                        variant="destructive"
                        size="icon-sm"
                        className="absolute right-4 top-1/2 z-50 -translate-y-1/2"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>

                <AccordionContent className="prose grid max-w-none grid-cols-2 gap-2 space-y-0 p-4 pt-0">
                    <pre className="!my-0 w-full whitespace-break-spaces">
                        {data.input}
                    </pre>
                    <pre className="!my-0 w-full whitespace-break-spaces">
                        {data.output}
                    </pre>
                </AccordionContent>
            </Card>
        </AccordionItem>
    );
}
