import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { useLogin, useNavigation } from "@refinedev/core";
import { customAuthProvider } from "@/provider";

const { Title } = Typography;

export const AuthPage = () => {
  const [form] = Form.useForm();
  const [isSignUp, setIsSignUp] = useState(false);
  const { mutate: login } = useLogin();
  const { push } = useNavigation();

  const handleFinish = async (values: any) => {
    if (isSignUp) {
      const { email, password, name } = values;

      const response = await customAuthProvider.signup({ email, password, name });

      if (response.success) {
        message.success("Account created successfully!");
        push("/");
      } else {
        message.error(response.error?.message || "Signup failed!");
      }
    } else {
      const { email } = values;
      login({ email });
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
      }}
    >
      <Card style={{ width: 400 }}>
        <Title level={3} style={{ textAlign: "center" }}>
          {isSignUp ? "Sign Up" : "Login"}
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            email: "",
            password: "",
            name: "",
          }}
        >
          {isSignUp && (
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input />
            </Form.Item>
          )}

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {isSignUp ? "Sign Up" : "Login"}
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              type="link"
              block
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp
                ? "Already have an account? Login"
                : "Don't have an account? Sign Up"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
