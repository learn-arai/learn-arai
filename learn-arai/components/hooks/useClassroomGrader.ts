import { useQuery } from 'react-query';

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

    const getDetail = async (graderSlug: string): Promise<getDetailResult> => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${classroomSlug}/gd/${graderSlug}`,
            {
                credentials: 'include',
            }
        );

        const data = await response.json();
        return data;
    };

    const useGetDetail = (graderSlug: string, options = {}) => {
        return useQuery(
            ['get-grader-detail', classroomSlug, graderSlug],
            () => getDetail(graderSlug),
            options
        );
    };

    const getGraderList = async (): Promise<getGraderListResult> => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${classroomSlug}/gd/list`,
            {
                credentials: 'include',
            }
        );

        const data = await response.json();
        return data;
    };

    const useGetGraderList = (options = {}) => {
        return useQuery(
            ['get-grader-list', classroomSlug],
            () => getGraderList(),
            options
        );
    };

    const submit = async (graderSlug: string, code: string) => {
        const body = new FormData();
        body.append('source_code', code);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${classroomSlug}/gd/${graderSlug}/submit`,
            {
                method: 'POST',
                body: body,
                credentials: 'include',
            }
        );

        const data = await response.json();
        return data;
    };

    return {
        createGrader,
        useGetDetail,
        getGraderList,
        useGetGraderList,
        submit,
    };
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

type getDetailResult =
    | {
          status: 'success';
          data: GraderDetail;
      }
    | {
          status: 'error';
          message: string;
      };

export interface GraderDetail {
    name: string;
    instruction_file: string;
    cpu_limit: number;
    mem_limit: number;
}

type getGraderListResult =
    | {
          status: 'success';
          data: GraderListItem[];
      }
    | {
          status: 'error';
          message: string;
      };

export interface GraderListItem {
    name: string;
    slug: string;
}
