// authProvider.ts

import type { AuthProvider } from "@refinedev/core";
import { API_URL, dataProvider } from "./data";
import { User } from "@/graphql/schema.types";

/**
 * Demo credentials
 */
export const authCredentials = {
  email: "ranaHabashy22@gmail.com",
  password: "demodemo",
};

type SignupInput = {
  email: string;
  password: string;
  name: string;
};

export const authProvider: AuthProvider = {
  login: async ({ email }) => {
    try {
      const { data } = await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email },
          rawQuery: `
                mutation Login($email: String!) {
                    login(loginInput: {
                      email: $email
                    }) {
                      accessToken,
                    }
                }
            `,
        },
      });

      localStorage.setItem("access_token", data.login.accessToken);

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (e) {
      const error = e as Error;
      return {
        success: false,
        error: {
          message: "message" in error ? error.message : "Login failed",
          name: "name" in error ? error.name : "Invalid email or password",
        },
      };
    }
  },
  logout: async () => {
    localStorage.removeItem("access_token");
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    if (error.statusCode === "UNAUTHENTICATED") {
      return {
        logout: true,
      };
    }
    return { error };
  },
  check: async () => {
    try {
      await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          rawQuery: `
                query Me {
                    me {
                      name
                    }
                }
            `,
        },
      });

      return {
        authenticated: true,
        redirectTo: "/",
      };
    } catch (error) {
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }
  },
  getIdentity: async () => {
    const accessToken = localStorage.getItem("access_token");

    try {
      const { data } = await dataProvider.custom<{ me: User }>({
        url: API_URL,
        method: "post",
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {},
        meta: {
          rawQuery: `
                query Me {
                    me {
                        id,
                        name,
                        email,
                        phone,
                        jobTitle,
                        timezone,
                        avatarUrl
                    }
                }
            `,
        },
      });

      return data.me;
    } catch (error) {
      return undefined;
    }
  },
};

// ✅ Adding signup separately
export const customAuthProvider = {
  ...authProvider,
  signup: async ({ email, password, name }: SignupInput) => {
    try {
      const { data } = await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email, password, name },
          rawQuery: `
            mutation Signup($email: String!, $password: String!, $name: String!) {
              signup(signupInput: {
                email: $email,
                password: $password,
                name: $name
              }) {
                accessToken
              }
            }
          `,
        },
      });

      localStorage.setItem("access_token", data.signup.accessToken);

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (e) {
      const error = e as Error;

      return {
        success: false,
        error: {
          message: "message" in error ? error.message : "Signup failed",
          name: "name" in error ? error.name : "Something went wrong",
        },
      };
    }
  },
};
