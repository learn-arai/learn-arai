'use client';

import Link from 'next/link';

import { useContext } from 'react';

import SlugContext from '@/components/context/SlugContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProblemList() {
    const slug = useContext(SlugContext);

    return (
        <>
            <div className="py-6 space-y-3">
                {Array.from({ length: 10 }).map((_, i) => (
                    <Card key={i} className="hover:bg-muted/50 transition-all">
                        <Link href={`/classroom/${slug}/grader/${i}`}>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    LAB2_1
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="prose max-w-none">
                                <table className="w-full text-center table-fixed text-sm">
                                    <thead>
                                        <tr>
                                            <th
                                                rowSpan={2}
                                                className="align-middle bg-[#dff0d8]"
                                            >
                                                Case
                                            </th>
                                            <th
                                                colSpan={3}
                                                className="bg-[#f2dede]"
                                            >
                                                0
                                            </th>
                                            <th
                                                rowSpan={2}
                                                className="align-middle bg-[#d9edf7]"
                                            >
                                                Total
                                            </th>
                                        </tr>
                                        <tr>
                                            <th className="bg-[#fcf8e3]">1</th>
                                            <th className="bg-[#fcf8e3]">2</th>
                                            <th className="bg-[#fcf8e3]">3</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="bg-[#d9edf7] font-semibold">
                                                result
                                            </td>
                                            <td className="bg-[#dff0d8]">K</td>
                                            <td className="bg-[#dff0d8]">K</td>
                                            <td className="bg-[#dff0d8]">K</td>
                                            <td
                                                rowSpan={2}
                                                className="align-middle bg-[#fcf8e3] font-semibold"
                                            >
                                                30
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="bg-[#f2dede] font-semibold">
                                                score
                                            </td>
                                            <td className="bg-[#d9edf7]">10</td>
                                            <td className="bg-[#d9edf7]">10</td>
                                            <td className="bg-[#d9edf7]">10</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </CardContent>
                        </Link>
                    </Card>
                ))}
            </div>
        </>
    );
}
