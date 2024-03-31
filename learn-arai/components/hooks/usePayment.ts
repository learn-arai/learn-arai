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

    return {
        createCheckout,
        useCreateCheckout,
        createCheckoutAndGetClientSecret,
    };
};
