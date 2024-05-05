import Navbar from '@/components/module/classroom/navbar/navbar';

import MyClassroom from './my-classroom';

export default function Page() {
    return (
        <>
            <div className="flex h-screen flex-col">
                <Navbar />

                <MyClassroom />
            </div>
        </>
    );
}
