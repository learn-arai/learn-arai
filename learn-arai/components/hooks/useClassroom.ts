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

    const createInviteCode = async (_: any, formData: FormData) => {

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${slug}/create-invite-code`,
            {
                method: 'POST',
                body: formData,
                credentials: 'include',
            }
        );

        const data = await response.json();
        return null;
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

    const getGroupList = async (slug: string): Promise<getGroupListResult> => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${slug}/g/list`,
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

    return {
        createClassroom,
        createInviteCode,
        joinClass,
        getMyClassroom,
        useGetMyClassroom,
        getGroupList,
        useGetGroupList,
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
      }
    | {
          status: 'error';
          message: string;
      };

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
