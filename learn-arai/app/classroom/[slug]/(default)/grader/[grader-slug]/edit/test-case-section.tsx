import { Terminal } from 'lucide-react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function TestCaseSection() {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Terminal /> Test-cases
                    </CardTitle>
                    <CardDescription>
                        You can add and manage test-cases here
                    </CardDescription>
                </CardHeader>
                <CardContent className="">
                    <div className="gap-2 max-w-2xl grid grid-cols-2">
                        <Card className="p-2 px-4">a</Card>
                        <Card className="p-2 px-4">a</Card>
                        <Card className="p-2 px-4">a</Card>
                        <Card className="p-2 px-4">a</Card>
                        <Card className="p-2 px-4">a</Card>
                        <Card className="p-2 px-4">a</Card>
                        <Card className="p-2 px-4">a</Card>
                        <Card className="p-2 px-4">a</Card>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
