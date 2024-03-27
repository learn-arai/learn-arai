export const useClassroomGrader = (classroomSlug: string) => {
    const createGrader = async (
        _: any,
        formData: FormData
    ): Promise<createGraderResult> => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${classroomSlug}/gd/create`,
            {
                method: 'POST',
                body: formData,
                credentials: 'include',
            }
        );

        const data = await response.json();
        return data;
    };

    return { createGrader };
};
type createGraderResult =
    | {
          status: 'success';
          data: { slug: string };
          message: string;
      }
    | {
          status: 'error';
          message: string;
      }
    | {
          status: 'idle';
      };
