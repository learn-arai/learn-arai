import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

import { Button } from '@/components/ui/button';

export default function NavBar() {
    return (
        <>
            <div className="flex flex-col border-b p-4 shadow-lg">
                <div className="flex justify-between">
                    <div className="mb-4">
                        <h2 className="text-2xl">Assignment name</h2>
                    </div>
                    <div className="mb-4 flex h-[50px] w-[50px] items-center justify-center rounded-full border-4">
                        <h2 className="">Icon</h2>
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className="flex items-center">
                        <div>Dropdown Here</div>
                        <div className="flex ">
                            <button className="flex h-[40px] w-[40px] items-center justify-center rounded-full text-4xl hover:bg-gray-200">
                                <MdKeyboardArrowLeft />
                            </button>
                            <button className="flex h-[40px] w-[40px] items-center justify-center rounded-full text-4xl hover:bg-gray-200">
                                <MdKeyboardArrowRight />
                            </button>
                        </div>
                    </div>
                    <div>
                        <Button variant="success">return</Button>
                    </div>
                </div>
            </div>
        </>
    );
}
