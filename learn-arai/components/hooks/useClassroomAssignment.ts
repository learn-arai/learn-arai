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

    const getAttachmentList = async (
        assignmentSlug: string
    ): Promise<getAttachmentListResult> => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${classroomSlug}/a/${assignmentSlug}/attach`,
            {
                credentials: 'include',
            }
        );

        const data = await response.json();
        return data;
    };

    const useGetAttachmentList = (assignmentSlug: string, options = {}) => {
        return useQuery(
            ['get-assignment-attachment-list', classroomSlug, assignmentSlug],
            () => getAttachmentList(assignmentSlug),
            options
        );
    };

    const editAssignment = async (
        state: any,
        formData: FormData
    ): Promise<editAssignmentResult> => {
        const { assignmentSlug } = state;

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${classroomSlug}/a/${assignmentSlug}/edit`,
            {
                method: 'POST',
                body: formData,
                credentials: 'include',
            }
        );

        const data = await response.json();
        return data;
    };

    const submitAttach = async (
        classroomSlug: string,
        assignmentSlug: string,
        files: File[]
    ) => {
        const formData = new FormData();
        formData.append('file_count', files.length.toString());
        files.forEach((file, idx) => {
            formData.append(`f-${idx}`, file);
        });

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${classroomSlug}/a/${assignmentSlug}/submit-attach`,
            {
                method: 'POST',
                body: formData,
                credentials: 'include',
            }
        );

        const data = await response.json();
        return data;
    };

    const getSubmissionAttachmentList = async (
        assignmentSlug: string
    ): Promise<submitAttachListResult> => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${classroomSlug}/a/${assignmentSlug}/submit-attach`,
            {
                credentials: 'include',
            }
        );

        const data = await response.json();
        return data;
    };

    const useGetSubmissionAttachmentList = (
        assignmentSlug: string,
        options = {}
    ) => {
        return useQuery(
            ['get-submission-attachment-list', classroomSlug, assignmentSlug],
            () => getSubmissionAttachmentList(assignmentSlug),
            options
        );
    };

    const submit = async (assignmentSlug: string) => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${classroomSlug}/a/${assignmentSlug}/submit`,
            {
                method: 'POST',
                credentials: 'include',
            }
        );

        const data = await response.json();
        return data;
    };

    const unsubmit = async (assignmentSlug: string) => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${classroomSlug}/a/${assignmentSlug}/unsubmit`,
            {
                method: 'POST',
                credentials: 'include',
            }
        );

        const data = await response.json();
        return data;
    };

    const getUserSubmission = async (assignmentSlug: string) => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${classroomSlug}/a/${assignmentSlug}/submitted-users`,
            {
                credentials: 'include',
            }
        );
        const data = await response.json();
        return data;
    };

    const useGetUserSubmission = (assignmentSlug: string, options = {}) => {
        return useQuery(
            ['get-user-submission', classroomSlug, assignmentSlug],
            () => getUserSubmission(assignmentSlug),
            options
        );
    };

    const getSubmissionFile = async (
        userId: string,
        assignmentSlug: string
    ) => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${classroomSlug}/a/${assignmentSlug}/submitted-file?user_id=${encodeURIComponent(userId)}`,
            {
                credentials: 'include',
            }
        );
        const data = await response.json();
        return data;
    };

    const updateScore = async (
        userId: string,
        assignmentSlug: string,
        score: string
    ) => {
        const formData = new FormData();
        formData.append('score', score);
        formData.append('user_id', userId);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${classroomSlug}/a/${assignmentSlug}/update-score`,
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
        getAttachmentList,
        useGetAttachmentList,
        editAssignment,
        submitAttach,
        getSubmissionAttachmentList,
        useGetSubmissionAttachmentList,
        submit,
        unsubmit,
        getUserSubmission,
        useGetUserSubmission,
        getSubmissionFile,
        updateScore,
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

type getAttachmentListResult =
    | {
          status: 'success';
          data: Attachment[];
      }
    | {
          status: 'error';
          message: string;
      };

type editAssignmentResult =
    | {
          status: 'success';
          message: string;
      }
    | {
          status: 'error';
          message: string;
      }
    | {
          status: 'idle';
          assignmentSlug: string;
      };

type submitAttachListResult =
    | {
          status: 'success';
          data: Attachment[];
      }
    | {
          status: 'error';
          message: string;
      };

export interface Attachment {
    file_id: number;
    name: string;
    size: number;
    type: string;
}

export interface Assignment {
    slug: string;
    title: string;
    due_date: string;
    description: string;
    max_score: string;
    is_submitted: boolean | null;
    num_assigned: number;
    num_turned_in: number;
}
