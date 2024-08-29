import axiosInstance from "../axiosInstance";

export type User = {
    id: number;
    telegramId: number;
    username: string;
};

export type LoginResponse = {
    user: User;
    token: string;
};

export type Referral = {
    id: number;
    username: string;
    joinedAt: string;
};

export const userService = Object.freeze({
    login: async (initData: string): Promise<LoginResponse> => {
        const response = await axiosInstance.post<LoginResponse>("/auth/login", {
            initData
        });
        return response.data;
    },
    getCurrentUser: async (): Promise<User> => {
        const response = await axiosInstance.get<User>("/auth/me");
        return response.data;
    },
    getReferrals: async (): Promise<Referral[]> => {
        try {
            const response = await axiosInstance.get<Referral[]>("/user/referrals");
            if (Array.isArray(response.data)) {
                return response.data;
            } else {
                console.error("Unexpected response format for referrals:", response.data);
                return [];
            }
        } catch (error) {
            console.error("Error fetching referrals:", error);
            return [];
        }
    }
});