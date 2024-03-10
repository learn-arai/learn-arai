'use client';

import { createContext, useEffect, useState } from 'react';

import { History, useTicket } from '@/components/hooks/useTicket';

export const TicketContext = createContext<{ history: History[] | null }>({
    history: null,
});

export const TicketProvider = (props: React.PropsWithChildren) => {
    const [history, setHistory] = useState<History[] | null>(null);
    const { getHistory } = useTicket();

    const { children } = props;

    useEffect(() => {
        if (history === null) {
            getHistory().then((h) => {
                if (h.status === 'success') {
                    setHistory(h.data);
                }
            });
        }
    });

    return (
        <TicketContext.Provider value={{ history }}>
            {children}
        </TicketContext.Provider>
    );
};
