export function handleError(error: unknown) {
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
}
