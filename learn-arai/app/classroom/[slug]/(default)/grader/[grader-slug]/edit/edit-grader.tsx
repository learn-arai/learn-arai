import Link from 'next/link';

import { BiRename } from 'react-icons/bi';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function EditGrader(props: {
    classroomSlug: string;
    graderSlug: string;
}) {
    const { classroomSlug, graderSlug } = props;

    return (
        <div className="max-w-2xl">
            <form className="grid items-start gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="title" className="relative">
                        Name
                        <Input
                            type="text"
                            id="title"
                            name="title"
                            className="mt-2 pl-9"
                            placeholder="..."
                        />
                        <div className="absolute bottom-3 mx-3 text-muted-foreground">
                            <BiRename />
                        </div>
                    </Label>
                </div>

                <div>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            type="submit"
                            className="flex gap-1 items-center"
                        >
                            Save
                        </Button>
                        <Link
                            className="w-full"
                            href={`/classroom/${classroomSlug}/assignment/${graderSlug}`}
                        >
                            <Button className="w-full" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                    <p className="pt-1 text-xs text-destructive text-left font-medium">
                        {/* {state.status === 'error' && state.message} */}
                    </p>
                </div>
            </form>
        </div>
    );
}
