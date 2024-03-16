export const useClassroomAssignment = (classroomSlug: string) => {
    const createAssignment = async (
        _: any,
        formData: FormData
    ): Promise<createAssignmentResult> => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${classroomSlug}/a/create`,
            {
                method: 'POST',
                body: formData,
                credentials: 'include',
            }
        );

        const data = await response.json();
        return data;
    };

    return { createAssignment };
};

type createAssignmentResult =
    | {
          status: 'success';
          data: {
              slug: string;
          };
      }
    | {
          status: 'error';
          message: string;
      }
    | {
          status: 'idle';
      };
