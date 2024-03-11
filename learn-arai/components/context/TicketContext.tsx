'use client';

import { createContext, useEffect, useState } from 'react';

import { History, useTicket } from '@/components/hooks/useTicket';

export const TicketContext = createContext<{
    history: History[] | null;
    updateTicket: () => void;
}>({
    history: null,
    updateTicket: () => {},
});

export const TicketProvider = (props: React.PropsWithChildren) => {
    const [history, setHistory] = useState<History[] | null>(null);
    const { getHistory } = useTicket();

    const { children } = props;

    const updateTicket = () => {
        getHistory().then((h) => {
            if (h.status === 'success') {
                setHistory(h.data);
            }
        });
    };

    useEffect(() => {
        if (history === null) updateTicket();
    });

    return (
        <TicketContext.Provider value={{ history, updateTicket }}>
            {children}
        </TicketContext.Provider>
    );
};
