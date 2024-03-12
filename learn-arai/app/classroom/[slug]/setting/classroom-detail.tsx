import { BiRename } from 'react-icons/bi';
import { CgDetailsMore } from 'react-icons/cg';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ClassroomDetail() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Classroom Detail</CardTitle>
                <CardDescription>
                    You can edit the classroom information here
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="grid items-start gap-4 max-w-xl">
                    <FormInput name="name" label="Name">
                        <BiRename />
                    </FormInput>

                    <FormInput name="Description" label="description">
                        <CgDetailsMore />
                    </FormInput>

                    <div className="grid grid-cols-2 gap-2">
                        <Button>Save</Button>
                        <Button variant="outline">Cancel</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
function FormInput({
    name,
    label,
    defaultValue,
    type,
    children,
    placeholder,
}: {
    name: string;
    label: string;
    defaultValue?: string;
    type?: string;
    children?: React.ReactNode;
    placeholder?: string;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={name} className="relative">
                {label}
                <Input
                    type={type || 'text'}
                    id={name}
                    name={name}
                    defaultValue={defaultValue}
                    className={cn(
                        'mt-2',
                        children && 'pl-9',
                        type === 'file' &&
                            'file:bg-primary file:text-primary h-10 py-0 file:h-full pl-0 file:pl-9 file:w-0 file:pr-0 file:mr-2'
                    )}
                    placeholder={placeholder}
                />
                <div
                    className={cn(
                        'absolute bottom-3 mx-3 text-muted-foreground',
                        type === 'file' && 'bg-background'
                    )}
                >
                    {children}
                </div>
            </Label>
        </div>
    );
}
