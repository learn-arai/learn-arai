import { useQuery } from 'react-query';

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

    const getAssignmentList = async (): Promise<getAssignmentListResult> => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${classroomSlug}/a/list`,
            {
                credentials: 'include',
            }
        );

        const data = await response.json();
        return data;
    };

    const useGetAssignmentList = (options = {}) => {
        return useQuery(
            ['get-assignment-list', classroomSlug],
            () => getAssignmentList(),
            options
        );
    };

    const getAssignmentDetail = async (
        assignmentSlug: string
    ): Promise<getAssignmentDetailResult> => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${classroomSlug}/a/${assignmentSlug}/detail`,
            {
                credentials: 'include',
            }
        );

        const data = await response.json();
        return data;
    };

    const useGetAssignmentDetail = (assignmentSlug: string, options = {}) => {
        return useQuery(
            ['get-assignment-detail', classroomSlug, assignmentSlug],
            () => getAssignmentDetail(assignmentSlug),
            options
        );
    };

    const attachFile = async (
        state: attachFileResult,
        formData: FormData
    ): Promise<attachFileResult> => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${classroomSlug}/a/${state.assignmentSlug}/attach`,
            {
                method: 'POST',
                body: formData,
                credentials: 'include',
            }
        );

        const data = await response.json();
        return data;
    };

    return {
        createAssignment,
        getAssignmentList,
        useGetAssignmentList,
        getAssignmentDetail,
        useGetAssignmentDetail,
        attachFile,
    };
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

type getAssignmentListResult =
    | {
          status: 'success';
          data: Assignment[];
      }
    | {
          status: 'error';
          message: string;
      };

type getAssignmentDetailResult =
    | {
          status: 'success';
          data: Assignment;
      }
    | {
          status: 'error';
          message: string;
      };

type attachFileResult =
    | {
          status: 'success';
          assignmentSlug: string;
      }
    | {
          status: 'error';
          assignmentSlug: string;
          message: string;
      }
    | {
          status: 'idle';
          assignmentSlug: string;
      };

export interface Assignment {
    slug: string;
    title: string;
    due_date: string;
    description: string;
    max_score: string;
}
