import  { ReactNode, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useFetchCurrentUser } from "../hooks/useFetchCurrentUser";
import { useLoginUser } from "../hooks/useLoginUser";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { user, error: fetchCurrentUserError, fetchCurrentUser, setUser, isLoading: isFetchingCurrentUser } = useFetchCurrentUser();
    const { authData, error: loginUserError, isLoading: isLoggingIn } = useLoginUser();

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if(authData) {
            setUser(authData.user);
            localStorage.setItem("token", authData.token);
        }
    }, [authData]);

    const isLoading = isFetchingCurrentUser || isLoggingIn;
    const errorMessage = fetchCurrentUserError?.message || loginUserError?.message || null;

    if (isLoading) return <div>Loading...</div>;

    if (errorMessage) return <div>Error: {errorMessage}</div>;

    if (!user) return <div>No user data available</div>;

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
};