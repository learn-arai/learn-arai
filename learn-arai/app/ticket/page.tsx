import { LuTicket } from 'react-icons/lu';
import { MdOutlineSupportAgent } from 'react-icons/md';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function Page() {
    return (
        <>
            <div className="px-32 py-12">
                <div className="prose pb-0">
                    <h2 className="flex items-center gap-2">
                        <LuTicket />
                        My Tickets
                    </h2>
                </div>

                <div className="flex gap-6 pb-2 my-6 max-w-full overflow-x-scroll">
                    {[1, 2, 3, 4, 5, 6].map((v) => (
                        <div key={v}>
                            <Card className="w-64">
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Card Title
                                    </CardTitle>
                                    <CardDescription>
                                        Lorem ipsum dolor sit amet consectetur
                                        adipisicing elit. Explicabo cupiditate
                                        sunt quis eius alias! Minus incidunt ex
                                        voluptatem sunt repellat corrupti id
                                        tempora enim cupiditate quam est
                                        assumenda, quibusdam praesentium?
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>Card Content</p>
                                </CardContent>
                                <CardFooter>
                                    <p>Card Footer</p>
                                </CardFooter>
                            </Card>
                        </div>
                    ))}
                </div>

                <div className="prose pb-6">
                    <h2 className="flex items-center gap-2">
                        <MdOutlineSupportAgent />
                        Submit a ticket
                    </h2>
                </div>

                <form className="max-w-lg grid items-start gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input type="text" id="title" name="title" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" />
                    </div>

                    <Button className="w-fit px-12">Submit</Button>
                </form>
            </div>
        </>
    );
}
