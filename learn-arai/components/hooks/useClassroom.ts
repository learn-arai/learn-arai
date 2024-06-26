'use client';

import { useContext } from 'react';
import { useQuery } from 'react-query';

import SlugContext from '../context/SlugContext';

export const useClassroom = () => {
    const slug = useContext(SlugContext);

    const createClassroom = async (
        _: any,
        formData: FormData
    ): Promise<createClassroomResult> => {
        let res;
        try {
            res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/create`,
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

    const createInviteCode = async (
        _: any,
        formData: FormData
    ): Promise<createInviteCodeResult> => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${slug}/create-invite-code`,
            {
                method: 'POST',
                body: formData,
                credentials: 'include',
            }
        );

        const data = await response.json();
        navigator.clipboard.writeText(data.invite_code);

        return {
            status: 'success',
            invite_code: data.invite_code,
            message: 'Invite code have copied to clipboard',
        };
    };

    const joinClass = async (_: any, formData: FormData) => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/join-classroom`,
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

    const useGetMyClassroom = () => {
        return useQuery(['get-my-classroom'], () => getMyClassroom());
    };

    const getGroupList = async (
        slug: string,
        queryTitle?: string
    ): Promise<getGroupListResult> => {
        const response = await fetch(
            queryTitle === undefined
                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${slug}/g/list`
                : `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${slug}/g/list?group_title=${encodeURIComponent(queryTitle)}`,
            {
                credentials: 'include',
            }
        );

        const data = await response.json();
        return data;
    };

    const useGetGroupList = (slug: string) => {
        return useQuery(['get-group-list', slug], () => getGroupList(slug));
    };

    const createGroup = async (slug: string, formData: FormData) => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${slug}/g/create`,
            {
                method: 'POST',
                body: formData,
                credentials: 'include',
            }
        );

        const data = await response.json();
        return data;
    };

    const getGroupMember = async (
        classSlug: string,
        groupSlug: string
    ): Promise<getGroupMemberResult> => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${classSlug}/g/${groupSlug}/members`,
            {
                credentials: 'include',
            }
        );

        const data = await response.json();
        return data;
    };

    const useGetGroupMember = (
        classSlug: string,
        groupSlug: string,
        option = {}
    ) => {
        return useQuery(
            ['get-group-member', classSlug, groupSlug],
            () => getGroupMember(classSlug, groupSlug),
            option
        );
    };

    const searchStudentMember = async (slug: string, query: string) => {
        const searchParams = new URLSearchParams();
        searchParams.append('student_only', '1');

        if (query.trim() !== '') {
            searchParams.append('search_query', query);
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${slug}/members?${searchParams.toString()}`,
            {
                credentials: 'include',
            }
        );

        const data = await response.json();
        return data;
    };

    const useSearchStudentMember = (slug: string, query: string) => {
        return useQuery(['search-student-member', slug, query], () =>
            searchStudentMember(slug, query)
        );
    };

    const addMemberToGroup = async (
        slug: string,
        groupSlug: string,
        userId: string
    ) => {
        const formData = new FormData();
        formData.append('user_id', userId);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${slug}/g/${groupSlug}/adduser`,
            {
                method: 'POST',
                body: formData,
                credentials: 'include',
            }
        );

        const data = await response.json();
        return data;
    };

    const removeMemberToGroup = async (
        slug: string,
        groupSlug: string,
        userId: string
    ) => {
        const formData = new FormData();
        formData.append('user_id', userId);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${slug}/g/${groupSlug}/removeuser`,
            {
                method: 'POST',
                body: formData,
                credentials: 'include',
            }
        );

        const data = await response.json();
        return data;
    };

    const deleteGroup = async (
        _: any,
        formData: FormData
    ): Promise<deleteGroupResult> => {
        const classSlug = formData.get('slug');
        const groupSlug = formData.get('group-slug');

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${classSlug}/g/${groupSlug}/delete`,
            {
                method: 'POST',
                credentials: 'include',
            }
        );

        const data = await response.json();
        return data;
    };

    const getUsers = async (slug: string): Promise<getUsersResult> => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${slug}/members`,
            {
                method: 'GET',
                credentials: 'include',
            }
        );
        const data = await response.json();
        return data;
    };

    const useGetUsers = (slug: string) => {
        return useQuery(['get-users', slug], () => getUsers(slug));
    };

    const setDeleteTime = async (slug: string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${slug}/delete`,
                {
                    method: 'POST',
                    credentials: 'include',
                }
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            return {
                status: 'error',
                message: 'An error occurred while setting delete time',
            };
        }
    };

    const getClassroomDetail = async (
        classSlug: string
    ): Promise<getClassroomDetailResult> => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${classSlug}/detail`,
            {
                credentials: 'include',
            }
        );

        const data = await response.json();
        return data;
    };

    const useGetClassroomDetail = (classSlug: string) => {
        return useQuery(['get-classroom-detail', classSlug], () =>
            getClassroomDetail(classSlug)
        );
    };

    return {
        createClassroom,
        createInviteCode,
        joinClass,
        getMyClassroom,
        useGetMyClassroom,
        getGroupList,
        useGetGroupList,
        createGroup,
        getGroupMember,
        useGetGroupMember,
        searchStudentMember,
        useSearchStudentMember,
        addMemberToGroup,
        removeMemberToGroup,
        deleteGroup,
        setDeleteTime,
        getClassroomDetail,
        useGetClassroomDetail,
        getUsers,
        useGetUsers,
    };
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

type getGroupListResult =
    | {
          status: 'success';
          data: Group[];
          default_group: string;
      }
    | {
          status: 'error';
          message: string;
      };

export type getGroupMemberResult =
    | {
          status: 'success';
          data: GroupMember[];
      }
    | {
          status: 'error';
          message: string;
      };

type deleteGroupResult =
    | {
          status: 'success';
      }
    | { status: 'error'; message: string }
    | { status: 'idle' };

export type getClassroomDetailResult =
    | {
          status: 'success';
          data: {
              name: string;
              description: string;
              created_at: string;
              created_by: {
                  first_name: string;
                  last_name: string;
                  email: string;
              };
              type: 'student' | 'teacher';
              will_delete_in: Date;
          };
      }
    | {
          status: 'error';
          message: string;
      };

type createInviteCodeResult =
    | {
          status: 'success';
          invite_code: string;
          message: string;
      }
    | {
          status: 'error';
          message: string;
      }
    | {
          status: 'idle';
      };

type getUsersResult =
    | {
          status: 'success';
          data: {
              teacher: GroupMember[];
              student: GroupMember[];
          };
      }
    | {
          status: 'error';
          message: string;
      };

export interface GroupMember {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

export interface Classroom {
    slug: string;
    name: string;
    description: string;
    createdAt: string;
    createdBy: string;
}

export interface Group {
    slug: string;
    title: string;
    createdAt: string;
    createdBy: string;
}
