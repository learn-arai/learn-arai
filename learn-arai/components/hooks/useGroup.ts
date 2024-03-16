import { useContext } from 'react';

import SlugContext from '../context/SlugContext';

export function useGroup() {
    const slug = useContext(SlugContext);

    const createNewGroup = async (formData: FormData) => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${slug}/g/create`,
            {
                method: 'POST',
                credentials: 'include',
                body: formData,
            }
        );

        const data = await response.json();
        return data;
    };

    return { createNewGroup };
}
