'use client';
import { MdGrading, MdOutlineCommentBank, MdKeyboardArrowRight } from "react-icons/md";
import { SlQuestion } from "react-icons/sl";
import NavBar from "./nav";
export default function Page() {
    return (
        <>
            <div className="h-screen flex flex-col">
                <NavBar />
                <div className="flex flex-grow justify-between bg-gray-100">
                    <div className="flex justify-center items-center h-full">
                        <h1 className="text-2xl">Grading Page</h1>
                    </div>
                    <div className="flex">
                        <div className="flex flex-col justify-between border shadow-lg">
                            <div className="flex flex-col gap-4 mt-4 ml-2 mr-2">
                                <button className="hover:bg-gray-200  w-[50px] h-[50px] text-2xl flex justify-center items-center rounded-full"><MdGrading /></button>
                                <button className="hover:bg-gray-200  w-[50px] h-[50px] text-2xl flex justify-center items-center rounded-full"><MdOutlineCommentBank /></button>
                            </div>
                            <div className="flex flex-col gap-4 mt-4 ml-2 mr-2">
                                <button className="hover:bg-gray-200  w-[50px] h-[50px] text-2xl flex justify-center items-center rounded-full"><SlQuestion /></button>
                                <button className="hover:bg-gray-200  w-[50px] h-[50px] text-2xl flex justify-center items-center rounded-full"><MdKeyboardArrowRight /></button>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="border-b border-gray-300">
                                <h2>Files</h2>
                                <p>day details Turned in on Mar 23,11:46 Pm</p>
                                <div>
                                    Display file here
                                </div>
                            </div>
                            <div className="">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
