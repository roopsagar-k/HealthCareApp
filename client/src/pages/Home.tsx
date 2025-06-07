import type React from "react";
import { Layout, Button, Avatar, Dropdown, message } from "antd";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import AppointmentDashboard from "../components/AppointmentDashboard";
import { useNavigate } from "react-router-dom";
import {
  CalendarOutlined,
  UserOutlined,
  LogoutOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useState } from "react";
import HeaderComponent from "../components/Header";

const { Content, Header } = Layout;

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      message.success("Logged out successfully!");
      navigate("/");
    } else {
      message.error(result.error || "Logout failed");
    }
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <Layout
      style={{ background: "#ffffff", minHeight: "100vh" }}
      className="min-h-screen"
    >
      {/* Header */}
      <HeaderComponent />

      {/* Main Content */}
      <Content className="pt-20 px-6 pb-6 mt-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 py-6 px-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white shadow-lg">
              {/* Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <HeartOutlined className="text-4xl text-white opacity-90" />
              </motion.div>

              {/* Text */}
              <div>
                <motion.h2
                  className="text-xl mb-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <span className="font-semibold">Welcome to SaigeWare</span>
                </motion.h2>

                <motion.p
                  className="text-blue-100"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <span className="font-sm">
                    {" "}
                    Your personal portal to manage health treatments and
                    appointments.
                  </span>
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <AppointmentDashboard />
          </motion.div>
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
