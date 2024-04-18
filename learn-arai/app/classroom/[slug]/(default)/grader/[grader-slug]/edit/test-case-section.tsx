import { RiLoader5Fill } from 'react-icons/ri';

import { Terminal, Trash2 } from 'lucide-react';

import {
    TestCaseListItem,
    useClassroomGrader,
} from '@/components/hooks/useClassroomGrader';
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
                    <CardTitle className="flex items-center gap-2">
                        <Terminal /> Test-cases
                    </CardTitle>
                    <CardDescription>
                        You can add and manage test-cases here
                    </CardDescription>
                </CardHeader>
                <CardContent className="">
                    <div className="gap-2 grid">
                        {isLoading && (
                            <div className="text-center text-muted-foreground flex items-center gap-2 justify-center mx-auto py-12">
                                Loading...
                                <RiLoader5Fill className="animate-spin" />
                            </div>
                        )}

                        {data?.status === 'success' ? (
                            <>
                                {data.data.length === 0 && (
                                    <p className="text-center text-muted-foreground text-sm w-full py-12">
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
                        ) : (
                            <>
                                <p className="text-center text-destructive text-sm w-full py-16">
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
                    <AccordionTriggerMinimal className="p-4 flex justify-start items-center">
                        <span>#{idx}</span>
                        <span className="font-mono ml-2 hover:no-underline">
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
                        className="z-50 absolute top-1/2 -translate-y-1/2 right-4"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>

                <AccordionContent className="p-4 pt-0 grid grid-cols-2 gap-2 prose max-w-none space-y-0">
                    <pre className="!my-0 whitespace-break-spaces w-full">
                        {data.input}
                    </pre>
                    <pre className="!my-0 whitespace-break-spaces w-full">
                        {data.output}
                    </pre>
                </AccordionContent>
            </Card>
        </AccordionItem>
    );
}
