'use client';

import { SetStateAction, useEffect, useState } from 'react';
import {
    MdGrading,
    MdKeyboardArrowRight,
    MdOutlineCommentBank,
} from 'react-icons/md';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { PiDotsThreeVerticalBold } from 'react-icons/pi';
import { SlQuestion } from 'react-icons/sl';

import { useClassroomAssignment } from '@/components/hooks/useClassroomAssignment';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

import './grading.css';
import SubmissionPreview from './submission-preview';

export default function Page({
    params,
}: {
    params: { slug: string; 'assignment-slug': string };
}) {
    type DataType = { first_name: string; last_name: string; id: string; };
    const [title, setTitle] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [isDisabled, setDisabled] = useState(true);
    const [data, setData] = useState<DataType[]>([]);
    const [selectedItem, setSelectedItem] = useState('');
    const [selectedItemId, setSelectedItemId] = useState('');

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

    const { 'assignment-slug': assignmentSlug, slug } = params;
    const { getUserSubmission } = useClassroomAssignment(slug);
    const { getAssignmentDetail } = useClassroomAssignment(slug);
    useEffect(() => {
        const fetchData = async () => {
            const resName = await getUserSubmission(assignmentSlug);
            const resTitle = await getAssignmentDetail(assignmentSlug);
            setData(resName.data);
            if (resTitle.status !== 'error') {
                setTitle(resTitle.data.title);
            } else {
                console.error(resTitle.message);
            }
        };
        fetchData();
    }, [assignmentSlug]);
    console.log(selectedItem);

    return (
        <>
            <div className="h-screen flex flex-col">
                <div className="flex flex-col p-4 border-b shadow-lg">
                    <div className="flex justify-between">
                        <div className="mb-4">
                            <h2 className="text-2xl">{title}</h2>
                        </div>
                        <div className="mb-4 border-4 rounded-full w-[50px] h-[50px] flex justify-center items-center">
                            <h2 className="">Icon</h2>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex items-center">
                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        {selectedItem || 'Select'}
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {data.map((item, index) => (
                                            <DropdownMenuItem
                                                key={index}
                                                onSelect={() => {
                                                    setSelectedItem(`${item.first_name} ${item.last_name}`);
                                                    setSelectedItemId(item.id);
                                                }}
                                            >
                                                {item.first_name} {item.last_name}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="flex ml-4">
                                <button className="hover:bg-gray-200 h-[40px] w-[40px] text-4xl rounded-full flex justify-center items-center">
                                    <MdKeyboardArrowLeft />
                                </button>
                                <button className="hover:bg-gray-200 h-[40px] w-[40px] text-4xl rounded-full flex justify-center items-center">
                                    <MdKeyboardArrowRight />
                                </button>
                            </div>
                        </div>
                        <div>
                            <Button variant="success">return</Button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-grow">
                    <div className="flex justify-center items-center h-full bg-gray-100 w-4/5">
                        <SubmissionPreview userId={selectedItemId} classroomSlug={slug} assignmentSlug={assignmentSlug} />
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
