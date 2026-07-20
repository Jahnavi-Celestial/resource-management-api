import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { ViewOwnBookings as ViewOwnBookingsQuery } from "../../graphql/queries";
import DataGrid from "../../components/DataGrid"; 
import "./ViewOwnBookings.css";
import { useAuth } from "../../hooks/useAuth";
import { usePagination } from "../../hooks/usePagination";

const ViewOwnBookings = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [status, setStatus] = useState("")
  const [sortOrder, setSortOrder] = useState("DESC")

  const {
    currentPage: page,
    pageSize: limit,
    goToPage,
    setPageSize,
    setTotalRecords
  } = usePagination({ initialPageSize: 5, initialPage: 1 })

  const { data, loading } = useQuery(ViewOwnBookingsQuery, {
    variables: {
      input: {
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

  useEffect(() => {
    if (!loading && data?.viewOwnBooking) {
      setTotalRecords(totalCount);
    }
  }, [totalCount, loading, data, setTotalRecords]);

  useEffect(() => {
    goToPage(1)
  }, [status, sortOrder])

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
        onPageChange={(newPage) => goToPage(newPage)}
        onLimitChange={(newLimit) => setPageSize(newLimit)}
        onRowClick={handleRowClick}
      />
    </section>
  )
}

export default ViewOwnBookings
