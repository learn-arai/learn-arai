import CreateClassroom from '@/components/module/classrooom/create-classroom/create-classroom';

export default function Navbar() {
    return (
        <>
            <nav className="flex items-center shadow p-3 px-6">
                <CreateClassroom />
            </nav>
        </>
    );
}
