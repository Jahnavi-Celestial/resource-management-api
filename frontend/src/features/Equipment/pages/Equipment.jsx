import React, { useCallback, useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import EquipmentCard from "../components/EquipmentCard";
import EquipmentShimmer from "../components/EquipmentShimmer";
import "./Equipment.css";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { Equipments } from "../../../shared/services/queries";
import { usePagination } from "../../../shared/hooks/usePagination";

const Equipment = () => {
  const [searchInput, setSearchInput] = useState("")

  const debouncedSearch = useDebounce(searchInput, 500)

  const {
    currentPage: page,
    pageSize: limit,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    setTotalRecords
  } = usePagination({ initialPageSize: 5, initialPage: 1 })

  const { data, loading, refetch } = useQuery(Equipments, {
    variables: {
      input:{
        page: page,
        limit: 6,
        searchTerm: debouncedSearch,
      }
    },
    fetchPolicy: 'network-only'
  })

  const equipments = data?.equipments?.data || [];
  const totalCount = data?.equipments?.total || 0
    
  useEffect(() => {
    if (!loading && data?.rooms) {
      setTotalRecords(totalCount);
    }
  }, [totalCount, loading, data, setTotalRecords])
    
  useEffect(() => {
    goToPage(1);
  }, [debouncedSearch])

  const handleSearchInput = useCallback((e) => setSearchInput(e.target.value), [])

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
            value={searchInput} 
            onChange={handleSearchInput}
          />
        </div>
      </header>

      {loading ? (
        <EquipmentShimmer />
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
          onClick={prevPage}
        >
          Previous
        </button>
        <span className="page-indicator">Page {page}</span>
        <button
          className="page-btn"
          disabled={equipments.length < 6}
          onClick={nextPage}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Equipment