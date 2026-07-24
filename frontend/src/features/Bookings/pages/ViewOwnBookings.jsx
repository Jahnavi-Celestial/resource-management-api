import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApolloClient, useQuery } from "@apollo/client/react";
import { ViewOwnBookings as ViewOwnBookingsQuery } from "../graphql/queries";
import "./ViewOwnBookings.css";
import { useAuth } from "../../Auth/hooks/useAuth";
import { usePagination } from "../../../shared/hooks/usePagination";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { filter } from "rxjs";


const columns = [
  { field: "id", headerName: "Booking ID", width: 120, editable: false, flex: 1},
  {
    field: "meetingRoom.name",
    headerName: "Room Name",
    editable: false,
    sortable: false,
    valueGetter: (params) => params.data?.meetingRoom?.name || "N/A",
    flex: 1
  },
  { field: "purpose", headerName: "Purpose", editable: false, sortable: false, flex: 1 },
  {
    field: "status",
    headerName: "Status",
    sortable: false,
    editable: false,
    filter: true,
    filterParams: {
      filterOptions: ['equals'],
      maxNumConditions: 1,
    },
    flex: 1
  },
];

const ViewOwnBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const client = useApolloClient();
  const gridRef = useRef(null);

  const [bookingPageSize, setBookingPageSize] = useState(5);

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
            query: ViewOwnBookingsQuery,
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

          const dataList = data?.viewOwnBooking?.data || [];
          const totalRows = data?.viewOwnBooking?.total || 0;
          requestParams.successCallback(dataList, totalRows);
        } catch (error) {
          console.error("Error fetching server-side bookings", error);
          requestParams.failCallback();
        }
      }
    };
  }, [client]);

  const onBookingGridReady = useCallback((params) => {
    if (!user?.id) return;
    const initialDatasource = getBookingDatasource(bookingPageSize);
    params.api.setGridOption("datasource", initialDatasource);
  }, [getBookingDatasource, bookingPageSize, user?.id]);

  const onBookingPaginationChanged = useCallback((event) => {
    if (event.newPageSize && gridRef.current?.api) {
      const currentSelectedSize = gridRef.current.api.getGridOption("paginationPageSize");
      if (currentSelectedSize !== bookingPageSize) {
        setBookingPageSize(currentSelectedSize);
      }
    }
  }, [bookingPageSize]);

  const combinedColumns = useMemo(() => {
    const actionColumn = {
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
    return [...columns, actionColumn];
  }, [navigate]);

  return (
    <section className="own-bookings-section">
      <div className="section-header">
        <h2>Your Personal Bookings</h2>
      </div>

      <div className="ag-theme-quartz" style={{ height: 250, width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          columnDefs={combinedColumns}
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
    </section>
  );
};

export default ViewOwnBookings;
