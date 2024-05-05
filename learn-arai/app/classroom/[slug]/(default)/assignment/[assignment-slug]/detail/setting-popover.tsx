import Link from 'next/link';

import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaWrench } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

export default function SettingPopover(props: {
    slug: string;
    assignmentSlug: string;
}) {
    const { slug, assignmentSlug } = props;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="none"
                    size="none"
                    className="rounded-full p-3 transition-all hover:bg-muted"
                >
                    <BsThreeDotsVertical className="h-5 w-5" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0">
                <Link
                    href={`/classroom/${slug}/assignment/${assignmentSlug}/detail/edit`}
                >
                    <Button
                        className="w-36 justify-start gap-2"
                        variant="ghost"
                    >
                        <FaWrench />
                        Edit
                    </Button>
                </Link>
            </PopoverContent>
        </Popover>
    );
}
