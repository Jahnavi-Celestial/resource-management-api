import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { UpdateEmployee as UpdateEmployeeMutation } from "../../graphql/mutations";

const UpdateEmployee = ({ onSubmitSuccess, employee}) => {
  const [formData, setFormData] = useState({
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    password: "",
    role: employee.role,
  })

  const [updateEmployeeAction, { loading: isSubmitting }] = useMutation(UpdateEmployeeMutation)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await updateEmployeeAction({
        variables: {
          updateEmployeeId: employee.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }
      })

      alert("Employee updated successfully!")
      e.target.reset()
      if (onSubmitSuccess) {
        onSubmitSuccess()
      }
    } catch (error) {
      console.error("Error updating employee:", error)
      alert("Failed to update employee. Please try again.")
    }
  }

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#4a5568",
    marginBottom: "6px",
  }
  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "14px",
    boxSizing: "border-box",
    backgroundColor: "#f8fafc",
  }

  return (
    <div
      style={{
        minHeight: "50vh",
        backgroundColor: "#f1f5f9",
        padding: "48px 16px",
        fontFamily: "sans-serif",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          padding: "32px",
        }}
      >
        <div
          style={{
            borderBottom: "1px solid #edf2f7",
            paddingBottom: "20px",
            marginBottom: "24px",
          }}
        >
          <h1
            style={{ margin: "0 0 6px 0", fontSize: "24px", color: "#1a202c" }}
          >
            Update Employee
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#718096" }}>
            Edit the form below to update an employee.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div>
              <label style={labelStyle}>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Role</label>
              <select
                name="password"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                style={inputStyle}
                required
              >
                <option value="">Select Role</option>
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Manager</option>
                <option value="EMPLOYEE">Employee</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "12px 24px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                opacity: isSubmitting ? 0.6 : 1,
              }}
            >
              {isSubmitting ? "Saving..." : "Confirm & Update Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateEmployee