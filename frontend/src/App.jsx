import React, { lazy, useEffect, Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";
import { useAuth } from "./features/Auth/hooks/useAuth";
import Layout from "./shared/components/Layout";
import SignIn from "./features/Auth/pages/SignIn";
import { usePermission } from "./shared/hooks/usePermission";
import UnAuthorized from "./shared/components/UnAuthorized";
import AdminAction from "./shared/components/AdminAction";
import { connectSocket, disconnectSocket } from "./services/socket";

const Home = lazy(() => import("./features/Home/pages/Home"));
const MeetingRoom = lazy(() => import("./features/Rooms/pages/MeetingRoom"));
const RoomDetail = lazy(() => import("./features/Rooms/pages/RoomDetail"));
const Equipment = lazy(() => import("./features/Equipment/pages/Equipment"));
const EquipmentDetail = lazy(() => import("./features/Equipment/pages/EquipmentDetail"));
const EmployeeDetail = lazy(() => import("./features/Employee/pages/EmployeeDetail"));
const ViewOwnBookings = lazy(() => import("./features/Bookings/pages/ViewOwnBookings"));
const BookingDetail = lazy(() => import("./features/Bookings/pages/BookingDetail"));

const AuthGuard = () => {
  const { token } = useAuth();
  return token ? <Layout /> : <SignIn />;
};

const PermissionGuard = ({ requiredPermission }) => {
  const { hasPermission } = usePermission();

  if (!hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthGuard />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<div className="page-spinner">Loading...</div>}>
            <Outlet />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/home" replace />,
          },
          {
            path: "/home",
            element: <Home />,
          },
          {
            element: <PermissionGuard requiredPermission="VIEW_EMPLOYEE" />,
            children: [
              { path: "/employeeDetails/:id", element: <EmployeeDetail /> },
            ],
          },
          {
            element: <PermissionGuard requiredPermission="VIEW_ALL_ROOM" />,
            children: [{ path: "/room", element: <MeetingRoom /> }],
          },
          {
            element: <PermissionGuard requiredPermission="VIEW_ROOM" />,
            children: [{ path: "/roomDetails/:id", element: <RoomDetail /> }],
          },
          {
            element: <PermissionGuard requiredPermission="VIEW_ALL_EQUIPMENT" />,
            children: [
              { path: "/equipment", element: <Equipment /> },
              { path: "/equipmentDetails/:id", element: <EquipmentDetail /> },
            ],
          },
          {
            element: <PermissionGuard requiredPermission="VIEW_OWN_BOOKINGS" />,
            children: [{ path: "/viewOwnBookings", element: <ViewOwnBookings /> }],
          },
          {
            element: <PermissionGuard requiredPermission="VIEW_BOOKING" />,
            children: [{ path: "/bookingDetails/:id", element: <BookingDetail /> }],
          },
          {
            path: "/unauthorized",
            element: <UnAuthorized />,
          },
          {
            element: <PermissionGuard requiredPermission={"CREATE_ROLE" || "UPDATE_ROLE" || "DELETE_ROLE" || "CREATE_PERMISSION" || "UPDATE_PERMISSION" || "DELETE_PERMISSION" || "ASSIGN_PERMISSION" || "REMOVE_PERMISSION"} />,
            children: [{path: "/admin/actions", element: <AdminAction />,}]
          },
        ],
      },
    ],
  },
]);

const App = () => {
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const empId = Number(user?.id);

    if (empId) {
      connectSocket(empId);
    }

    return () => disconnectSocket();
  }, []);

  return <RouterProvider router={router} />;
};

export default App;
