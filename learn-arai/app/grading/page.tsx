'use client';

import {
    MdGrading,
    MdKeyboardArrowRight,
    MdOutlineCommentBank,
} from 'react-icons/md';
import { SlQuestion } from 'react-icons/sl';

import NavBar from './nav';

export default function Page() {
    return (
        <>
            <div className="flex h-screen flex-col">
                <NavBar />
                <div className="flex flex-grow justify-between bg-gray-100">
                    <div className="flex h-full items-center justify-center">
                        <h1 className="text-2xl">Grading Page</h1>
                    </div>
                    <div className="flex">
                        <div className="flex flex-col justify-between border shadow-lg">
                            <div className="ml-2 mr-2 mt-4 flex flex-col gap-4">
                                <button className="flex  h-[50px] w-[50px] items-center justify-center rounded-full text-2xl hover:bg-gray-200">
                                    <MdGrading />
                                </button>
                                <button className="flex  h-[50px] w-[50px] items-center justify-center rounded-full text-2xl hover:bg-gray-200">
                                    <MdOutlineCommentBank />
                                </button>
                            </div>
                            <div className="ml-2 mr-2 mt-4 flex flex-col gap-4">
                                <button className="flex  h-[50px] w-[50px] items-center justify-center rounded-full text-2xl hover:bg-gray-200">
                                    <SlQuestion />
                                </button>
                                <button className="flex  h-[50px] w-[50px] items-center justify-center rounded-full text-2xl hover:bg-gray-200">
                                    <MdKeyboardArrowRight />
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="border-b border-gray-300">
                                <h2>Files</h2>
                                <p>day details Turned in on Mar 23,11:46 Pm</p>
                                <div>Display file here</div>
                            </div>
                            <div className=""></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
