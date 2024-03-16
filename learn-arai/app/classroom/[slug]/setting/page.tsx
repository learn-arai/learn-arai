import ClassroomDetail from './classroom-detail';
import ClassroomGeneral from './classroom-general';
import DangerZone from './danger-zone';

export default function Page() {
    return (
        <div className="py-12 space-y-8">
            <ClassroomDetail />

            <ClassroomGeneral />

            <DangerZone />
        </div>
    );
}
