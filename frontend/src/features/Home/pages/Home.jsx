import React, {useState, useEffect, Suspense, useCallback, lazy, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  Bookings,
  Employees,
  MostBookedRoom,
  MonthlyBookingStatics,
} from "../graphql/queries";
import DataGrid from "../../../shared/components/grid/DataGrid";
import "./Home.css";
import HomeShimmer from "../components/HomeShimmer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/hooks/useAuth";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { usePagination } from "../../../shared/hooks/usePagination";
import { usePermission } from "../../../shared/hooks/usePermission";
import { Can } from "../../../shared/components/Can";
import {
  DeleteEmployees,
  UpdateEmployee,
} from "../../Employee/graphql/mutation";
import { GetAllRoles } from "../../../shared/services/queries";

const ViewOwnBookings = lazy(
  () => import("../../Bookings/pages/ViewOwnBookings"),
);

const employeeColumns = [
  { field: "id", headerName: "ID", editable: false },
  { field: "firstName", headerName: "First Name" },
  { field: "lastName", headerName: "Last Name" },
  { field: "email", headerName: "Email" },
];

const bookingColumns = [
  { field: "id", headerName: "Booking ID", editable: false },
  {
    field: "meetingRoom",
    headerName: "Room Name",
    editable: false,
    render: (meetingRoom) => <span>{meetingRoom?.name || "N/A"}</span>,
  },
  {
    field: "employee",
    headerName: "Booked By",
    editable: false,
    render: (employee) => (
      <span>
        {employee ? `${employee.firstName} ${employee.lastName}` : "N/A"}
      </span>
    ),
  },
  { field: "purpose", headerName: "Purpose", editable: false },
  {
    field: "status",
    headerName: "Status",
    editable: false,
    filterOptions: [
      "PENDING",
      "APPROVED",
      "REJECTED",
      "COMPLETED",
      "CANCELLED",
    ],
    render: (value) => (
      <span className={`status-text ${value?.toLowerCase()}`}>{value}</span>
    ),
  },
];

const Home = () => {
  const { user } = useAuth();
  const roles = user?.roles;
  const navigate = useNavigate();

  const { hasPermission } = usePermission();
  const viewEmployee = hasPermission("VIEW_EMPLOYEE");
  const viewAllBooking = hasPermission("VIEW_ALL_BOOKINGS");
  const viewMonthlyStatics = hasPermission("VIEW_MONTHLY_STATICS");

  const [searchInput, setSearchInput] = useState("");
  const [empSort, setEmpSort] = useState("DESC");

  const [localEmployees, setLocalEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employeeRoleFilter, setEmployeeRoleFilter] = useState("");

  const {
    currentPage: empPage,
    pageSize: empLimit,
    goToPage: goToEmpPage,
    setPageSize: setEmpPageSize,
    setTotalRecords: setEmpTotalRecords,
  } = usePagination({ initialPageSize: 5, initialPage: 1 });

  const [bookingStatus, setBookingStatus] = useState("");
  const [bookingSort, setBookingSort] = useState("DESC");
  const [localBookings, setLocalBookings] = useState([]);

  const {
    currentPage: bookingPage,
    pageSize: bookingLimit,
    goToPage: goToBookingPage,
    setPageSize: setBookingPageSize,
    setTotalRecords: setBookingTotalRecords,
  } = usePagination({ initialPageSize: 5, initialPage: 1 });

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [statsYear, setStatsYear] = useState(currentYear);
  const [statsMonth, setStatsMonth] = useState(currentMonth);

  const debouncedSearch = useDebounce(searchInput, 500);

  const {
    data: employeesData,
    loading: loadingEmp,
    refetch: refetchEmployees,
  } = useQuery(Employees, {
    variables: {
      input: {
        page: empPage,
        limit: empLimit,
        searchTerm: debouncedSearch,
        sortOrder: empSort,
        role: employeeRoleFilter || null,
      },
    },
    skip: !viewEmployee,
    fetchPolicy: "network-only",
  });
  const employees = employeesData?.employees?.data || [];
  const totalEmployeesCount = employeesData?.employees?.total || 0;

  useEffect(() => {
    if (!loadingEmp && employeesData?.employees?.data) {
      setLocalEmployees(employeesData.employees.data);
      setEmpTotalRecords(totalEmployeesCount);
    }
  }, [totalEmployeesCount, loadingEmp, employeesData, setEmpTotalRecords]);

  useEffect(() => {
    goToEmpPage(1);
  }, [debouncedSearch, empSort, employeeRoleFilter]);

  const { data: bookingData, loading: loadingBookings } = useQuery(Bookings, {
    variables: {
      input: {
        page: bookingPage,
        limit: bookingLimit,
        bookingStatus: bookingStatus || null,
        sortOrder: bookingSort,
      },
    },
    skip: !viewAllBooking,
    fetchPolicy: "network-only",
  });
  const bookings = bookingData?.bookings?.data || [];
  const totalBookingsCount = bookingData?.bookings?.total || 0;

  useEffect(() => {
    if (!loadingBookings && bookingData?.bookings?.data) {
      setLocalBookings(bookingData.bookings.data);
      setBookingTotalRecords(totalBookingsCount);
    }
  }, [
    totalBookingsCount,
    loadingBookings,
    bookingData,
    setBookingTotalRecords,
  ]);

  useEffect(() => {
    goToBookingPage(1);
  }, [bookingStatus, bookingSort]);

  const { data: mostBookedRoomData, loading: loadingMostBookedRoom } =
    useQuery(MostBookedRoom);

  const { data: monthlyStatsData, loading: loadingMonthlyStatics } = useQuery(
    MonthlyBookingStatics,
    {
      variables: {
        input: {
          year: Number(statsYear),
          month: Number(statsMonth),
        },
      },
      skip: !viewMonthlyStatics,
      fetchPolicy: "network-only",
    },
  );
  const monthlyStats = monthlyStatsData?.monthlyBookingStatics;

  const handleSearchInput = useCallback((term) => {
    setSearchInput(term);
  }, []);

  const handleEmpSortToggle = useCallback((field, direction) => {
    setEmpSort(direction);
  }, []);

  const handleEmpPageChange = useCallback(
    (newPage) => {
      goToEmpPage(newPage);
    },
    [goToEmpPage],
  );

  const handleEmpLimitChange = useCallback(
    (newLimit) => {
      setEmpPageSize(newLimit);
    },
    [setEmpPageSize],
  );

  const handleEmployeeColumnFilterChange = useCallback((filters) => {
    setEmployeeRoleFilter(filters.userRoles || "");
  }, []);

  const handleBookingColumnFilterChange = useCallback((filters) => {
    setBookingStatus(filters.status || "");
  }, []);

  const handleBookingSortToggle = useCallback((field, direction) => {
    setBookingSort(direction);
  }, []);

  const handleBookingPageChange = useCallback(
    (newPage) => {
      goToBookingPage(newPage);
    },
    [goToBookingPage],
  );

  const handleBookingLimitChange = useCallback(
    (newLimit) => {
      setBookingPageSize(newLimit);
    },
    [setBookingPageSize],
  );

  const [mutateUpdateEmployee] = useMutation(UpdateEmployee);
  const [mutateDeleteEmployees] = useMutation(DeleteEmployees);
  const { data: rolesData } = useQuery(GetAllRoles);
  const roleOptions = rolesData?.getAllRoles?.map((r) => r.role_name) || [];

  const handleBulkDeleteEmployees = useCallback(async () => {
    try {
      const targetIds = selectedEmployees.map((id) => Number(id));
      const { data } = await mutateDeleteEmployees({
        variables: { ids: targetIds },
      });
      if (data?.deleteEmployees) {
        setSelectedEmployees([]);
        refetchEmployees();
      }
    } catch (err) {
      console.error("Bulk delete failed:", err);
    }
  }, [selectedEmployees, mutateDeleteEmployees, refetchEmployees]);

  const handleCellSave = useCallback(
    async (rowId, field, updatedValue) => {
      try {
        const targetRow = localEmployees.find((emp) => emp.id === rowId);
        if (!targetRow) return;

        const inputVariables = {
          id: Number(rowId),
          firstName: field === "firstName" ? updatedValue : targetRow.firstName,
          lastName: field === "lastName" ? updatedValue : targetRow.lastName,
          email: field === "email" ? updatedValue : targetRow.email,
        };

        const { data } = await mutateUpdateEmployee({
          variables: { input: inputVariables },
        });

        if (data?.updateEmployee) {
          setLocalEmployees((prev) =>
            prev.map((row) =>
              row.id === rowId ? { ...row, [field]: updatedValue } : row,
            ),
          );
        }
      } catch (err) {
        console.error("Inline save failed:", err);
      }
    },
    [localEmployees, mutateUpdateEmployee],
  );

  const combinedEmpColumns = useMemo(() => {
    const roleColumn = {
      field: "userRoles",
      headerName: "Roles",
      editable: false,
      filterOptions: roleOptions,
      render: (userRoles) => (
        <div>
          {userRoles?.map((ur) => (
            <span
              key={ur?.id}
              className="role-badge"
              style={{ marginRight: "4px" }}
            >
              {ur?.role?.role_name}
            </span>
          ))}
        </div>
      ),
    };

    const empActionColumn = {
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
              navigate(`/employeeDetails/${row.id}`);
            }}
          >
            View
          </button>
        </div>
      ),
    };

    return [...employeeColumns, roleColumn, empActionColumn];
  });

  const combinedBookingColumns = useMemo(() => {
    const bookingActionColumn = {
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
    return [...bookingColumns, bookingActionColumn];
  });

  if (
    !user &&
    (loadingBookings ||
      loadingEmp ||
      loadingMonthlyStatics ||
      loadingMostBookedRoom)
  ) {
    return <HomeShimmer />;
  }
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name || "User"}</h1>
          <p className="welcome-subtext">Here is what is happening today.</p>
        </div>
        <span className="role-badge">
          {user?.roles.map((role, index) => {
            return <span key={index}> {role}</span>;
          })}
        </span>
      </header>

      <section className="global-stats-section">
        <div className="room-stats-card">
          <h2>Most Booked Room</h2>
          <div className="room-badge">
            {mostBookedRoomData?.mostBookedRoom?.name || "N/A"}
          </div>
          <p className="room-total-text">
            Total Bookings:{" "}
            <span>{mostBookedRoomData?.mostBookedRoom?.total || 0}</span>
          </p>
        </div>

        <div className="employee-info-card">
          <h2>My Quick Profile</h2>
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
          <p>
            Roles:
            {user?.roles.map((role, index) => {
              return <span key={index}> {role}</span>;
            })}
          </p>
        </div>

        <Can permission="VIEW_MONTHLY_STATICS">
          <div className="room-stats-card stats-analytics-card full-row-card">
            <div className="card-header-inline">
              <h2>Monthly Statistics</h2>
              <input
                type="month"
                className="stats-date-picker"
                max={`${currentYear}-${String(currentMonth).padStart(2, "0")}`}
                value={`${statsYear}-${String(statsMonth).padStart(2, "0")}`}
                onChange={(e) => {
                  if (e.target.value) {
                    const [y, m] = e.target.value.split("-");
                    setStatsYear(Number(y));
                    setStatsMonth(Number(m));
                  }
                }}
              />
            </div>
            <div className="stats-row">
              <div className="stat-item">
                <span className="stat-label">Total</span>
                <span className="stat-value">
                  {monthlyStats?.totalBookings || 0}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label text-success">Approved</span>
                <span className="stat-value">
                  {monthlyStats?.approvedBookings || 0}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label text-danger">Rejected</span>
                <span className="stat-value">
                  {monthlyStats?.rejectedBookings || 0}
                </span>
              </div>
            </div>
          </div>
        </Can>
      </section>

      <Can permission="VIEW_OWN_BOOKINGS">
        <div className="single-column-layout">
          <Suspense
            fallback={
              <div className="loading-placeholder">
                Loading Your Bookings...
              </div>
            }
          >
            <ViewOwnBookings />
          </Suspense>
        </div>
      </Can>

      {(viewEmployee || viewAllBooking) && (
        <section className="management-section">
          <Can permission="VIEW_EMPLOYEE">
            <div className="management-card">
              <div className="management-card-header">
                <h2>Employee Management</h2>
              </div>

              <DataGrid
                columns={combinedEmpColumns}
                data={localEmployees}
                loading={loadingEmp}
                page={empPage}
                limit={empLimit}
                totalCount={totalEmployeesCount}
                sortBy="id"
                sortDirection={empSort}
                selectionMode="multi"
                selectedRows={selectedEmployees}
                onSelectionChange={setSelectedEmployees}
                onSortToggle={handleEmpSortToggle}
                onPageChange={handleEmpPageChange}
                onLimitChange={handleEmpLimitChange}
                onSearchChange={handleSearchInput}
                onFilterChange={handleEmployeeColumnFilterChange}
                onBulkDelete={handleBulkDeleteEmployees}
                onCellSave={handleCellSave}
              />
            </div>
          </Can>

          <Can permission="VIEW_ALL_BOOKINGS">
            <div className="management-card">
              <div className="management-card-header">
                <h2>Booking Logs</h2>
              </div>

              <DataGrid
                columns={combinedBookingColumns}
                data={localBookings}
                loading={loadingBookings}
                page={bookingPage}
                limit={bookingLimit}
                totalCount={totalBookingsCount}
                sortBy="id"
                sortDirection={bookingSort}
                onSortToggle={handleBookingSortToggle}
                onPageChange={handleBookingPageChange}
                onLimitChange={handleBookingLimitChange}
                onFilterChange={handleBookingColumnFilterChange}
              />
            </div>
          </Can>
        </section>
      )}
    </div>
  );
};

export default Home;
