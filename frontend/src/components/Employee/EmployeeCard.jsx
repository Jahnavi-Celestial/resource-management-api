import React from "react";
import { useNavigate } from "react-router-dom";
import "./EmployeeCard.css";

const EmployeeCard = ({ employee }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/employeeDetails/${employee.id}`, { 
      state: { requireUpdate: true } 
    })
  }

  return (
    <div className="employee-card" onClick={handleCardClick}>
      <div className="employee-avatar">
        {employee.firstName?.[0]}
        {employee.lastName?.[0]}
      </div>
      
      <div className="employee-info">
        <h3 className="employee-name">
          {employee.firstName} {employee.lastName}
        </h3>
        <p className="employee-email">{employee.email}</p>
        <span className="employee-role-tag">{employee.role}</span>
      </div>
    </div>
  )
}

export default EmployeeCard
