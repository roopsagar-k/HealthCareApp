import type React from "react";
import { Layout} from "antd";
import { motion } from "framer-motion";
import AppointmentDashboard from "../components/AppointmentDashboard";
import {
  HeartOutlined,
} from "@ant-design/icons";
import HeaderComponent from "../components/Header";
import { message } from "antd";

const { Content } = Layout;

const Home: React.FC = () => {
  const [msg, contextHolder] = message.useMessage();
  return (
    <Layout
      style={{ background: "#ffffff", minHeight: "100vh" }}
      className="min-h-screen"
    >
      {contextHolder}
      {/* Header */}
      <HeaderComponent message={msg} />

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
