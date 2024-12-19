import { useState } from "react";

export const useApi = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const request = async (url: string, options?: RequestInit, isFile?: boolean) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            if (isFile) {
                return response;
            }
            return await response.json();
        } catch (err) {
            setError((err as Error).message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { request, isLoading, error };
};
