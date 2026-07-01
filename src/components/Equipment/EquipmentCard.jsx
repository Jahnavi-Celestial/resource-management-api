import React from "react";
import { useNavigate } from "react-router-dom";
import "./EquipmentCard.css";

const EquipmentCard = ({ equipment }) => {
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/equipmentDetails/${equipment.id}`)
  };

  const isOutOfStock = (equipment.quantityAvailable || 0) === 0

  return (
    <div className="equipment-card" onClick={handleCardClick}>
      <div className="equipment-icon-placeholder">
        <span className={`equipment-status-badge ${isOutOfStock ? "out-of-stock" : "in-stock"}`}>
          {isOutOfStock ? "Out of Stock" : "In Stock"}
        </span>
      </div>

      <div className="equipment-card-body">
        <h3 className="equipment-title">{equipment.name}</h3>
        
        <div className="equipment-meta-row">
          <span className="quantity-label">Available Units:</span>
          <span className={`quantity-value ${isOutOfStock ? "danger" : "normal"}`}>
            {equipment.quantityAvailable || 0}
          </span>
        </div>
      </div>
    </div>
  )
}

export default EquipmentCard