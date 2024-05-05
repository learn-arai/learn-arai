import { Settings } from 'lucide-react';

import CreateInvite from '@/components/module/classroom/create-invite-code/create-invite-code';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import GroupSection from './group-section';

export default function ClassroomGeneral(props: { classroomSlug: string }) {
    const { classroomSlug } = props;

    return (
        <Card id="classroom-general">
            <CardHeader>
                <CardTitle className="relative flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    General
                    <div className="absolute right-0">
                        <CreateInvite classroomSlug={classroomSlug} />
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
                <div className="px-6 pb-4">
                    <h3 className="pb-2 text-lg font-medium">Invite Code</h3>
                    <p>...</p>
                </div>

                <Separator className="mx-auto w-[98%]" />

                <GroupSection />
            </CardContent>
        </Card>
    );
}
