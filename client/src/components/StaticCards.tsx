import dayjs from "dayjs";
import type { Appointment } from "../lib/types";
import { Row, Col, Card } from "antd";
import { motion } from "framer-motion";
import { Calendar1, CheckCircle, Clock } from "lucide-react";

const StaticCards = ({ appointments }: { appointments: Appointment[] }) => {
  // Calculate statistics
  const completedSessions = appointments.filter((apt) =>
    dayjs(`${apt.date} ${apt.time}`).isBefore(dayjs())
  ).length;

  const upcomingSessions = appointments.filter((apt) =>
    dayjs(`${apt.date} ${apt.time}`).isAfter(dayjs())
  ).length;

  const nextAppointment = appointments
    .filter((apt) => dayjs(`${apt.date} ${apt.time}`).isAfter(dayjs()))
    .sort((a, b) =>
      dayjs(`${a.date} ${a.time}`).diff(dayjs(`${b.date} ${b.time}`))
    )[0];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Treatment Dashboard
        </h1>
        <p className="text-gray-600">
          Track your progress and upcoming sessions
        </p>
      </div>

      {/* Statistics Cards */}
      {appointments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Row gutter={[24, 24]}>
            {/* Treatment Progress */}
            <Col xs={24} sm={24} md={8}>
              <div className="bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 text-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <Card
                  bordered={false}
                  className="bg-transparent shadow-none"
                  style={{ background: "transparent" }}
                  bodyStyle={{
                    padding: "32px 24px",
                    background: "transparent",
                  }}
                >
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-white/20 rounded-full">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="text-sm font-medium text-white/90 mb-1">
                        Treatment Progress
                      </div>
                      <div className="text-4xl font-bold text-white">
                        {completedSessions}
                        <span className="text-2xl text-white/70 ml-1">/ 3</span>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-white/80">
                      {Math.round((completedSessions / 3) * 100)}% Complete
                    </div>
                  </div>
                </Card>
              </div>
            </Col>

            {/* Upcoming Sessions */}
            <Col xs={24} sm={24} md={8}>
              <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 text-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <Card
                  bordered={false}
                  className="bg-transparent shadow-none"
                  style={{ background: "transparent" }}
                  bodyStyle={{
                    padding: "32px 24px",
                    background: "transparent",
                  }}
                >
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-white/20 rounded-full">
                        <Calendar1 className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="text-sm font-medium text-white/90 mb-1">
                        Upcoming Sessions
                      </div>
                      <div className="text-4xl font-bold text-white">
                        {upcomingSessions}
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-white/80">
                      {upcomingSessions === 1 ? "Session" : "Sessions"}{" "}
                      Remaining
                    </div>
                  </div>
                </Card>
              </div>
            </Col>

            {/* Next Session */}
            <Col xs={24} sm={24} md={8}>
              <div className="bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-500 text-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <Card
                  bordered={false}
                  className="bg-transparent shadow-none"
                  style={{ background: "transparent" }}
                  bodyStyle={{
                    padding: "32px 24px",
                    background: "transparent",
                  }}
                >
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-white/20 rounded-full">
                        <Clock className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="text-sm font-medium text-white/90 mb-1">
                        Next Session
                      </div>
                      {nextAppointment ? (
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-white">
                            {dayjs(nextAppointment.date).format("MMM DD")}
                          </div>
                          <div className="flex gap-2 w-full items-center justify-center font-medium">
                            <div className="text-lg font-medium text-white/90">
                              {dayjs(
                                `${nextAppointment.date} ${nextAppointment.time}`
                              ).format("h:mm A")}
                            </div>
                            <div className="text-white">
                              ( Session {nextAppointment.session} )
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-white/70 text-lg">
                          No upcoming sessions
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
        </motion.div>
      )}
    </div>
  );
};

export default StaticCards;
