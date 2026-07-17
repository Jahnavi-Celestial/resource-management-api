import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useQuery } from "@apollo/client/react";
import { ViewOwnBookings as ViewOwnBookingsQuery } from "../../graphql/queries";
import DataGrid from "../../components/DataGrid"; 
import "./ViewOwnBookings.css";

const ViewOwnBookings = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [sortOrder, setSortOrder] = useState("DESC")

  const { data, loading, refetch } = useQuery(ViewOwnBookingsQuery, {
    variables: {
      input:{
        page: page,
        limit: limit,
        bookingStatus: status || null,
        sortOrder: sortOrder
      }
    },
    skip: !user?.id,
    fetchPolicy: 'network-only'
  })

  const bookings = data?.viewOwnBooking?.data || []
  
  const totalCount = data?.viewOwnBooking?.total || 0

  const columns = [
    { key: "id", label: "Id" },
    { 
      key: "purpose", 
      label: "Purpose" 
    },
    { 
      key: "meetingRoom", 
      label: "Meeting Room",
      render: (value, row) => row.meetingRoom?.name || "N/A"
    },
    { 
      key: "startTime", 
      label: "Scheduled Date",
      render: (value) => value ? new Date(value).toLocaleDateString() : "N/A"
    },
    { 
      key: "status", 
      label: "Status",
      render: (value) => (
        <span className={`status-badge ${value?.toLowerCase() || "pending"}`}>
          {value || "PENDING"}
        </span>
      )
    },
  ];

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    setPage(1);
  };

  const handleRowClick = (row) => {
    if (row?.id) {
      navigate(`/bookingDetails/${row.id}`);
    }
  };

  return (
    <section className="own-bookings-section">
      <div className="section-header">
        <h2>Your Personal Bookings</h2>
        <select
          className="filter-select"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
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
        columns={columns}
        data={bookings}
        loading={loading}
        page={page}
        limit={limit}
        totalCount={totalCount}
        sortDirection={sortOrder}
        onSortToggle={handleSortToggle}
        onPageChange={(newPage) => setPage(newPage)}
        onLimitChange={(newLimit) => { 
          setLimit(newLimit);
          setPage(1);
        }}
        onRowClick={handleRowClick}
      />
    </section>
  )
}

export default ViewOwnBookings
