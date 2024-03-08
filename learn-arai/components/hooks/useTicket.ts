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

    return { getHistory };
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
