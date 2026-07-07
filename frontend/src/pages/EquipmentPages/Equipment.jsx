import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Equipments } from "../../graphql/queries";
import EquipmentCard from "../../components/Equipment/EquipmentCard";
import "./Equipment.css";

const Equipment = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)

  const { data, loading, refetch } = useQuery(Equipments, {
    variables: {
      page: page,
      limit: 6,
      searchTerm: searchTerm,
    },
  })

  const equipments = data?.equipments?.equipments || [];

  return (
    <div className="equipment-container">
      <header className="equipment-header">
        <div>
          <h1>Inventory & Equipment</h1>
          <p className="equipment-subtext">
            Monitor active assets and hardware item availability.
          </p>
        </div>

        <div className="search-bar-wrapper">
          <input
            type="text"
            placeholder="Search items by name..."
            className="equipment-search-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </header>

      {loading ? (
        <div className="equipment-loading">Loading inventory listings...</div>
      ) : equipments.length > 0 ? (
        <div className="equipment-grid">
          {equipments.map((equipment) => (
            <EquipmentCard
              key={equipment.id}
              equipment={equipment}
              refetch={refetch}
            />
          ))}
        </div>
      ) : (
        <div className="equipment-empty">
          <p>No inventory units found matching your search parameters.</p>
        </div>
      )}

      <div className="equipment-pagination">
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
          disabled={equipments.length < 6}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Equipment
