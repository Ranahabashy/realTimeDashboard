// Register.tsx

import { customAuthProvider } from "@/provider";
import { AuthPage } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import { message } from "antd";

export const Register = () => {
  const { push } = useNavigation();

  return (
    <AuthPage
      type="register"
      formProps={{
        onFinish: async (values) => {
          const { email, password, name } = values;

          const response = await customAuthProvider.signup({ email, password, name });

          if (response.success) {
            message.success("Account created successfully!");
            push("/"); // Redirect after signup
          } else {
            message.error(response.error?.message || "Signup failed!");
          }
        },
      }}
    />
  );
};
