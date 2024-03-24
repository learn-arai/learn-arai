import AssignmentAttachFile from '@/components/module/classroom/assignment-attach-file/assignment-attach-file';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AttachFile(props: {
    assignmentSlug: string;
    classroomSlug: string;
}) {
    const { assignmentSlug, classroomSlug } = props;

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Attach</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <AssignmentAttachFile
                        assignmentSlug={assignmentSlug}
                        classroomSlug={classroomSlug}
                    />
                </CardContent>
            </Card>
        </>
    );
}
