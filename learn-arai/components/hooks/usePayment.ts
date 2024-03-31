import { useQuery } from 'react-query';

export const usePayment = () => {
    const createCheckoutAndGetClientSecret = async () => {
        const data = await createCheckout();
        return data.data.client_secret;
    };

    const createCheckout = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/checkout/create`,
            {
                method: 'POST',
                credentials: 'include',
            }
        );

        const data = await response.json();
        return data;
    };

    const useCreateCheckout = (options = {}) => {
        return useQuery(['create-checkout'], createCheckout, options);
    };

    const getCheckoutSession = async (sessionId: string) => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/checkout/session?session_id=${sessionId}`,
            {
                method: 'GET',
                credentials: 'include',
            }
        );

        const data = await response.json();
        return data;
    };

    const useGetCheckoutSession = (sessionId: string, options = {}) => {
        return useQuery(
            ['get-checkout-session', sessionId],
            () => getCheckoutSession(sessionId),
            options
        );
    };

    return {
        createCheckout,
        useCreateCheckout,
        createCheckoutAndGetClientSecret,
        getCheckoutSession,
        useGetCheckoutSession,
    };
};
