import { MdDangerous } from 'react-icons/md';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function DangerZone() {
    return (
        <Card id="classroom-detail">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <MdDangerous className="w-5 h-5" />
                    Danger Zone
                </CardTitle>
                <CardDescription>
                    Be careful when using these settings. They can have a
                    negative impact on your classroom.
                </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
        </Card>
    );
}
