import React, { useState } from "react";
import { Tabs, Form, Input, Button, ConfigProvider } from "antd";

const { TabPane } = Tabs;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthForm = () => {
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string) => {
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const onLoginFinish = async (values: any) => {
    console.log("Login values:", values);
  };

  const onRegisterFinish = async (values: any) => {
    console.log("Register values:", values);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2563eb",
          borderRadius: 8,
        },
      }}
    >
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome back</h1>
            <p className="text-gray-600">Please sign in to your account</p>
          </div>
          <img
            src="/saigeware-horizontal-removebg-preview.png"
            alt="saigeware logo"
            className="h-10 w-auto"
          />
        </div>

        <Tabs defaultActiveKey="login" className="w-full -mt-4">
          <TabPane tab="Login" key="login">
            <Form
              form={loginForm}
              layout="vertical"
              onFinish={onLoginFinish}
              size="large"
              className="space-y-4"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  {
                    validator: (_, value) =>
                      value && !emailRegex.test(value)
                        ? Promise.reject("Invalid email format")
                        : Promise.resolve(),
                  },
                ]}
              >
                <Input
                  placeholder="you@example.com"
                  onChange={(e) => validateEmail(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <Input.Password placeholder="••••••••" />
              </Form.Item>

              <div className="flex items-center justify-between mb-6">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Button type="link" className="p-0 h-auto text-blue-600">
                    Forgot password?
                  </Button>
                </Form.Item>
              </div>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Sign in
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="Register" key="register">
            <Form
              form={registerForm}
              layout="vertical"
              onFinish={onRegisterFinish}
              size="large"
              className="space-y-4"
            >
              <Form.Item
                label="Full Name"
                name="name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input placeholder="Enter your full name" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  {
                    validator: (_, value) =>
                      value && !emailRegex.test(value)
                        ? Promise.reject("Invalid email format")
                        : Promise.resolve(),
                  },
                ]}
              >
                <Input
                  placeholder="you@example.com"
                  onChange={(e) => validateEmail(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please create a password" },
                ]}
              >
                <Input.Password placeholder="••••••••" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Create account
                </Button>
              </Form.Item>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
              </div>
            </Form>
          </TabPane>
        </Tabs>
      </div>
    </ConfigProvider>
  );
};

export default AuthForm;
