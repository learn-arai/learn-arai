import { FaPlus } from 'react-icons/fa6';

export default function Navbar() {
    return (
        <>
            <nav className="flex items-center shadow p-3 px-6">
                <button className="hover:bg-muted mx-auto mr-0 p-3 rounded-full">
                    <FaPlus className="" />
                </button>
            </nav>
        </>
    );
}
