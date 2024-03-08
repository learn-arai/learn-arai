'use client';

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

    const createInviteCode = async (formData : FormData) => {
        const response = await fetch( `${process.env.NEXT_PUBLIC_BACKEND_URL}/classroom/create-invite-code` ,{
            method: 'POST',
            body: formData,
            credentials : 'include'
        })

        const data = await response.json();
        return data;
    };

    return { createClassroom, createInviteCode };
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

interface Classroom {
    slug: string;
    name: string;
    description: string;
    createdAt: string;
    createdBy: string;
}
