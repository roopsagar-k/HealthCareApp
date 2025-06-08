import React from "react";
import { Dropdown, Avatar, Button } from "antd";
import type { MenuProps } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import type { MessageInstance } from "antd/es/message/interface";

const HeaderComponent: React.FC<{ message: MessageInstance }> = ({
  message,
}) => {
  const { user, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      message.success("Logged out successfully!");
      navigate("/");
    } else {
      message.error(result.error || "Logout failed");
    }
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: <span className="text-red-600">Logout</span>,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 w-[95%] max-w-7xl">
      <nav className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl shadow-black/5">
        <div className="flex justify-between items-center h-16 px-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src="/saigeware-horizontal-removebg-preview.png"
              alt="saigeware logo"
              className="h-10 w-auto"
            />
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-4 px-4 py-2 bg-gray-50/70 backdrop-blur-sm rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                Welcome, {user?.name}
              </span>
            </div>

            {/* Ant Design Dropdown */}
            <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
              <Button
                type="text"
                className="flex items-center gap-2 hover:bg-gray-100 rounded-xl px-2 py-1"
              >
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  className="bg-gradient-to-br from-blue-500 to-indigo-600"
                />
                <span className="text-sm text-gray-700 hidden sm:inline">
                  {user?.email}
                </span>
              </Button>
            </Dropdown>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
          >
            {showMobileMenu ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl rounded-b-2xl">
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <UserOutlined className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default HeaderComponent;
