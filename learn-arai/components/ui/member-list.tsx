'use client'
import { useContext, useEffect, useState } from "react";
import { useClassroom } from "../hooks/useClassroom"
import SlugContext from "../context/SlugContext";

export default function MemberList() {
    const { getUsers } = useClassroom();
    const slug = useContext(SlugContext);
    const [teacher, setTeacher] = useState<any[]>([]);
    const [student, setStudent] = useState<any[]>([]);
    const [amount, setAmount] = useState(0);
    useEffect(() => {
        getListname();
    }, [])

    async function getListname() {
        const info = await getUsers(slug);
        const teacher_list = info.data.teacher;
        const student_list = info.data.student;
        setTeacher(teacher_list);
        setAmount(teacher_list.length)
        setStudent(student_list);

    }

    return (
        <div className="flex flex-col gap-2 w-full">
            <h2 className="text-2xl font-bold text-green-500 border-b-2 border-green-500 pb-4">Teacher</h2>
            {teacher.map(function (data) {
                return (
                    <div key={data.id}>
                        <p className="text-xl">{data.firstName} {data.lastName}</p>
                    </div>
                )
            })}
            <div className="flex justify-between border-b-2 border-green-500 pb-4 mt-8">
                <h2 className="text-2xl font-bold text-green-500 ">Classmates</h2>
                <h2 className="text-2xl font-bold text-green-500 ">{amount}</h2>
            </div>
            {student.map(function (data) {
                return (
                    <div key={data.id}>
                        <p className="text-xl">{data.firstName} {data.lastName}</p>
                    </div>
                )
            })}

        </div>
    )
}
