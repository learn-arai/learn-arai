import ClassroomDetail from './classroom-detail';
import ClassroomGeneral from './classroom-general';

export default function Page() {
    return (
        <div className="py-12 space-y-8">
            <ClassroomDetail />

            <ClassroomGeneral />
        </div>
    );
}
