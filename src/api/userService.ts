import axiosInstance from "../axiosInstance";

export type User = {
    id: number;
    telegramId: number;
    username: string;
};

export type Referral = {
    id: number;
    username: string;
    joinedAt: string;
};

export const userService = {
    getCurrentUser: async (): Promise<User> => {
        try {
            const response = await axiosInstance.get<User>("/auth/me");
            if (response.data && typeof response.data === 'object') {
                return response.data;
            }
            throw new Error('Invalid user data received');
        } catch (error) {
            console.error("Error fetching current user:", error);
            throw error;
        }
    },
    getReferrals: async (): Promise<Referral[]> => {
        try {
            const response = await axiosInstance.get<Referral[]>("/user/referrals");
            if (Array.isArray(response.data)) {
                return response.data;
            }
            throw new Error('Unexpected referrals data');
        } catch (error) {
            console.error("Error fetching referrals:", error);
            throw error;
        }
    }
};