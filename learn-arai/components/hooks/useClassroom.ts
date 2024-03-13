'use client';

import { useQuery } from 'react-query';

export const useClassroom = () => {
    const createClassroom = async (
        _: any,
        formData: FormData
    ): Promise<createClassroomResult> => {
        let res;
        try {
            res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/classroom/create`,
                {
                    method: 'POST',
                    body: formData,
                    credentials: 'include',
                }
            );
        } catch (error) {
            return {
                status: 'error',
                message: 'An error occurred while creating the classroom',
            };
        }

        const data = await res.json();
        return data;
    };

    const createInviteCode = async (_: any, formData: FormData) => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/classroom/create-invite-code`,
            {
                method: 'POST',
                body: formData,
                credentials: 'include',
            }
        );

        const data = await response.json();
        return data;
    };

    const joinClass = async (_: any, formData: FormData) => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/classroom/join-classroom`,
            {
                method: 'POST',
                body: formData,
                credentials: 'include',
            }
        );

        const data = await response.json();
        return data;
    };

    const getMyClassroom = async (): Promise<getMyClassroomResult> => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/my-classroom`,
            {
                credentials: 'include',
            }
        );

        const data = await response.json();
        return data;
    };

    return {
        createClassroom,
        createInviteCode,
        joinClass,
        getMyClassroom,
    };
};

export const useGetMyClassroom = () => {
    return useQuery(['get-my-classroom'], () =>
        useClassroom().getMyClassroom()
    );
};

type createClassroomResult =
    | {
          status: 'success';
          data: {
              classroom: Classroom;
              thumbnail: string;
          };
      }
    | {
          status: 'error';
          message: string;
      }
    | {
          status: 'idle';
      };

type getMyClassroomResult =
    | {
          status: 'success';
          data: Classroom[];
      }
    | {
          status: 'error';
          message: string;
      };

interface Classroom {
    slug: string;
    name: string;
    description: string;
    createdAt: string;
    createdBy: string;
}
