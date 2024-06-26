import { MdCancel } from 'react-icons/md';

export default function Chip({
    title,
    slug,
    deleteChip,
}: {
    title: string;
    slug: string;
    deleteChip: (title: string) => void;
}) {
    return (
        <li>
            <button
                type="button"
                className="chip text-sm"
                onClick={() => deleteChip(slug)}
            >
                {title}
                <MdCancel />
            </button>
        </li>
    );
}
