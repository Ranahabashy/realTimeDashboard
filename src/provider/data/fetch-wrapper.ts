import type { GraphQLFormattedError } from "graphql";

type Error = {
    message: string;
    statusCode: string;
};

const customFetch = async (url: string, options: RequestInit) => {
    const accessToken = localStorage.getItem("access_token");
    const headers = options.headers as Record<string, string>;

    return await fetch(url, {
        ...options,
        headers: {
            ...headers,
            Authorization: headers?.Authorization || `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            // Apollo is graphQl client that use in front to make requst graphQl Api 
            "Apollo-Require-Preflight": "true",
        },
    });
};
// to handle solution of error to check the data that come back from graphQl 
const getGraphQLErrors = (
    body: Record<"errors", GraphQLFormattedError[] | undefined>,
)
    // define the output of the function 
    : Error | null => {
    if (!body) {
        return {
            message: "Unknown error",
            statusCode: "INTERNAL_SERVER_ERROR",
        };
    }

    if ("errors" in body) {
        const errors = body?.errors;
        const messages = errors?.map((error) => error?.message)?.join("");
// extension.code =>> mean that standard error like unAuthorized & internal server error 
        const code = errors?.[0]?.extensions?.code;

        return {
            message: messages || JSON.stringify(errors),
            statusCode: code || 500,
        };
    }

    return null;
};
export const fetchWrapper = async (url: string, options: RequestInit) => {
    const response = await customFetch(url, options);
// responseClone method in js create duplicate response object 
// by default object is read once and if dublicated make an error but if using responseClone work with multiple copies 
    const responseClone = response.clone();
    const body = await responseClone.json();
    const error = getGraphQLErrors(body);

    if (error) {
        throw error;
    }

    return response;
};
