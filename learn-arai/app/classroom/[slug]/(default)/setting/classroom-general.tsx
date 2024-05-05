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
                <CardTitle className="flex items-center gap-2 relative">
                    <Settings className="w-5 h-5" />
                    General
                    <div className="absolute right-0">
                        <CreateInvite classroomSlug={classroomSlug} />
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
                <div className="pb-4 px-6">
                    <h3 className="font-medium pb-2 text-lg">Invite Code</h3>
                    <p>...</p>
                </div>

                <Separator className="w-[98%] mx-auto" />

                <GroupSection />
            </CardContent>
        </Card>
    );
}
