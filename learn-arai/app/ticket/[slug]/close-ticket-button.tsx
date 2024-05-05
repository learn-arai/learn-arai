'use client';

import { useContext } from 'react';

import { CheckCircle } from 'lucide-react';

import { TicketContext } from '@/components/context/TicketContext';
import { useTicket } from '@/components/hooks/useTicket';
import { Button } from '@/components/ui/button';

export default function CloseTicketButton({ slug }: { slug: string }) {
    const ticket = useContext(TicketContext);
    const { useCloseTicket } = useTicket();
    const { isLoading, refetch } = useCloseTicket(slug);

    return (
        <Button
            className="absolute right-4 top-1/2 -translate-y-1/2"
            variant="success"
            disabled={isLoading}
            onClick={async () => {
                await refetch();
                ticket.updateTicket();
            }}
        >
            Close Ticket
            <CheckCircle className="ml-2 h-4 w-4" />
        </Button>
    );
}
