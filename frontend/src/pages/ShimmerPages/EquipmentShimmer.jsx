import React from "react";
import "./EquipmentShimmer.css";

const EquipmentShimmer = () => {
    const array = new Array(15).fill('')
  return (
    <div className="shimmer-equipment-container">
      <div className="shimmer-equipment-grid">
        {
            array.map((e, i) => {
                return (
                    <div className="shimmer-equipment-card">
                        <div className="shimmer-elem shimmer-asset-box"></div>
                        <div className="shimmer-elem shimmer-title-line"></div>
                        <div className="shimmer-elem shimmer-status-badge"></div>
                        <div className="shimmer-elem shimmer-meta-line"></div>
                    </div>
                )
            })
        }
      </div>
    </div>
  );
};

export default EquipmentShimmer;
