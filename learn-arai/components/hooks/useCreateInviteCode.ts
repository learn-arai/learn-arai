'use client';

import { useContext, useEffect, useState } from 'react';

import SlugContext from '../context/SlugContext';

import { useClassroom } from './useClassroom';

export function useCreateInviteCode() {
    const slug = useContext(SlugContext);
    const { createGroup, getGroupList } = useClassroom();

    useEffect(() => {
        getQueryGroup();
    });

    const createNewGroup = async (title: string) => {
        const formData = new FormData();
        formData.append('title', title);

        createGroup(slug, formData);
    };

    const getQueryGroup = async (query: string = '') => {
        const groupList = await getGroupList(slug, query);

        if (groupList.status === 'success') {
            return { groupList : groupList.data, defaultGroup : groupList.default_group };
        }
    };

    return { createNewGroup, getQueryGroup };
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
