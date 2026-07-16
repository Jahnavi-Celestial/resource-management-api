import React, { useContext, useEffect } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import SignIn from "./pages/SignIn";
import { RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import { AuthContext } from "./context/AuthContext";
import ViewOwnBookings from "./pages/BookingPages/ViewOwnBookings";
import BookingDetail from "./pages/BookingPages/BookingDetail";
import MeetingRoom from "./pages/RoomPages/MeetingRoom";
import RoomDetail from "./pages/RoomPages/RoomDetail";
import Equipment from "./pages/EquipmentPages/Equipment";
import EquipmentDetail from "./pages/EquipmentPages/EquipmentDetail";
import EmployeeDetail from "./pages/EmployeePages/EmployeeDetail";
import { connectSocket, disconnectSocket } from './socket';
import UnAuthorized from "./components/UnAuthorized";

const AuthGuard = () => {
  const { token } = useContext(AuthContext)
  return token ? <Layout /> : <SignIn />
};

const PermissionGuard = ({ requiredPermission }) => {
  const { hasPermission } = useContext(AuthContext)

  if(!hasPermission(requiredPermission)){
    return <Navigate to="/unauthorized" replace />
  }
  return <Outlet />
}

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
          { path: "/employeeDetails/:id", element: <EmployeeDetail /> }
        ]
      },
      {
        element: <PermissionGuard requiredPermission="VIEW_ALL_ROOM" />,
        children: [
          { path: "/room", element: <MeetingRoom /> }
        ]
      },
      {
        element: <PermissionGuard requiredPermission="VIEW_ROOM" />,
        children: [
          { path: "/roomDetails/:id", element: <RoomDetail /> }
        ]
      },
      {
        element: <PermissionGuard requiredPermission="VIEW_ALL_EQUIPMENT" />,
        children: [
          { path: "/equipment", element: <Equipment /> },
          { path: "/equipmentDetails/:id", element: <EquipmentDetail /> }
        ]
      },
      {
        element: <PermissionGuard requiredPermission="VIEW_EQUIPMENT" />,
        children: [
          { path: "/equipmentDetails/:id", element: <EquipmentDetail /> }
        ]
      },
      {
        element: <PermissionGuard requiredPermission="VIEW_OWN_BOOKINGS" />,
        children: [
          { path: "/viewOwnBookings", element: <ViewOwnBookings /> }
        ]
      },
      {
        element: <PermissionGuard requiredPermission="VIEW_BOOKING" />,
        children: [
          { path: "/bookingDetails/:id", element: <BookingDetail /> }
        ]
      },{
        path: "/unauthorized", element: <UnAuthorized />
      }
    ],
  },
])

const App = () => {

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    const empId = Number(user?.id)
    
    if(empId){
      connectSocket(empId);
    }

    return () => disconnectSocket();

  }, [])

  return <RouterProvider router={router} />
}

export default App
