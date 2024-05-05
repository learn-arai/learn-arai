import { createContext } from 'react';

import {
    getClassroomDetailResult,
    useClassroom,
} from '@/components/hooks/useClassroom';

export type ClassroomContextType = {
    slug: string;
    name: string;
    description: string;
    createdAt: string;
    createdBy: {
        firstName: string;
        lastName: string;
        email: string;
    };
    type: 'student' | 'teacher';
    willDeleteIn: Date;
};

export const ClassroomContext = createContext<ClassroomContextType | null>(
    null
);

export const ClassroomProvider = (
    props: React.PropsWithChildren & { slug: string }
) => {
    const { children, slug } = props;

    const { useGetClassroomDetail } = useClassroom();
    const { data } = useGetClassroomDetail(slug);

    if (data?.status === 'error') {
        return (
            <div className="flex min-h-[65vh] flex-col items-center justify-center gap-2 text-muted-foreground">
                <p className="text-6xl font-semibold">Error</p>
                <p>{data.message}</p>
            </div>
        );
    }

    return (
        <ClassroomContext.Provider
            value={convertToClassroomContextType(slug, data)}
        >
            {children}
        </ClassroomContext.Provider>
    );
};

const convertToClassroomContextType = (
    slug: string,
    data: getClassroomDetailResult | null | undefined
) => {
    if (!data) return null;
    if (data.status === 'error') return null;

    return {
        slug,
        name: data.data.name,
        description: data.data.description,
        createdAt: data.data.created_at,
        createdBy: {
            firstName: data.data.created_by.first_name,
            lastName: data.data.created_by.last_name,
            email: data.data.created_by.email,
        },
        willDeleteIn: data.data.will_delete_in,
        type: data.data.type,
    };
};
