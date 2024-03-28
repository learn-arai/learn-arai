'use client';

import { SetStateAction, useState } from 'react';
import {
    MdGrading,
    MdKeyboardArrowRight,
    MdOutlineCommentBank,
} from 'react-icons/md';
import { PiDotsThreeVerticalBold } from 'react-icons/pi';
import { SlQuestion } from 'react-icons/sl';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import './grading.css';
import NavBar from './nav';

export default function Page() {
    // const [inputValue, setInputValue] = useState('');
    // const [isDisabled, setDisabled] = useState(true);
    // const handleInputChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    //     setInputValue(event.target.value);
    // };
    const [inputValue, setInputValue] = useState('');
    const [isDisabled, setDisabled] = useState(true);

    const handleInputChange = (event: {
        target: { value: SetStateAction<string> };
    }) => {
        setInputValue(event.target.value);
        if (event.target.value.length > 0) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    };
    return (
        <>
            <div className="h-screen flex flex-col">
                <NavBar />
                <div className="flex flex-grow">
                    <div className="flex justify-center items-center h-full bg-gray-100 w-4/5">
                        <h1 className="text-2xl">Grading Page</h1>
                    </div>
                    <div className="flex">
                        {/* slid bar */}
                        <div className="flex flex-col justify-between border shadow-lg">
                            <div className="flex flex-col gap-4 mt-4 ml-2 mr-2">
                                <button className="hover:bg-gray-200  w-[50px] h-[50px] text-2xl flex justify-center items-center rounded-full">
                                    <MdGrading />
                                </button>
                                <button className="hover:bg-gray-200  w-[50px] h-[50px] text-2xl flex justify-center items-center rounded-full">
                                    <MdOutlineCommentBank />
                                </button>
                            </div>
                            <div className="flex flex-col gap-4 mt-4 ml-2 mr-2">
                                <button className="hover:bg-gray-200  w-[50px] h-[50px] text-2xl flex justify-center items-center rounded-full">
                                    <SlQuestion />
                                </button>
                                <button className="hover:bg-gray-200  w-[50px] h-[50px] text-2xl flex justify-center items-center rounded-full">
                                    <MdKeyboardArrowRight />
                                </button>
                            </div>
                        </div>

                        {/* Score and comment */}
                        <div className="flex flex-col">
                            <div className="border-b border-gray-300 h-1/5 p-4">
                                <h2>Files</h2>
                                <p>day details Turned in on Mar 23,11:46 Pm</p>
                                <div>Display file here</div>
                            </div>
                            <div className="flex flex-col border-b border-gray-300 p-4 h-1/5">
                                <h2>Grade</h2>
                                <div className="flex items-center mt-4">
                                    <div className="flex border w-fit rounded items-center p-2 ">
                                        <Input
                                            id="grading"
                                            className="grading text-right "
                                        ></Input>
                                        <p className="ml-2">/100</p>
                                    </div>
                                    <div className="w-1/6 ml-2">
                                        <button className="hover:bg-gray-200  w-[40px] h-[40px] text-2xl flex justify-center items-center rounded-full">
                                            <PiDotsThreeVerticalBold />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <h2 className="text-xl font-blod">
                                    private comment
                                </h2>
                                <div>
                                    <p>Peerasin Srisri</p>
                                    <p>Peerasin comment</p>
                                </div>
                                <div className="flex flex-grow mt-4">
                                    <Input
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        placeholder="Add private comment..."
                                        className="text-l"
                                    ></Input>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <Button disabled={isDisabled}>
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
