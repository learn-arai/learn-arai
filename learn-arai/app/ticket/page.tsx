import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Page() {
    return (
        <>
            <div className="p-16">
                <form className="max-w-lg grid items-start gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input type="title" id="title" defaultValue="..." />
                    </div>
                </form>
            </div>
        </>
    );
}
