import React, { useState } from "react";
import { Tabs, Form, Input, Button, ConfigProvider } from "antd";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthForm = () => {
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState("login");
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [messageText, setMessageText] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"error" | "success" | null>(
    null
  );

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const clearMessage = () => {
    setMessageText(null);
    setMessageType(null);
  };

  const showMessage = (text: string, type: "error" | "success") => {
    setMessageText(text);
    setMessageType(type);
    // Clear message after 5 seconds
    setTimeout(() => {
      clearMessage();
    }, 5000);
  };

  const onLoginFinish = async (values: any) => {
    setLoginLoading(true);
    clearMessage();

    try {
      const { success, error } = await login(values.email, values.password);

      if (success) {
        showMessage("Login successful!", "success");
        navigate("/home");
      } else if (error) {
        showMessage(error, "error");
      }
    } catch (error: any) {
      showMessage("An unexpected error occurred during login", "error");
      console.error("Login failed:", error);
    } finally {
      setLoginLoading(false);
    }
  };

  const onRegisterFinish = async (values: any) => {
    setRegisterLoading(true);
    clearMessage();

    try {
      const { success, error } = await register(
        values.name,
        values.email,
        values.password
      );

      if (success) {
        showMessage("Registration successful! Please login.", "success");
        setActiveTab("login");
        registerForm.resetFields();
      } else if (error) {
        showMessage(error, "error");
      }
    } catch (error: any) {
      showMessage("An unexpected error occurred during registration", "error");
      console.error("Registration failed:", error);
    } finally {
      setRegisterLoading(false);
    }
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

        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key);
            clearMessage();
          }}
          className="w-full -mt-4"
        >
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
                <Input placeholder="you@example.com" />
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
                <span
                  className="text-blue-600 cursor-pointer hover:text-blue-800"
                  onClick={() => setActiveTab("register")}
                >
                  Don't have an account yet? Please register
                </span>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loginLoading}
                >
                  Sign in
                </Button>
              </Form.Item>

              {/* Message span below login form */}
              {messageText && activeTab === "login" && (
                <span
                  className={`block mt-2 text-sm ${
                    messageType === "error" ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {messageText}
                </span>
              )}
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
                rules={[
                  { required: true, message: "Please enter your name" },
                  { min: 2, message: "Name must be at least 2 characters" },
                ]}
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
                <Input placeholder="you@example.com" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please create a password" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input.Password placeholder="••••••••" />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Passwords do not match");
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="••••••••" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={registerLoading}
                >
                  Create account
                </Button>
              </Form.Item>

              <div className="text-center mt-4">
                <span
                  className="text-blue-600 cursor-pointer hover:text-blue-800"
                  onClick={() => setActiveTab("login")}
                >
                  Already have an account? Sign in
                </span>
              </div>

           
              {messageText && activeTab === "register" && (
                <span
                  className={`block mt-2 text-sm ${
                    messageType === "error" ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {messageText}
                </span>
              )}
            </Form>
          </TabPane>
        </Tabs>
      </div>
    </ConfigProvider>
  );
};

export default AuthForm;
