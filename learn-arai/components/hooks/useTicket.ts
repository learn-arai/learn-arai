export const useTicket = () => {
    const getHistory = async (): Promise<HistoryResult> => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/ticket/history`,
            {
                method: 'GET',
                credentials: 'include',
            }
        );

        const json = await res.json();
        return json;
    };

    const createTicket = async (
        _: any,
        formData: FormData
    ): Promise<CreateTicketResult> => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/ticket/create`,
            {
                method: 'POST',
                body: formData,
                credentials: 'include',
            }
        );

        const json = await res.json();
        return json;
    };

    return { getHistory, createTicket };
};

export type CreateTicketResult =
    | {
          status: 'error';
          message: string;
      }
    | {
          status: 'idle';
      }
    | {
          status: 'success';
          message: 'Ticket created';
          data: {
              slug: string;
          };
      };

export type HistoryResult =
    | {
          status: 'success';
          data: History[];
      }
    | {
          status: 'error';
          message: string;
      };

export interface History {
    description: string;
    slug: string;
    supporterId: string;
    title: string;
    userId: string;
}
