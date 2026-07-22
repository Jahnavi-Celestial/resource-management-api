import React, {
  memo,
  useCallback,
  useState,
  useMemo,
} from "react";
import "./DataGrid.css";
import { useDebounce } from "../../hooks/useDebounce";
import { useAuth } from "../../../features/Auth/hooks/useAuth";
import SkeletonRow from "./SkeltonRow";
import EditableCell from "./EditableCell";
import Dropdown from "../FormsField/DropDown";
import InputField from "../FormsField/InputField";

const DataGrid = memo(
  ({
    columns = [],
    data = [],
    loading = false,
    error = null,
    ErrorComponent,
    page = 1,
    limit = 5,
    totalCount = 0,
    sortBy = "",
    sortDirection = "DESC",
    selectionMode = null,
    selectedRows = [],
    onSelectionChange,
    onSortToggle,
    onPageChange,
    onLimitChange,
    onSearchChange,
    onFilterChange,
    onBulkDelete,
    onCellSave,
  }) => {
    const totalPages = Math.ceil(Number(totalCount) / Number(limit)) || 1;

    const { user } = useAuth();
    const roles = user?.roles;

    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilters, setActiveFilters] = useState({});

    if (onSearchChange) {
      const search = useDebounce(searchTerm, 500);
      onSearchChange(search);
    }

    const handleResetSearch = useCallback(() => {
      setSearchTerm("");
      if (onSearchChange) {
        onSearchChange("");
      }
    }, [onSearchChange]);

    const handleSortToggle = useCallback(
      (col) => {
        if (!onSortToggle) return;
        const isCurrentField = sortBy === col.field;
        let nextDirection = "ASC";

        if (isCurrentField) {
          nextDirection = sortDirection === "ASC" ? "DESC" : "ASC";
        }
        onSortToggle(col.field, nextDirection);
      },
      [sortBy, sortDirection, onSortToggle],
    );

    const handleFilterChangeInternal = useCallback(
      (field, value) => {
        const updatedFilters = { ...activeFilters, [field]: value };
        if (!value) {
          delete updatedFilters[field];
        }

        setActiveFilters(updatedFilters);
        if (onFilterChange) {
          onFilterChange(updatedFilters);
        }
      },
      [activeFilters, onFilterChange],
    );

    const handleSelectAll = useCallback(
      (name, isChecked) => { 
        if (!onSelectionChange) return;
    
        if (isChecked) {
          const allIds = data.map((row) => row.id);
          onSelectionChange(allIds);
        }
        else{
          onSelectionChange([]);
        }
      },  [data, onSelectionChange]);

    const handleSelectRow = useCallback(
      (e, rowId) => {
        e.stopPropagation();
        if (!onSelectionChange) return;

        if (selectionMode === "single") {
          onSelectionChange(e.target.checked ? [rowId] : []);
        } else if (selectionMode === "multi") {
          const updated = e.target.checked
            ? [...selectedRows, rowId]
            : selectedRows.filter((id) => id !== rowId);
          onSelectionChange(updated);
        }
      },
      [selectionMode, selectedRows, onSelectionChange],
    );

    const handlePrevPage = useCallback(() => {
      if (onPageChange) onPageChange(page - 1);
    }, [page, onPageChange]);

    const handleNextPage = useCallback(() => {
      if (onPageChange) onPageChange(page + 1);
    }, [page, onPageChange]);

    const totalColumnsSpan = useMemo(() => {
      return columns.length + (selectionMode ? 1 : 0);
    }, [columns, selectionMode]);

    if (error) {
      return <ErrorComponent error={error} styleClass="error-fallback-container"/>
    }

    return (
      <div className="datagrid-container">
        <div className="grid-controls">
          {onSearchChange && (
            <div className="search-box">
              <InputField
                name="search"
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(name, value) => setSearchTerm(value)}
              />
              {searchTerm && (
                <button onClick={handleResetSearch} className="btn-reset">
                  Reset
                </button>
              )}
            </div>
          )}

          <div className="grid-header-select">
            <Dropdown 
              name="numberOfRowPerPage"
              label="Rows per page: "
              value={String(limit)}
              onChange={(name, value) => onLimitChange?.(Number(value))}
              data={[
                { value: '5', label: '5' },
                { value: '10', label: '10' },
                { value: '15', label: '15' },
                { value: '20', label: '20' }
              ]}
            />
          </div>
        </div>

        <table className="main-grid">
          <thead>
            <tr className="selection-head">
              {selectionMode === "multi" && (
                <th className="selection-cell">
                  <InputField
                    type="checkbox"
                    name="selectAllRows"
                    value={data.length > 0 && selectedRows.length === data.length}
                    onChange={handleSelectAll}
                    checked={
                      data.length > 0 && selectedRows.length === data.length
                    }
                  />
                </th>
              )}
              {selectionMode === "single" && <th className="selection-cell" />}

              {columns.map((col) => (
                <th key={col.field}>
                  <div
                    className={`header-sort-trigger ${col.sortable !== false ? "sortable" : ""}`}
                    onClick={() =>
                      col.sortable !== false && handleSortToggle(col)
                    }
                  >
                    {col.headerName}
                    {col.sortable !== false && sortBy === col.field && (
                      <span>{sortDirection === "DESC" ? " ▲" : " ▼"}</span>
                    )}
                  </div>

                  {col.filterOptions && (
                    <div className="filter-dropdown-container">
                      <Dropdown
                        name={col.field}
                        value={activeFilters[col.field] || ""}
                        placeholder="All"
                        data={col.filterOptions.map((opt) => ({
                          value: opt,
                          label: opt
                        }))}
                        onChange={handleFilterChangeInternal}
                      />

                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: limit }).map((_, i) => (
                <SkeletonRow key={i} columnsCount={totalColumnsSpan} />
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={totalColumnsSpan} className="empty-state-cell">
                  No Records Found
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const isSelected = selectedRows.includes(row.id);
                return (
                  <tr key={row.id} className={isSelected ? "row-selected" : ""}>
                    {selectionMode && (
                      <td>
                        <input
                          type={
                            selectionMode === "multi" ? "checkbox" : "radio"
                          }
                          aria-label="selcted-row"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(e, row.id)}
                        />
                      </td>
                    )}

                    {columns.map((col) => (
                      <td key={col.field}>
                        {col.render ? (
                          col.render(row[col.field], row)
                        ) : col.editable !== false &&
                          roles.includes("admin") ? (
                          <EditableCell
                            value={row[col.field]}
                            row={row}
                            field={col.field}
                            onCellSave={onCellSave}
                          />
                        ) : (
                          row[col.field]
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <div className="pagination-controls">
          <div className="pagination-left-block">
            <p className="pagination-text">
              Page {page} of {totalPages} ({totalCount} total records)
            </p>

            {selectedRows.length > 0 && onBulkDelete && (
              <button onClick={onBulkDelete} className="btn-footer-delete">
                Delete Selected ({selectedRows.length})
              </button>
            )}
          </div>
          <div>
            <button
              disabled={page === 1 || loading}
              onClick={handlePrevPage}
              className="btn-pagination"
              style={{ marginRight: "10px" }}
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages || loading}
              onClick={handleNextPage}
              className="btn-pagination"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  },
);

export default DataGrid;
