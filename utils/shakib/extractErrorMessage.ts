import { AxiosError } from "axios";

export function extractErrorMessage(err: unknown): string {
    if (err instanceof AxiosError) {
        return err.response?.data?.error || err.message;
    }
    if (err instanceof Error) {
        return err.message;
    }
    return "Unknown error";
}