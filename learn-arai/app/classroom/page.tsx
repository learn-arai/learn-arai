import Navbar from '@/components/module/classroom/navbar/navbar';

import MyClassroom from './my-classroom';

export default function Page() {
    return (
        <>
            <div className="h-screen flex flex-col">
                <Navbar />

                <MyClassroom />
            </div>
        </>
    );
}
