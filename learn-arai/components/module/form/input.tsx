import { Span } from 'next/dist/trace';

type prop = {
    htmlFor?: string;
    label?: string;
    type: string;
    placeholder?: string;
    name: string;
    children: React.ReactNode;
    isRequied?: boolean;
};

export default function Input({
    label,
    type,
    placeholder,
    name,
    children,
    isRequied,
}: prop) {
    return (
        <div className="w-full">
            <label htmlFor={name}>
                {label}{' '}
                {isRequied ? <span className="text-red-500">*</span> : ' '}
            </label>{' '}
            <br />
            <div className="relative ">
                {children}
                <input
                    type={type}
                    className="w-full"
                    placeholder={placeholder}
                    name={name}
                    required={isRequied}
                />
            </div>
        </div>
    );
}
