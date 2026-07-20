import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { Bookings, Employees, MostBookedRoom, MonthlyBookingStatics } from "../graphql/queries";
import DataGrid from "../components/DataGrid";
import ViewOwnBookings from "./BookingPages/ViewOwnBookings";
import "./Home.css";
import HomeShimmer from "./ShimmerPages/HomeShimmer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useDebounce } from "../hooks/useDebounce";
import { usePagination } from "../hooks/usePagination";
import { usePermission } from "../hooks/usePermission";
import { Can } from "../components/Can";

const Home = () => {
  const { user } = useAuth()
  const roles = user?.roles
  const navigate = useNavigate()

  const { hasPermission } = usePermission()
  const viewEmployee = hasPermission("VIEW_EMPLOYEE")
  const viewAllBooking = hasPermission("VIEW_ALL_BOOKINGS")
  const viewMonthlyStatics = hasPermission("VIEW_MONTHLY_STATICS")

  const [searchInput, setSearchInput] = useState("")
  const [empSort, setEmpSort] = useState("DESC")

  const {
    currentPage: empPage,
    pageSize: empLimit,
    goToPage: goToEmpPage,
    setPageSize: setEmpPageSize,
    setTotalRecords: setEmpTotalRecords
  } = usePagination({ initialPageSize: 5, initialPage: 1 })

  const [bookingStatus, setBookingStatus] = useState("")
  const [bookingSort, setBookingSort] = useState("DESC")

  const {
    currentPage: bookingPage,
    pageSize: bookingLimit,
    goToPage: goToBookingPage,
    setPageSize: setBookingPageSize,
    setTotalRecords: setBookingTotalRecords
  } = usePagination({ initialPageSize: 5, initialPage: 1 })

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  const [statsYear, setStatsYear] = useState(currentYear)
  const [statsMonth, setStatsMonth] = useState(currentMonth)

  const debouncedSearch = useDebounce(searchInput, 500)

  const { data: employeesData, loading: loadingEmp } = useQuery(Employees, {
    variables: { 
      input:{
        page: empPage, 
        limit: empLimit,
        searchTerm: debouncedSearch,
        sortOrder: empSort
      }
    },
    skip: !viewEmployee,
    fetchPolicy: 'network-only'
  })
  const employees = employeesData?.employees?.data || []
  const totalEmployeesCount = employeesData?.employees?.total || 0

  useEffect(() => {
    if (!loadingEmp && employeesData?.employees) {
      setEmpTotalRecords(totalEmployeesCount);
    }
  }, [totalEmployeesCount, loadingEmp, employeesData, setEmpTotalRecords]);
  
  useEffect(() => {
    goToEmpPage(1)
  }, [debouncedSearch, empSort])

  const { data: bookingData, loading: loadingBookings } = useQuery(Bookings, {
    variables: {
      input:{
        page: bookingPage,
        limit: bookingLimit,
        bookingStatus: bookingStatus || null,
        sortOrder: bookingSort
      }
    },
    skip: !viewAllBooking,
    fetchPolicy: 'network-only'
  })
  const bookings = bookingData?.bookings?.data || []
  const totalBookingsCount = bookingData?.bookings?.total || 0

  useEffect(() => {
    if (!loadingBookings && bookingData?.bookings) {
      setBookingTotalRecords(totalBookingsCount);
    }
  }, [totalBookingsCount, loadingBookings, bookingData, setBookingTotalRecords]);
  
  useEffect(() => {
    goToBookingPage(1)
  }, [bookingStatus, bookingSort])

  const { data: mostBookedRoomData, loading: loadingMostBookedRoom } = useQuery(MostBookedRoom)

  const { data: monthlyStatsData, loading: loadingMonthlyStatics } = useQuery(MonthlyBookingStatics, {
    variables: {
      input:{
        year: Number(statsYear),
        month: Number(statsMonth),
      }
    },
    skip: !viewMonthlyStatics,
    fetchPolicy: "network-only",
  })
  const monthlyStats = monthlyStatsData?.monthlyBookingStatics

  const employeeColumns = [
    { key: "id", label: "ID" },
    {
      key: "name",
      label: "Name",
      render: (_, row) => <span>{`${row?.firstName || ""} ${row?.lastName || ""}`.trim()}</span>
    },
    { key: "email", label: "Email" },
    {
      key: "userRoles",
      label: "Roles",
      render: (userRoles) => (
        <div>
          {userRoles?.map((ur) => (
            <span key={ur?.id} className="role-badge" style={{ marginRight: "4px" }}>
              {ur?.role?.role_name}
            </span>
          ))}
        </div>
      )
    }
  ]

  const bookingColumns = [
    { key: "id", label: "Booking ID" },
    {
      key: "meetingRoom",
      label: "Room Name",
      render: (meetingRoom,row) => <span>{meetingRoom?.name || "N/A"}</span>
    },
    {
      key: "employee",
      label: "Booked By",
      render: (employee,row) => <span>{employee ? `${employee.firstName} ${employee.lastName}` : "N/A"}</span>
    },
    { key: "purpose", label: "Purpose" },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span className={`status-text ${value?.toLowerCase()}`}>
          {value}
        </span>
      )
    }
  ]

  const handleEmployeeRowClick = (row) => {
    if (row?.id) {
      navigate(`/employeeDetails/${row.id}`);
    }
  }

  const handleBookingRowClick = (row) => {
    if (row?.id) {
      navigate(`/bookingDetails/${row.id}`);
    }
  }

  if(loadingBookings || loadingEmp || loadingMonthlyStatics || loadingMostBookedRoom){
    return <HomeShimmer />
  }
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
              return <span key={index}> {role}</span>
            })}
          </p>
        </div>

        <Can permission="VIEW_MONTHLY_STATICS">
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
        </Can>
      </section>

      <Can permission="VIEW_OWN_BOOKINGS">
        <div className="single-column-layout">
          <ViewOwnBookings />
        </div>
      </Can>

      {(viewEmployee || viewAllBooking) && (
        <section className="management-section">
          <Can permission="VIEW_EMPLOYEE">
          <div className="management-card">
            <div className="management-card-header">
              <h2>Employee Management</h2>
              <input
                className="filter-input management-input"
                type="text"
                placeholder="Search employees..."
                value={searchInput} 
                onChange={(e) => setSearchInput(e.target.value)}
              />
              </div>
              <DataGrid
                columns={employeeColumns}
                data={employees}
                loading={loadingEmp}
                page={empPage}
                limit={empLimit}
                totalCount={totalEmployeesCount}
                sortDirection={empSort}
                onSortToggle={() => setEmpSort((prev) => (prev === "DESC" ? "ASC" : "DESC"))}
                onPageChange={(newPage) => goToEmpPage(newPage)}
                onLimitChange={(newLimit) => setEmpPageSize(newLimit)}
                onRowClick={handleEmployeeRowClick}
            />
          </div>
          </Can>
    
          <Can permission="VIEW_ALL_BOOKINGS">
          <div className="management-card">
            <div className="management-card-header">
              <h2>Booking Logs</h2>
              <select
                className="filter-select management-select-input"
                value={bookingStatus}
                onChange={(e) => {
                setBookingStatus(e.target.value);
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
            <DataGrid
              columns={bookingColumns}
              data={bookings}
              loading={loadingBookings}
              page={bookingPage}
              limit={bookingLimit}
              totalCount={totalBookingsCount}
              sortDirection={bookingSort}
              onSortToggle={() => setBookingSort((prev) => (prev === "DESC" ? "ASC" : "DESC"))}
              onPageChange={(newPage) => goToBookingPage(newPage)}
              onLimitChange={(newLimit) => setBookingPageSize(newLimit)}
              onRowClick={handleBookingRowClick}
            />
         </div>
         </Can>
        </section>
      )}
    </div>
  )
}

export default Home