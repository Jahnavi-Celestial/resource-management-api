import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Rooms } from "../../graphql/queries";
import RoomCard from "../../components/Room/RoomCard";
import "./MeetingRoom.css";

const MeetingRoom = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)

  const { data, loading, refetch } = useQuery(Rooms, {
    variables: {
      page: page,
      limit: 6,
      searchTerm: searchTerm,
    },
  })

  const rooms = data?.rooms?.rooms || [];

  return (
    <div className="rooms-container">
      <header className="rooms-header">
        <div>
          <h1>Available Meeting Rooms</h1>
          <p className="rooms-subtext">
            Discover and book workspaces for your team.
          </p>
        </div>

        <div className="search-bar-wrapper">
          <input
            type="text"
            placeholder="Search rooms by name..."
            className="room-search-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </header>

      {loading ? (
        <div className="rooms-loading">Loading workspace catalog...</div>
      ) : rooms.length > 0 ? (
        <div className="rooms-grid">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} refetch={refetch} />
          ))}
        </div>
      ) : (
        <div className="rooms-empty">
          <p>No meeting rooms found matching your search criteria.</p>
        </div>
      )}

      <div className="rooms-pagination">
        <button
          className="page-btn"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span className="page-indicator">Page {page}</span>
        <button
          className="page-btn"
          disabled={rooms.length < 6}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default MeetingRoom
