import React, { useState, useEffect, Suspense, useCallback, lazy, useMemo, useRef } from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/client/react";
import {
  Bookings,
  Employees,
  MostBookedRoom,
  MonthlyBookingStatics,
} from "../graphql/queries";
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
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { filter } from "rxjs";
import { PermissionContext } from "../../../shared/context/PermissionContext";

const ViewOwnBookings = lazy(
  () => import("../../Bookings/pages/ViewOwnBookings"),
);

const bookingColumns = [
  { field: "id", headerName: "Booking ID", width: 120, editable: false, sortable: false },
  {
    field: "meetingRoom.name",
    headerName: "Room Name",
    editable: false,
    sortable: false,
    valueGetter: (params) => params.data?.meetingRoom?.name || "N/A"
  },
  {
    field: "employee",
    headerName: "Booked By",
    editable: false,
    sortable: false,
    valueGetter: (params) => {
      const emp = params.data?.employee;
      return emp ? `${emp.firstName} ${emp.lastName}` : "N/A";
    }
  },
  { field: "purpose", headerName: "Purpose", editable: false, sortable: false },
  {
    field: "status",
    headerName: "Status",
    editable: false,
    sortable: false,
    filter: true,
    filterParams: {
      filterOptions: ['equals'],
      maxNumConditions: 1,
    }
  },
];

const Home = () => {
  const { user } = useAuth();
  const roles = user?.roles;
  const navigate = useNavigate();

  const client = useApolloClient();

  const empGridRef = useRef(null);
  const bookingGridRef = useRef(null);

  const [empPageSize, setEmpPageSize] = useState(5);
  const [bookingPageSize, setBookingPageSize] = useState(5);

  const { hasPermission } = usePermission();
  const canEdit = hasPermission('UPDATE_EMPLOYEE');
  const viewEmployee = hasPermission("VIEW_EMPLOYEE");
  const viewAllBooking = hasPermission("VIEW_ALL_BOOKINGS");
  const viewMonthlyStatics = hasPermission("VIEW_MONTHLY_STATICS");

  const [searchInput, setSearchInput] = useState("");

  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [statsYear, setStatsYear] = useState(currentYear);
  const [statsMonth, setStatsMonth] = useState(currentMonth);

  const debouncedSearch = useDebounce(searchInput, 500);

  const [mutateUpdateEmployee] = useMutation(UpdateEmployee);
  const [mutateDeleteEmployees] = useMutation(DeleteEmployees);
  const { data: rolesData } = useQuery(GetAllRoles);
  const roleOptions = rolesData?.getAllRoles?.map((r) => r.role_name) || [];

  const { data: mostBookedRoomData, loading: loadingMostBookedRoom } = useQuery(MostBookedRoom);

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

  const handleSelectionChanged = useCallback((event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedIds = selectedNodes.map((node) => node.data?.id).filter(Boolean);
    setSelectedEmployees(selectedIds);
  }, []);

  const handleGridCellValueChanged = useCallback(async (event) => {
    const { data, colDef, newValue } = event;
    const field = colDef.field;
    try {
      await mutateUpdateEmployee({
        variables: {
          input: {
            id: Number(data.id),
            firstName: field === "firstName" ? newValue : data.firstName,
            lastName: field === "lastName" ? newValue : data.lastName,
            email: field === "email" ? newValue : data.email,
          },
        },
      });
    } catch (err) {
      console.error("Inline save failed:", err);
      if (empGridRef.current && empGridRef.current.api) {
        empGridRef.current.api.refreshInfiniteCache();
      }
    }
  }, [mutateUpdateEmployee]);

  const employeeColumns = [
    { field: "id", headerName: "ID", width: 80, editable: false, headerCheckboxSelection: true },
    {
      field: "firstName",
      headerName: "First Name",
      editable: canEdit,
      sortable: false,
      valueSetter: (params) => {
        const updatedData = { ...params.data };
        updatedData.firstName = params.newValue;
        params.node.setData(updatedData);
        return true;
      }
    },
    {
      field: "lastName",
      headerName: "Last Name",
      editable: canEdit,
      sortable: false,
      valueSetter: (params) => {
        const updatedData = { ...params.data };
        updatedData.lastName = params.newValue;
        params.node.setData(updatedData);
        return true;
      }
    },
    {
      field: "email",
      headerName: "Email",
      editable: canEdit,
      sortable: false,
      valueSetter: (params) => {
        const updatedData = { ...params.data };
        updatedData.email = params.newValue;
        params.node.setData(updatedData);
        return true;
      }
    },
    {
      field: "userRoles",
      headerName: "Roles",
      editable: false,
      sortable: false,
      filter: "agTextColumnFilter",
      filterParams: {
        filterOptions: ['equals'],
        maxNumConditions: 1,
      },
      cellRenderer: (params) => {
        const userRoles = params.data?.userRoles;
        return (
          <div>
            {userRoles?.map((ur) => (
              <span key={ur?.id} className="role-badge" style={{ marginRight: "4px" }}>
                {ur?.role?.role_name}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      editable: false,
      cellRenderer: (params) => (
        <div className="action-buttons-cell">
          <button
            className="btn-inline-action btn-inline-view"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/employeeDetails/${params.data.id}`);
            }}
          >
            View
          </button>
        </div>
      ),
    }
  ];

  const combinedBookingColumns = useMemo(() => {
    const bookingActionColumn = {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      editable: false,
      cellRenderer: (params) => (
        <div className="action-buttons-cell">
          <button
            className="btn-inline-action btn-inline-view"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/bookingDetails/${params.data.id}`);
            }}
          >
            View
          </button>
        </div>
      ),
    };
    return [...bookingColumns, bookingActionColumn];
  }, [navigate]);

  const getEmployeeDatasource = useCallback((currentSearchTerm, activeLimit) => {
    return {
      getRows: async (requestParams) => {
        const startRow = requestParams.startRow;

        const limit = activeLimit;
        const page = Math.floor(startRow / limit) + 1;

        let sortOrder = "DESC";
        const idSort = requestParams.sortModel?.find(s => s.colId === "id");
        if (idSort) {
          sortOrder = idSort.sort.toUpperCase();
        }

        let selectedRole = null;
        const filterModel = requestParams.filterModel || {};

        if (filterModel.userRoles && filterModel.userRoles.filter) {
          selectedRole = filterModel.userRoles.filter;
        }

        try {
          const { data } = await client.query({
            query: Employees,
            variables: {
              input: {
                page: page,
                limit: limit,
                sortOrder: sortOrder,
                searchTerm: currentSearchTerm || null,
                role: selectedRole || null
              },
            },
            fetchPolicy: "network-only",
          });

          const dataList = data?.employees?.data || [];
          const totalRows = data?.employees?.total || 0;
          requestParams.successCallback(dataList, totalRows);
        } catch (error) {
          console.error("Error fetching server-side employees", error);
          requestParams.failCallback();
        }
      }
    };
  }, [client]);

  useEffect(() => {
    if (empGridRef.current && empGridRef.current.api) {
      const freshDatasource = getEmployeeDatasource(debouncedSearch, empPageSize);
      empGridRef.current.api.setGridOption("datasource", freshDatasource);
    }
  }, [debouncedSearch, empPageSize, getEmployeeDatasource]);

  const onEmpGridReady = useCallback((params) => {
    if (!viewEmployee) return;
    const initialDatasource = getEmployeeDatasource(debouncedSearch, empPageSize);
    params.api.setGridOption("datasource", initialDatasource);
  }, [viewEmployee, getEmployeeDatasource, debouncedSearch, empPageSize]);

  const onEmpPaginationChanged = useCallback((event) => {
    if (event.newPageSize && empGridRef.current && empGridRef.current.api) {
      const currentSelectedSize = empGridRef.current.api.getGridOption("paginationPageSize");
      setEmpPageSize(currentSelectedSize);
    }
  }, []);

  const getBookingDatasource = useCallback((activeLimit) => {
    return {
      getRows: async (requestParams) => {
        const startRow = requestParams.startRow;

        const limit = activeLimit;
        const page = Math.floor(startRow / limit) + 1;

        let sortOrder = "DESC";
        const idSort = requestParams.sortModel?.find(s => s.colId === "id");
        if (idSort) {
          sortOrder = idSort.sort.toUpperCase();
        }

        let bookingStatus = null;
        if (requestParams.filterModel && requestParams.filterModel.status) {
          bookingStatus = requestParams.filterModel.status.filter;
        }

        try {
          const { data } = await client.query({
            query: Bookings,
            variables: {
              input: {
                page: page,
                limit: limit,
                sortOrder: sortOrder,
                bookingStatus: bookingStatus,
              },
            },
            fetchPolicy: "network-only",
          });

          const dataList = data?.bookings?.data || [];
          const totalRows = data?.bookings?.total || 0;
          requestParams.successCallback(dataList, totalRows);
        } catch (error) {
          console.error("Error fetching server-side bookings", error);
          requestParams.failCallback();
        }
      }
    };
  }, [client]);

  const onBookingGridReady = useCallback((params) => {
    if (!viewAllBooking) return;
    const initialDatasource = getBookingDatasource(bookingPageSize);
    params.api.setGridOption("datasource", initialDatasource);
  }, [viewAllBooking, getBookingDatasource, bookingPageSize]);

  const onBookingPaginationChanged = useCallback((event) => {
    if (event.newPageSize && bookingGridRef.current && bookingGridRef.current.api) {
      const currentSelectedSize = bookingGridRef.current.api.getGridOption("paginationPageSize");
      setBookingPageSize(currentSelectedSize);
    }
  }, []);

  const handleBulkDeleteEmployees = useCallback(async () => {
    try {
      const targetIds = selectedEmployees.map((id) => Number(id));
      const { data } = await mutateDeleteEmployees({
        variables: { ids: targetIds },
      });
      if (data?.deleteEmployees) {
        setSelectedEmployees([]);
        if (empGridRef.current && empGridRef.current.api) {
          empGridRef.current.api.refreshInfiniteCache();
        }
      }
    } catch (err) {
      console.error("Bulk delete failed:", err);
    }
  }, [selectedEmployees, mutateDeleteEmployees]);

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
                {selectedEmployees.length > 0 && (
                  <button className="btn-danger" onClick={handleBulkDeleteEmployees}>
                    Delete Selected ({selectedEmployees.length})
                  </button>
                )}
              </div>

              <div style={{ marginBottom: "12px" }}>
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchInput}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  className="stats-date-picker"
                  style={{ width: "250px" }}
                />
              </div>

              <div className="ag-theme-quartz" style={{ height: 250, width: "100%" }}>
                <AgGridReact
                  key={`emp-grid-${empPageSize}`}
                  ref={empGridRef}
                  columnDefs={employeeColumns}
                  rowModelType="infinite"
                  onGridReady={onEmpGridReady}
                  rowSelection={{ mode: 'multiRow', checkboxes: true, headerCheckbox: true }}
                  onSelectionChanged={handleSelectionChanged}
                  onCellValueChanged={handleGridCellValueChanged}
                  pagination={true}
                  paginationPageSize={empPageSize}
                  cacheBlockSize={empPageSize}
                  paginationPageSizeSelector={[5, 10, 15, 20]}
                  onPaginationChanged={onEmpPaginationChanged}
                  rowHeight={35}
                />
              </div>
            </div>
          </Can>

          <Can permission="VIEW_ALL_BOOKINGS">
            <div className="management-card">
              <div className="management-card-header">
                <h2>Booking Logs</h2>
              </div>

              <div className="ag-theme-quartz" style={{ height: 250, width: "100%" }}>
                <AgGridReact
                  key={`emp-grid-${bookingPageSize}`}
                  ref={bookingGridRef}
                  columnDefs={combinedBookingColumns}
                  rowModelType="infinite"
                  onGridReady={onBookingGridReady}
                  pagination={true}
                  paginationPageSize={bookingPageSize}
                  cacheBlockSize={bookingPageSize}
                  paginationPageSizeSelector={[5, 10, 15, 20]}
                  onPaginationChanged={onBookingPaginationChanged}
                  rowHeight={35}
                />
              </div>
            </div>
          </Can>
        </section>
      )}
    </div>
  );
};

export default Home;
