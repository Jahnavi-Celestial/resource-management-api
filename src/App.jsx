import React, { useContext } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
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

const ProtectedRoute = () => {
  const { token } = useContext(AuthContext)

  if (token) {
    return <Layout />
  }
  return <SignIn />
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
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
        path: "/employeeDetails/:id",
        element: <EmployeeDetail />,
      },
      {
        path: "/room",
        element: <MeetingRoom />,
      },
      {
        path: "/roomDetails/:id",
        element: <RoomDetail />,
      },
      {
        path: "/equipment",
        element: <Equipment />,
      },
      {
        path: "/equipmentDetails/:id",
        element: <EquipmentDetail />,
      },
      {
        path: "/viewOwnBookings",
        element: <ViewOwnBookings />,
      },
      {
        path: "/bookingDetails/:id",
        element: <BookingDetail />,
      },
    ],
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App
