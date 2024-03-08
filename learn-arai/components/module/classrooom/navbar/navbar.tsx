'use client';

import { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';

import JoinClassroom from '../join-classroom/join-classroom';

import CreateClassroom from '@/components/module/classrooom/create-classroom/create-classroom';

import './navbar.css';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const clickHandle = () => {
        window.addEventListener('click', function (e) {
            if (
                !this.document
                    .getElementById('drop-down')
                    ?.contains(e.target as Node)
            ) {
                setIsMenuOpen(false);
            } else {
                setIsMenuOpen(!isMenuOpen);
            }
        });
    };

    return (
        <>
            <nav className="flex items-center shadow p-3 px-6">
                {/* <CreateClassroom /> */}
                <div id="drop-down" className="drop-down mx-auto mr-0">
                    <button
                        className="drop-down-btn hover:bg-muted mx-auto mr-0 p-3 rounded-full"
                        onClick={clickHandle}
                    >
                        <FaPlus />
                    </button>

                    <div
                        className={`drop-down-menu ${isMenuOpen ? 'block' : 'hidden'}`}
                    >
                        <CreateClassroom />
                        <br />
                        <JoinClassroom />
                    </div>
                </div>
            </nav>
        </>
    );
}
