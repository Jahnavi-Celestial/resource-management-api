import React from "react";

const SkeletonRow = ({ columnsCount }) => (
  <tr className="skeleton-row">
    {Array.from({ length: columnsCount }).map((_, index) => (
      <td key={index} className="skeleton-cell">
        <div className={`skeleton-bar ${index === 0 ? "short" : "long"}`} />
      </td>
    ))}
  </tr>
);

export default SkeletonRow;