import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useQuery } from "@apollo/client/react";
import { Bookings, Employees, MostBookedRoom, MonthlyBookingStatics } from "../graphql/queries";
import EmployeeCard from "../components/Employee/EmployeeCard";
import BookingCard from "../components/Booking/BookingCard";
import ViewOwnBookings from "./BookingPages/ViewOwnBookings";
import "./Home.css";

const Home = () => {
  const { user } = useContext(AuthContext)
  const roles = user?.roles

  const [searchTerm, setSearchTerm] = useState("")
  const [empPage, setEmpPage] = useState(1)

  const [bookingStatus, setBookingStatus] = useState("")
  const [bookingPage, setBookingPage] = useState(1)

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  const [statsYear, setStatsYear] = useState(currentYear)
  const [statsMonth, setStatsMonth] = useState(currentMonth)

  const { data: employeesData } = useQuery(Employees, {
    variables: { 
      input:{
        page: empPage, 
        limit: 5, 
        searchTerm: searchTerm
      } 
    },
    skip: roles.includes('employee'),
    fetchPolicy: 'network-only'
  })
  const employees = employeesData?.employees?.data || []

  const { data: bookingData } = useQuery(Bookings, {
    variables: {
      input:{
        page: bookingPage,
        limit: 5,
        bookingStatus: bookingStatus || null,
      }
    },
    skip: roles.includes('employee'),
    fetchPolicy: 'network-only'
  })
  const bookings = bookingData?.bookings?.data || []

  const { data: mostBookedRoomData } = useQuery(MostBookedRoom)

  const { data: monthlyStatsData } = useQuery(MonthlyBookingStatics, {
    variables: {
      input:{
        year: Number(statsYear),
        month: Number(statsMonth),
      }
    },
    skip: roles.includes('employee'),
    fetchPolicy: "network-only",
  })
  const monthlyStats = monthlyStatsData?.monthlyBookingStatics

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name || "User"}</h1>
          <p className="welcome-subtext">Here is what is happening today.</p>
        </div>
        <span className="role-badge">
            {user?.roles.map( (role, index) => {
              return <span key={index}> {role}</span>
            })}
        </span>
      </header>

      <section className="global-stats-section">
        <div className="room-stats-card">
          <h3>Most Booked Room</h3>
          <div className="room-badge">
            {mostBookedRoomData?.mostBookedRoom?.name || "N/A"}
          </div>
          <p className="room-total-text">
            Total Bookings:{" "}
            <span>{mostBookedRoomData?.mostBookedRoom?.total || 0}</span>
          </p>
        </div>

        <div className="employee-info-card">
          <h3>My Quick Profile</h3>
          <p className="welcome-subtext">Registered Email Address Context:</p>
          <strong
            style={{
              color: "#0f172a",
              display: "block",
              margin: "4px 0 16px 0",
            }}
          >
            {user?.email || "N/A"}
          </strong>
          <p>Roles: 
            {user?.roles.map( (role, index) => {
              return <span key={index}>{role} || </span>
            })}
          </p>
        </div>

        {(roles.includes('manager')) && (
          <div className="room-stats-card stats-analytics-card full-row-card">
            <div className="card-header-inline">
              <h3>Monthly Statistics</h3>
              <input 
                type="month" 
                className="stats-date-picker"
                max={`${currentYear}-${String(currentMonth).padStart(2, '0')}`} 
                value={`${statsYear}-${String(statsMonth).padStart(2, '0')}`}
                onChange={(e) => {
                  if (e.target.value) {
                    const [y, m] = e.target.value.split("-")
                    setStatsYear(Number(y))
                    setStatsMonth(Number(m))
                  }
                }}
              />
            </div>
            <div className="stats-row">
              <div className="stat-item">
                <span className="stat-label">Total</span>
                <span className="stat-value">{monthlyStats?.totalBookings || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label text-success">Approved</span>
                <span className="stat-value">{monthlyStats?.approvedBookings || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label text-danger">Rejected</span>
                <span className="stat-value">{monthlyStats?.rejectedBookings || 0}</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {roles.includes('employee') && (
        <div className="single-column-layout">
          <ViewOwnBookings />
        </div>
      )}

      {(roles.includes('admin') || roles.includes('manager')) && (
        <div className="dashboard-grid">
          <section className="dashboard-section">
            <div className="section-header">
              <h2>Team Members</h2>
              <input
                type="text"
                placeholder="Search by name..."
                className="filter-input"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setEmpPage(1);
                }}
              />
            </div>
            <div className="cards-list">
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <EmployeeCard key={employee.id} employee={employee} />
                ))
              ) : (
                <p className="empty-message">No employees found.</p>
              )}
            </div>
            <div className="pagination-controls">
              <button
                disabled={empPage === 1}
                onClick={() => setEmpPage((prev) => prev - 1)}
              >
                Previous
              </button>
              <span>Page {empPage}</span>
              <button
                disabled={employees.length < 5}
                onClick={() => setEmpPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </section>

          <section className="dashboard-section">
            <div className="section-header">
              <h2>Recent Bookings</h2>
              <select
                className="filter-select"
                value={bookingStatus}
                onChange={(e) => {
                  setBookingStatus(e.target.value);
                  setBookingPage(1);
                }}
              >
                <option value="">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div className="cards-list">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <p className="empty-message">No bookings found.</p>
              )}
            </div>
            <div className="pagination-controls">
              <button
                disabled={bookingPage === 1}
                onClick={() => setBookingPage((prev) => prev - 1)}
              >
                Previous
              </button>
              <span>Page {bookingPage}</span>
              <button
                disabled={bookings.length < 5}
                onClick={() => setBookingPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default Home