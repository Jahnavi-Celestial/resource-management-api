import React, { useEffect } from "react";
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";
import { useAuth } from "./features/Auth/hooks/useAuth";
import Layout from "./shared/components/Layout";
import SignIn from "./features/Auth/pages/SignIn";
import { usePermission } from "./shared/hooks/usePermission";
import Home from "./features/Home/pages/Home";
import EmployeeDetail from "./features/Employee/pages/EmployeeDetail";
import EquipmentDetail from "./features/Equipment/pages/EquipmentDetail";
import ViewOwnBookings from "./features/Bookings/pages/ViewOwnBookings";
import BookingDetail from "./features/Bookings/pages/BookingDetail";
import MeetingRoom from "./features/Rooms/pages/MeetingRoom";
import RoomDetail from "./features/Rooms/pages/RoomDetail";
import Equipment from "./features/Equipment/pages/Equipment";
import UnAuthorized from "./shared/components/UnAuthorized";
import AdminAction from "./shared/components/AdminAction"
import { connectSocket, disconnectSocket } from "./services/socket";

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
        index: true,
        element: <Navigate to="/home" />,
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
        path: "/admin/actions",
        element: <AdminAction />,
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
