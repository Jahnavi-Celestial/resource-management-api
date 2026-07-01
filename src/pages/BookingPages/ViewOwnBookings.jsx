import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useQuery } from "@apollo/client/react";
import { ViewOwnBookings as ViewOwnBookingsQuery } from "../../graphql/queries";
import BookingCard from "../../components/Booking/BookingCard";
import "./ViewOwnBookings.css";

const ViewOwnBookings = () => {
  const { user } = useContext(AuthContext)
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)

  const { data, loading, refetch } = useQuery(ViewOwnBookingsQuery, {
    variables: {
      page: page,
      limit: 5,
      bookingStatus: status || null,
    },
    skip: !user?.id,
    fetchPolicy: 'network-only'
  })

  const bookings = data?.viewOwnBooking?.bookings || []

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
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="cards-list">
        {loading ? (
          <p className="empty-message">Loading schedule registry...</p>
        ) : bookings.length > 0 ? (
          bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        ) : (
          <p className="empty-message">
            No reservations recorded under your ID matching this filter.
          </p>
        )}
      </div>

      {!loading && (
        <div className="pagination-controls">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </button>
          <span>Page {page}</span>
          <button
            disabled={bookings.length < 5}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </section>
  )
}

export default ViewOwnBookings
