"use client";

import type React from "react";
import { useState } from "react";
import {
  Card,
  DatePicker,
  TimePicker,
  Button,
  Alert,
  message as msg,
  Row,
  Col,
} from "antd";
import { motion } from "framer-motion";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs, { type Dayjs } from "dayjs";
import { useAuth } from "../context/AuthContext";
import { requestHandler } from "../lib/requestHandler";
import type {
  BookAppointmentPayload,
  ApiResponse,
  Appointment,
} from "../lib/types";

interface AppointmentBookingProps {
  onSuccess?: () => void;
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  onSuccess,
}) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, contextHolder] = msg.useMessage();

  // Available time slots (9 AM to 5 PM)
  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  // Check if date is allowed (Tuesday, Wednesday, Friday)
  const isDateAllowed = (date: Dayjs) => {
    const day = date.day();
    return day === 2 || day === 3 || day === 5; // Tuesday=2, Wednesday=3, Friday=5
  };

  const disabledDate = (current: Dayjs) => {
    // Disable past dates and non-allowed days
    return (
      current && (current < dayjs().startOf("day") || !isDateAllowed(current))
    );
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !user) {
      message.warning("Please select both date and time");
      return;
    }

    setLoading(true);
    try {
      const payload: BookAppointmentPayload = {
        patientId: user.id,
        selectedDate: selectedDate.format("YYYY-MM-DD"),
        selectedTime: selectedTime.format("HH:mm"),
      };

      const response: ApiResponse<Appointment[]> = await requestHandler({
        method: "POST",
        endpoint: "/api/appointments/book",
        data: payload,
      });

      if (response.success) {
        message.success(
          "Appointment booked successfully! All 3 sessions have been scheduled."
        );
        setSelectedDate(null);
        setSelectedTime(null);

        // Show details of all booked sessions
        const sessions = response.data;
        message.info({
          content: (
            <div>
              <p className="font-medium mb-2">Your treatment sessions:</p>
              {sessions.map((session) => (
                <div key={session.id} className="text-sm py-1">
                  <span className="font-medium">
                    Session {session.session}:
                  </span>{" "}
                  {dayjs(session.date).format("MMM DD, YYYY")} at {session.time}
                </div>
              ))}
            </div>
          ),
          duration: 8,
        });

        onSuccess?.();
      } else {
        message.error(response.message || "Failed to book appointment");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to book appointment";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {contextHolder}
      <Alert
        message="Special Treatment Booking"
        description="Book your first session and we'll automatically schedule your 2 follow-up sessions at 2-week intervals. Appointments are available on Tuesday, Wednesday, and Friday only."
        type="info"
        showIcon
        className="border-blue-200 bg-blue-50"
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card
            title={
              <span className="flex items-center space-x-2">
                <CalendarOutlined className="text-blue-600" />
                <span>Select Date</span>
              </span>
            }
            className="h-full shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200"
          >
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              disabledDate={disabledDate}
              className="w-full"
              size="large"
              placeholder="Choose appointment date"
              format="MMMM DD, YYYY"
            />
            <div className="mt-4 text-sm text-gray-600">
              <p className="font-medium mb-2">Available Days:</p>
              <div className="flex flex-wrap gap-2">
                {["Tuesday", "Wednesday", "Friday"].map((day) => (
                  <span
                    key={day}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title={
              <span className="flex items-center space-x-2">
                <ClockCircleOutlined className="text-blue-600" />
                <span>Select Time</span>
              </span>
            }
            className="h-full shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200"
          >
            <TimePicker
              style={{ width: "100%" }}
              format="HH:mm"
              value={selectedTime}
              onChange={setSelectedTime}
              hourStep={1}
              showNow={false}
              placeholder="Choose appointment time"
              disabledHours={() => {
                const disabled = [];
                for (let i = 0; i < 9; i++) disabled.push(i);
                for (let i = 18; i < 24; i++) disabled.push(i);
                return disabled;
              }}
              disabledMinutes={() =>
                Array.from({ length: 60 }, (_, i) => i).filter((i) => i !== 0)
              }
            />

            <div className="mt-4 text-sm text-gray-600">
              <p className="font-medium mb-2">Available Times:</p>
              <div className="grid grid-cols-3 gap-1">
                {timeSlots.map((time) => (
                  <span
                    key={time}
                    className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs text-center font-medium"
                  >
                    {time}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {selectedDate && selectedTime && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          <p className="text-sm text-gray-600 mb-2">Selected Appointment:</p>
          <p className="font-medium text-gray-800 text-lg">
            {selectedDate.format("MMMM DD, YYYY")} at{" "}
            {selectedTime.format("HH:mm")}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            This will schedule your first session. Follow-up sessions will be
            automatically scheduled.
          </p>
        </motion.div>
      )}

      <div className="text-center pt-4">
        <Button
          type="primary"
          size="large"
          onClick={handleBookAppointment}
          loading={loading}
          disabled={!selectedDate || !selectedTime}
          className="px-8 py-2 h-12 bg-blue-600 hover:bg-blue-700 border-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
        >
          {loading ? "Booking..." : "Book Appointment"}
        </Button>
      </div>
    </div>
  );
};

export default AppointmentBooking;
