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
                    className="transition-all p-3 rounded-full hover:bg-muted"
                >
                    <BsThreeDotsVertical className="w-5 h-5" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-fit">
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
