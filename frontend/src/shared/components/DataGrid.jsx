import React from "react";

const DataGrid = ({
  columns = [],
  data = [],
  loading = false,
  page = 1,
  limit = 5,
  totalCount = 0,
  sortDirection = "DESC",
  onSortToggle,
  onPageChange,
  onLimitChange,
  onRowClick,
}) => {
  const totalPages = Math.ceil(Number(totalCount) / Number(limit)) || 1;

  return (
    <div className="datagrid-container">
      <div className="grid-header" style={{ marginBottom: "1rem" }}>
        <label>Rows per page: </label>
        <select value={limit} onChange={(e) => onLimitChange(Number(e.target.value))}>
          {[5, 10, 15, 20].map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>

      <table className="main-grid" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ccc" }}>
            {columns.map((col) => (
              <th 
                key={col.key} 
                style={{ padding: "10px", cursor: col.key === "id" ? "pointer" : "default" }}
                onClick={() => col.key === "id" && onSortToggle()}
              >
                {col.label}
                {col.key === "id" && (sortDirection === "DESC" ? " ▲" : " ▼")}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center", padding: "2rem" }}>
                Loading data...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center", padding: "2rem" }}>
                No records found.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr 
                key={row.id} 
                style={{ 
                  borderBottom: "1px solid #eee",
                  cursor: onRowClick ? "pointer" : "default" 
                }}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((col) => (
                  <td key={col.key} style={{ padding: "10px" }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination-controls" style={{ display: "flex", marginTop: "1rem", gap: "10px", alignItems: "center" }}>
        <div>
            <p>Page {page} of {totalPages}</p>
        </div>
        <div >
            <button
                disabled={page === 1 || loading}
                onClick={() => onPageChange(page - 1)}
                style={{margin: "0 10px 0 10px"}}
            >
                Previous
            </button>
            <button
                disabled={page >= totalPages || loading}
                onClick={() => onPageChange(page + 1)}
            >
                Next
            </button>
        </div>
      </div>
    </div>
  );
};

export default DataGrid;
