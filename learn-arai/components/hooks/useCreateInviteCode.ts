import { useQuery } from 'react-query';

import { useClassroom } from './useClassroom';

export function useCreateInviteCode(classroomSlug: string) {
    const { createGroup, getGroupList } = useClassroom();

    const createNewGroup = async (title: string) => {
        const formData = new FormData();
        formData.append('title', title);

        createGroup(classroomSlug, formData);
    };

    const getQueryGroup = async (query: string = '') => {
        const groupList = await getGroupList(classroomSlug, query);

        if (groupList.status === 'success') {
            return {
                groupList: groupList.data,
                defaultGroup: groupList.default_group,
            };
        }
    };

    const useGetQueryGroup = (query: string = '', options = {}) => {
        return useQuery(
            ['get-query-group', classroomSlug, query],
            () => getQueryGroup(query),
            options
        );
    };

    return { createNewGroup, getQueryGroup, useGetQueryGroup };
}

export type Group = {
    slug: string;
    title: string;
};

export type SelectedGroup = {
    [slug: string]: string;
    // key will be slug and value will be title;
    // all elements that in here are the groups that be selected by user.
};
