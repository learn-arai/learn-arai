'use client';

import { useRef, useState } from 'react';
import { FaXmark } from 'react-icons/fa6';

import { ComboboxDemo } from './combo-box';

type Tag = {
    uuid: string;
    'group-name': string;
};

function Chip({
    label,
    removeHandle,
}: {
    label: string;
    removeHandle: (value: string) => void;
}) {
    return (
        <li className="chip">
            {label}
            <FaXmark color="gray" onClick={() => removeHandle(label)} />
        </li>
    );
}

export default function InputChip() {
    const [tags, setTags] = useState<string[]>([]);
    const chipInput = useRef(null);

    const handle = (e: any) => {
        if (e.key === 'Enter') {
            console.log('handle work!!');
            let tag: string = e.target.value.replace(/\s+/g, ' ');
            if (tag.length > 0 && !tags.includes(tag)) {
                setTags((prev) => {
                    return [...prev, tag];
                });
            }
        }
    };

    const remove = (tag: string) => {
        const index = tags.indexOf(tag); // console.log(index);
        setTags((prev) => {
            console.log(prev);
            return [
                ...prev.slice(0, index),
                ...prev.slice(index + 1, prev.length),
            ];
        });
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        window.location;
        if (document.activeElement == chipInput.current) {
            console.log('now, chip element is focused.');
        }
    };

    return (
        <form onSubmit={(e) => submit(e)}>
            <div className="wrapper">
                <div className="title">
                    <h2>Tags</h2>
                </div>
                <div className="content">
                    <p>Press enter or add a comma after each tag</p>
                    <ul className="tag-table">
                        {tags.map((label, index) => (
                            <Chip
                                key={index}
                                label={label}
                                removeHandle={remove}
                            />
                        ))}
                        <input
                            type="hidden"
                            value={tags.toString()}
                            name="group"
                        />

                        <input ref={chipInput} type="text" onKeyDown={handle} />
                    </ul>
                </div>
            </div>

            <ComboboxDemo />

            <button type="submit">Submit</button>
        </form>
    );
}
