'use client';

import { useContext, useEffect, useState } from 'react';

import SlugContext from '../context/SlugContext';
import { useClassroom } from '../hooks/useClassroom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export default function MemberList() {
    const { getUsers } = useClassroom();
    const slug = useContext(SlugContext);
    const [teacher, setTeacher] = useState<any[]>([]);
    const [student, setStudent] = useState<any[]>([]);
    const [amount, setAmount] = useState(0);
    const [stdline, setStdLine] = useState('hidden');
    const [tchline, setTchLine] = useState('hidden');

    useEffect(() => {
        getListname();
    });

    async function getListname() {
        const info = await getUsers(slug);
        const teacher_list = info.data.teacher;
        const student_list = info.data.student;
        setTeacher(teacher_list);
        setAmount(student_list.length);
        setStudent(student_list);
        if (student_list.length > 1) setStdLine('');
        if (teacher_list.length > 1) setTchLine('');
    }

    return (
        <div className="flex flex-col gap-2 w-full py-4">
            <h2 className="text-2xl font-bold text-green-500 border-b-2 border-green-500 pb-4 mb-2">
                Teacher
            </h2>

            {teacher.map(function (data) {
                return (
                    <div key={data.id} className="flex flex-col">
                        <div className="flex mb-4 ml-4">
                            <Avatar>
                                <AvatarImage src="https://github.com/MonitorIizard.png" />
                                <AvatarFallback>MM</AvatarFallback>
                            </Avatar>
                            <p className="text-xl flex items-center ml-4">
                                {data.firstName} {data.lastName}
                            </p>
                        </div>
                        <Separator className={tchline} />
                    </div>
                );
            })}

            <div className="flex justify-between border-b-2 border-green-500 pb-4 mb-2 mt-8">
                <h2 className="text-2xl font-bold text-green-500 ">
                    Classmates
                </h2>
                <h2 className="text-2xl font-bold text-green-500 ">{amount}</h2>
            </div>

            {student.map(function (data) {
                return (
                    <div key={data.id} className="flex flex-col ">
                        <div className="flex mb-4 ml-4">
                            <Avatar>
                                <AvatarImage src="https://github.com/MonitorIizard.png" />
                                <AvatarFallback>MM</AvatarFallback>
                            </Avatar>
                            <p className="text-xl flex items-center ml-4 ">
                                {data.firstName} {data.lastName}
                            </p>
                        </div>
                        <Separator className={stdline} />
                    </div>
                );
            })}
        </div>
    );
}
