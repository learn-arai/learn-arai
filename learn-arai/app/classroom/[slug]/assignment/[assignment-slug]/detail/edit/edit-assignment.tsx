import Link from 'next/link';

import { BiRename } from 'react-icons/bi';
import { GrScorecard } from 'react-icons/gr';

import { useClassroomAssignment } from '@/components/hooks/useClassroomAssignment';
import { DatePicker } from '@/components/module/classrooom/create-assignment/date-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function EditAssignment(props: {
    classSlug: string;
    assignmentSlug: string;
}) {
    const { classSlug, assignmentSlug } = props;

    const { useGetAssignmentDetail } = useClassroomAssignment(classSlug);
    const { data, isLoading } = useGetAssignmentDetail(assignmentSlug);

    return (
        <div className="max-w-2xl">
            <form className="grid items-start gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="title" className="relative">
                        Name
                        <Input
                            type="text"
                            key={data?.status}
                            id="title"
                            name="title"
                            className="mt-2 pl-9"
                            defaultValue={
                                data?.status === 'success'
                                    ? data.data.title
                                    : 'Loading...'
                            }
                            disabled={isLoading || data?.status !== 'success'}
                            placeholder="..."
                        />
                        <div className="absolute bottom-3 mx-3 text-muted-foreground">
                            <BiRename />
                        </div>
                    </Label>
                </div>

                <div className="flex gap-2">
                    <Label htmlFor="max_score" className="relative w-[160px]">
                        Score
                        <Input
                            type="number"
                            id="max_score"
                            name="max_score"
                            className="mt-2 pl-9"
                            defaultValue={
                                data?.status === 'success'
                                    ? data.data.max_score
                                    : 100
                            }
                            placeholder="100"
                            disabled={isLoading || data?.status !== 'success'}
                        />
                        <div className="absolute bottom-3 mx-3 text-muted-foreground">
                            <GrScorecard />
                        </div>
                    </Label>

                    <Label htmlFor="due_date" className="relative flex-grow">
                        Due date
                        <DatePicker
                            key={data?.status}
                            disabled={isLoading || data?.status !== 'success'}
                            defaultDate={
                                data?.status === 'success'
                                    ? new Date(data.data.due_date)
                                    : undefined
                            }
                        />
                    </Label>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="description" className="relative">
                        Description
                        <Textarea
                            id="description"
                            name="description"
                            className="mt-2 min-h-[230px]"
                            key={data?.status}
                            defaultValue={
                                data?.status === 'success'
                                    ? data.data.description
                                    : 'Loading...'
                            }
                            disabled={isLoading || data?.status !== 'success'}
                        />
                    </Label>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <Button>Save</Button>
                    <Link
                        className="w-full"
                        href={`/classroom/${classSlug}/assignment/${assignmentSlug}/detail`}
                    >
                        <Button className="w-full" variant="outline">
                            Cancel
                        </Button>
                    </Link>
                </div>
            </form>
        </div>
    );
}
