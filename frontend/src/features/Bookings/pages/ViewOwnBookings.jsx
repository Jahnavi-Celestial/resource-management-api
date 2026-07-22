import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { ViewOwnBookings as ViewOwnBookingsQuery } from "../graphql/queries";
import DataGrid from "../../../shared/components/grid/DataGrid";
import "./ViewOwnBookings.css";
import { useAuth } from "../../Auth/hooks/useAuth";
import { usePagination } from "../../../shared/hooks/usePagination";

const columns = [
  { field: "id", headerName: "Id", editable: false },
  {
    field: "meetingRoom",
    headerName: "Meeting Room",
    editable: false,
    render: (_, row) => row.meetingRoom?.name || "N/A",
  },
  { field: "purpose", headerName: "Purpose", editable: false },
  {
    field: "startTime",
    headerName: "Scheduled Date",
    editable: false,
    render: (value) => (value ? new Date(value).toLocaleDateString() : "N/A"),
  },
  {
    field: "status",
    headerName: "Status",
    editable: false,
    filterOptions: ["PENDING", "APPROVED", "REJECTED", "COMPLETED", "CANCELLED"],
    render: (value) => (
      <span className={`status-badge ${value?.toLowerCase() || "pending"}`}>
        {value || "PENDING"}
      </span>
    ),
  },
];

const ViewOwnBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [status, setStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("DESC");

  const {
    currentPage: page,
    pageSize: limit,
    goToPage,
    setPageSize,
    setTotalRecords,
  } = usePagination({ initialPageSize: 5, initialPage: 1 });

  const { data, loading } = useQuery(ViewOwnBookingsQuery, {
    variables: {
      input: {
        page: page,
        limit: limit,
        bookingStatus: status || null,
        sortOrder: sortOrder,
      },
    },
    skip: !user?.id,
    fetchPolicy: "network-only",
  });

  const bookings = data?.viewOwnBooking?.data || [];

  const totalCount = data?.viewOwnBooking?.total || 0;

  useEffect(() => {
    if (!loading && data?.viewOwnBooking) {
      setTotalRecords(totalCount);
    }
  }, [totalCount, loading, data, setTotalRecords]);

  useEffect(() => {
    goToPage(1);
  }, [status, sortOrder]);

  let combinedColumns = useMemo(() => {
    const actionColumn = {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      editable: false,
      render: (_, row) => (
        <div className="action-buttons-cell">
          <button
            className="btn-inline-action btn-inline-view"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/bookingDetails/${row.id}`);
            }}
          >
            View
          </button>
        </div>
      ),
    };
    return [...columns, actionColumn];
  }, [navigate]);

  const handleSortToggle = useCallback((field, direction) => {
    setSortOrder(direction);
  }, []);

  const handlePageChange = useCallback(
    (newPage) => {
      goToPage(newPage);
    },
    [goToPage],
  );

  const handleLimitChange = useCallback(
    (newLimit) => {
      setPageSize(newLimit);
    },
    [setPageSize],
  );

  const handleColumnFilterChange = useCallback((filters) => {
    setStatus(filters.status);
  }, []);

  return (
    <section className="own-bookings-section">
      <div className="section-header">
        <h2>Your Personal Bookings</h2>
      </div>

      <DataGrid
        columns={combinedColumns}
        data={bookings}
        loading={loading}
        page={page}
        limit={limit}
        totalCount={totalCount}
        sortBy="id"
        sortDirection={sortOrder}
        onSortToggle={handleSortToggle}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onFilterChange={handleColumnFilterChange}
      />
    </section>
  );
};

export default ViewOwnBookings;
