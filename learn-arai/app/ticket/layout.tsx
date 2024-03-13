import { TicketProvider } from '@/components/context/TicketContext';

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <TicketProvider>{children}</TicketProvider>;
}
