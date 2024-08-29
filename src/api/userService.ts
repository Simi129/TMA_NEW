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
            return response.data;
        } catch (error) {
            console.error("Error fetching current user:", error);
            throw error;
        }
    },
    getReferrals: async (): Promise<Referral[]> => {
        try {
            const response = await axiosInstance.get<Referral[]>("/user/referrals");
            return response.data;
        } catch (error) {
            console.error("Error fetching referrals:", error);
            throw error;
        }
    }
};