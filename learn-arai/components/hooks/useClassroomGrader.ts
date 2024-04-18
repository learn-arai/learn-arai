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

    const getSubmissionStatus = async (
        graderSlug: string,
        submissionId: string
    ) => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${classroomSlug}/gd/${graderSlug}/s/${submissionId}/status`,
            {
                credentials: 'include',
            }
        );

        return response.json();
    };

    const useGetSubmissionStatus = (
        graderSlug: string,
        submissionId: string
    ) => {
        return useQuery(
            ['get-submission-status', classroomSlug, graderSlug, submissionId],
            () => getSubmissionStatus(graderSlug, submissionId)
        );
    };

    const getSubmissionList = async (graderSlug: string) => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${classroomSlug}/gd/${graderSlug}/s/list`,
            {
                credentials: 'include',
            }
        );

        return response.json();
    };

    const useGetSubmissionList = (graderSlug: string) => {
        return useQuery(
            ['get-submission-list', classroomSlug, graderSlug],
            () => getSubmissionList(graderSlug)
        );
    };

    const getSubmissionDetail = async (
        graderSlug: string,
        submissionId: string
    ) => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${classroomSlug}/gd/${graderSlug}/s/${submissionId}/detail`,
            {
                credentials: 'include',
            }
        );

        return response.json();
    };

    const useGetSubmissionDetail = (
        graderSlug: string,
        submissionId: string
    ) => {
        return useQuery(
            ['get-submission-detail', classroomSlug, graderSlug, submissionId],
            () => getSubmissionDetail(graderSlug, submissionId)
        );
    };

    const getTestCaseList = async (
        graderSlug: string
    ): Promise<getTestCaseListResult> => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${classroomSlug}/gd/${graderSlug}/tc/list`,
            {
                credentials: 'include',
            }
        );

        return response.json();
    };

    const useGetTestCaseList = (graderSlug: string) => {
        return useQuery(
            ['get-submission-list', classroomSlug, graderSlug],
            () => getTestCaseList(graderSlug)
        );
    };

    return {
        createGrader,
        useGetDetail,
        getGraderList,
        useGetGraderList,
        submit,
        getSubmissionStatus,
        useGetSubmissionStatus,
        getSubmissionList,
        useGetSubmissionList,
        useGetSubmissionDetail,
        useGetTestCaseList,
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

type getTestCaseListResult =
    | {
          status: 'success';
          data: TestCaseListItem[];
      }
    | {
          status: 'error';
          message: string;
      };

export interface TestCaseListItem {
    input: string;
    output: string;
    score: number;
}
