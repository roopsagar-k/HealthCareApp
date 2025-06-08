import type React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Modal,
  DatePicker,
  TimePicker,
  message as msg,
  Popconfirm,
  Empty,
  Spin,
  Badge,
  Tag,
  Tooltip,
  Space,
  Divider,
} from "antd";
import { motion, AnimatePresence } from "framer-motion";
import {
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ScheduleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import dayjs, { type Dayjs } from "dayjs";
import { useAuth } from "../context/AuthContext";
import { requestHandler } from "../lib/requestHandler";
import type {
  Appointment,
  ApiResponse,
  UpdateAppointmentPayload,
} from "../lib/types";
import AppointmentBooking from "./AppointmentBooking";
import StaticCards from "./StaticCards";

const AppointmentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [editDate, setEditDate] = useState<Dayjs | null>(null);
  const [editTime, setEditTime] = useState<Dayjs | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, contextHolder] = msg.useMessage();

  const fetchAppointments = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response: ApiResponse<Appointment[]> = await requestHandler({
        method: "GET",
        endpoint: `/api/appointments/${user.id}`,
      });

      if (response.success) {
        // Sort appointments by session number
        const sortedAppointments = response.data.sort(
          (a, b) => a.session - b.session
        );
        setAppointments(sortedAppointments);
      } else {
        if (response.message !== "No appointments found for this patient.") {
          message.error(response.message);
        }
        setAppointments([]);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch appointments";
      if (!errorMessage.includes("No appointments found")) {
        message.error(errorMessage);
      }
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setEditDate(dayjs(appointment.date));
    setEditTime(dayjs(`${appointment.date} ${appointment.time}`));
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!editingAppointment || !editDate || !editTime) return;

    setUpdateLoading(true);
    try {
      const payload: UpdateAppointmentPayload = {
        newDate: editDate.format("YYYY-MM-DD"),
        newTime: editTime.format("HH:mm"),
      };

      const response: ApiResponse<Appointment> = await requestHandler({
        method: "PUT",
        endpoint: `/api/appointments/update/${editingAppointment.id}`,
        data: payload,
      });

      if (response.success) {
        message.success("Appointment updated successfully");
        setEditModalVisible(false);
        fetchAppointments();
      } else {
        message.error(response.message || "Failed to update appointment");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update appointment";
      message.error(errorMessage);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    try {
      const response: ApiResponse<null> = await requestHandler({
        method: "DELETE",
        endpoint: `/api/appointments/${user.id}`,
      });

      if (response.success) {
        message.success("All appointments deleted successfully");
        fetchAppointments();
      } else {
        message.error(response.message || "Failed to delete appointments");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete appointments";
      message.error(errorMessage);
    }
  };

  const handleBookingSuccess = () => {
    setBookingModalVisible(false);
    fetchAppointments();
  };

  // Check if date is allowed (Tuesday, Wednesday, Friday)
  const isDateAllowed = (date: Dayjs) => {
    const day = date.day();
    return day === 2 || day === 3 || day === 5;
  };

  const disabledDate = (current: Dayjs) => {
    return (
      current && (current < dayjs().startOf("day") || !isDateAllowed(current))
    );
  };

  const getSessionColor = (session: number) => {
    switch (session) {
      case 1:
        return {
          bg: "bg-gradient-to-br from-blue-50 to-blue-100",
          border: "border-blue-300",
          text: "text-blue-800",
          tag: "blue",
        };
      case 2:
        return {
          bg: "bg-gradient-to-br from-purple-50 to-purple-100",
          border: "border-purple-300",
          text: "text-purple-800",
          tag: "purple",
        };
      case 3:
        return {
          bg: "bg-gradient-to-br from-green-50 to-green-100",
          border: "border-green-300",
          text: "text-green-800",
          tag: "green",
        };
      default:
        return {
          bg: "bg-gradient-to-br from-gray-50 to-gray-100",
          border: "border-gray-300",
          text: "text-gray-800",
          tag: "default",
        };
    }
  };

  const getStatusInfo = (appointment: Appointment) => {
    const appointmentDate = dayjs(`${appointment.date} ${appointment.time}`);
    const now = dayjs();

    if (appointmentDate.isBefore(now)) {
      return {
        status: "Completed",
        color: "success",
        icon: <CheckCircleOutlined />,
        badgeStatus: "success" as const,
      };
    } else if (appointmentDate.diff(now, "hour") <= 24) {
      return {
        status: "Upcoming",
        color: "warning",
        icon: <ExclamationCircleOutlined />,
        badgeStatus: "warning" as const,
      };
    } else {
      return {
        status: "Scheduled",
        color: "processing",
        icon: <ScheduleOutlined />,
        badgeStatus: "processing" as const,
      };
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
     {contextHolder}
      {/* Static Cards  */}
      <StaticCards appointments={appointments} />
      {/* Main Appointments Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card
          className="shadow-xl border-0 rounded-2xl overflow-hidden"
          title={
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3 py-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <CalendarOutlined className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 m-0">
                    Treatment Sessions
                  </h2>
                  <p className="text-sm text-gray-500 m-0">
                    Manage your appointment schedule
                  </p>
                </div>
              </div>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setBookingModalVisible(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg"
                  disabled={appointments.length >= 3}
                  size="large"
                >
                  Book Session
                </Button>
                {appointments.length > 0 && (
                  <Popconfirm
                    title="Cancel All Sessions"
                    description="Are you sure you want to cancel all your treatment sessions? This action cannot be undone."
                    onConfirm={handleDelete}
                    okText="Yes, Cancel All"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                  >
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      className="hover:shadow-lg transition-all duration-200 rounded-lg"
                      size="large"
                    >
                      Cancel All
                    </Button>
                  </Popconfirm>
                )}
              </Space>
            </div>
          }
        >
          <AnimatePresence mode="wait">
            {appointments.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="py-16"
              >
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  imageStyle={{ height: 120 }}
                  description={
                    <div className="text-center space-y-4">
                      <h3 className="text-xl font-semibold text-gray-700">
                        No Sessions Scheduled
                      </h3>
                      <p className="text-gray-500 text-base max-w-md mx-auto">
                        Begin your treatment journey by booking your first
                        session. Two additional sessions will be automatically
                        scheduled.
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg inline-block">
                        <div className="flex items-center space-x-2 text-blue-600">
                          <InfoCircleOutlined />
                          <span className="text-sm font-medium">
                            Available: Tue, Wed, Fri • 10AM, 2PM, 4PM
                          </span>
                        </div>
                      </div>
                      <div className="pt-4">
                        <Button
                          type="primary"
                          size="large"
                          icon={<PlusOutlined />}
                          onClick={() => setBookingModalVisible(true)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg px-8 py-3 h-auto"
                        >
                          <span className="text-base">
                            Book Your First Session
                          </span>
                        </Button>
                      </div>
                    </div>
                  }
                />
              </motion.div>
            ) : (
              <motion.div
                key="appointments"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Appointment Cards */}
                <div className="space-y-4">
                  {appointments.map((appointment, index) => {
                    const sessionColors = getSessionColor(appointment.session);
                    const statusInfo = getStatusInfo(appointment);
                    const canEdit = dayjs(
                      `${appointment.date} ${appointment.time}`
                    ).isAfter(dayjs());
                    const appointmentDateTime = dayjs(
                      `${appointment.date} ${appointment.time}`
                    );

                    return (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <Card
                          className={`
                            ${sessionColors.bg} ${sessionColors.border} ${
                            sessionColors.text
                          }
                            border-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300
                            ${
                              canEdit ? "cursor-pointer hover:scale-[1.02]" : ""
                            }
                          `}
                          onClick={() => canEdit && handleEdit(appointment)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div
                                className={`flex flex-col items-center ${sessionColors.text} ${sessionColors.bg} p-6 rounded-lg`}
                              >
                                <div className="text-3xl font-bold">
                                  {appointmentDateTime.format("DD")}
                                </div>
                                <div className="text-sm font-medium uppercase">
                                  {appointmentDateTime.format("MMM")}
                                </div>
                              </div>

                              <Divider
                                type="vertical"
                                className="h-16 bg-current opacity-20"
                              />

                              <div className="space-y-2">
                                <div className="flex items-center space-x-3">
                                  <Tag
                                    color={sessionColors.tag}
                                    className="text-sm font-semibold px-3 py-1 rounded-full"
                                  >
                                    Treatment Session {appointment.session}
                                  </Tag>
                                  <Badge
                                    status={statusInfo.badgeStatus}
                                    text={statusInfo.status}
                                    className="font-medium"
                                  />
                                </div>

                                <div className="flex items-center space-x-6 text-sm">
                                  <div className="flex items-center space-x-2">
                                    <CalendarOutlined />
                                    <span className="font-medium">
                                      {appointmentDateTime.format(
                                        "dddd, MMMM DD, YYYY"
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <ClockCircleOutlined />
                                    <span className="font-medium">
                                      {appointmentDateTime.format("h:mm A")}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {canEdit && (
                              <div className="flex items-center space-x-2">
                                <Tooltip title="Edit appointment">
                                  <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    className="bg-white bg-opacity-20 hover:bg-opacity-30 border-0 text-current shadow-lg"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEdit(appointment);
                                    }}
                                  />
                                </Tooltip>
                              </div>
                            )}
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Treatment Info */}
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <InfoCircleOutlined className="text-blue-600 text-lg mt-1" />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-blue-900">
                        Treatment Schedule Information
                      </h4>
                      <div className="space-y-1 text-sm text-blue-800">
                        <p>
                          • Available appointment days:{" "}
                          <strong>Tuesday, Wednesday, Friday</strong>
                        </p>
                        <p>
                          • Available time slots:{" "}
                          <strong>10:00 AM, 2:00 PM, 4:00 PM</strong>
                        </p>
                        <p>• Treatment consists of 3 sessions total</p>
                        <p>
                          • Follow-up sessions are automatically scheduled 2
                          weeks apart
                        </p>
                        {appointments.some((apt) =>
                          dayjs(`${apt.date} ${apt.time}`).isAfter(dayjs())
                        ) && (
                          <p className="mt-2 text-blue-600">
                            <em>
                              Click on any upcoming appointment to reschedule
                            </em>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Booking Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <CalendarOutlined className="text-blue-600" />
            </div>
            <span className="text-lg font-semibold">
              Book New Treatment Session
            </span>
          </div>
        }
        open={bookingModalVisible}
        onCancel={() => setBookingModalVisible(false)}
        footer={null}
        width={900}
        className="custom-modal"
      >
        <AppointmentBooking onSuccess={handleBookingSuccess} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <EditOutlined className="text-blue-600" />
            </div>
            <span className="text-lg font-semibold">
              Reschedule Appointment
            </span>
          </div>
        }
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setEditModalVisible(false)}
            className="rounded-lg"
            size="large"
          >
            Cancel
          </Button>,
          <Button
            key="update"
            type="primary"
            loading={updateLoading}
            onClick={handleUpdate}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 rounded-lg"
            size="large"
          >
            Update Appointment
          </Button>,
        ]}
        className="custom-modal"
        width={600}
      >
        <div className="space-y-6 py-6">
          {editingAppointment && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">
                Current Appointment
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  Session: <strong>{editingAppointment.session}</strong>
                </p>
                <p>
                  Date:{" "}
                  <strong>
                    {dayjs(editingAppointment.date).format("MMMM DD, YYYY")}
                  </strong>
                </p>
                <p>
                  Time:{" "}
                  <strong>
                    {dayjs(
                      `${editingAppointment.date} ${editingAppointment.time}`
                    ).format("h:mm A")}
                  </strong>
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select New Date
              </label>
              <DatePicker
                value={editDate}
                onChange={setEditDate}
                disabledDate={disabledDate}
                className="w-full rounded-lg"
                format="MMMM DD, YYYY"
                size="large"
              />
              <div className="mt-2 text-xs text-gray-500">
                Available days: Tuesday, Wednesday, Friday
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select New Time
              </label>
              <TimePicker
                value={editTime}
                onChange={setEditTime}
                format="HH:mm"
                className="w-full rounded-lg"
                size="large"
                showNow={false}
                disabledHours={() => {
                  const disabled = [];
                  for (let i = 0; i < 10; i++) disabled.push(i);
                  for (let i = 11; i < 14; i++) disabled.push(i);
                  for (let i = 15; i < 16; i++) disabled.push(i);
                  for (let i = 17; i < 24; i++) disabled.push(i);
                  return disabled;
                }}
              />
              <div className="mt-2 text-xs text-gray-500">
                Available times: 10:00 AM, 2:00 PM, 4:00 PM
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AppointmentDashboard;
