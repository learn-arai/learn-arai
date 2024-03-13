import { MdDangerous } from 'react-icons/md';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function DangerZone() {
    return (
        <Card id="danger-zone" className="border-destructive">
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
            <CardContent>
                <div className="flex justify-between items-center">
                    <div>
                        <p>Delete this classroom</p>
                        <p className="text-muted-foreground text-sm">
                            Once you delete a classroom, You will have 30 days
                            to restore it before it is permanently deleted.
                        </p>
                    </div>

                    <Button variant="destructive">Delete this classroom</Button>
                </div>
            </CardContent>
        </Card>
    );
}
