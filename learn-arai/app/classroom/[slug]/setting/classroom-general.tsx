import { Settings } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import GroupSection from './group-section';
import CreateInvite from '@/components/module/classroom/create-invite-code/create-invite-code';

export default function ClassroomGeneral() {
    return (
        <Card id="classroom-general">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    General
                </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
                <div className="pb-4 px-6">
                    <h3 className="font-medium pb-2 text-lg">Invite Code</h3>
                    <div className='max-w-xl'>
                        <CreateInvite />
                    </div>
                </div>

                <Separator className="w-[98%] mx-auto" />

                <GroupSection />
            </CardContent>
        </Card>
    );
}
