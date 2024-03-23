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
                className="chip"
                onClick={() => deleteChip(slug)}
            >
                {title}

                {
                    title != 'General' &&
                    <MdCancel />
                }
            </button>
        </li>
    );
}
