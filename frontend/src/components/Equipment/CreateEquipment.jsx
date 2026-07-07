import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CreateEquipment as CreateEquipmentMutation } from "../../graphql/mutations";

const CreateEquipment = ({ onSubmitSuccess }) => {
  const initialFormState = { name: "", quantityAvailable: 0, isActive: true }
  const [formData, setFormData] = useState(initialFormState)

  const [createEquipmentAction, { loading: isSubmitting }] = useMutation(CreateEquipmentMutation)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await createEquipmentAction({
        variables: {
          name: formData.name,
          quantityAvailable: parseInt(formData.quantityAvailable),
          isActive: formData.isActive,
        }
      })

      alert("Equipment created successfully!");
      setFormData(initialFormState);
      if (onSubmitSuccess) {
        onSubmitSuccess()
      }
    } catch (error) {
      console.error("Error creating equipment:", error)
      alert("Failed to create equipment. Please try again.")
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
            Add New Equipment
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#718096" }}>
            Fill out the form below to add a new equipment.
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
              <label style={labelStyle}>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Quantity Available</label>
              <input
                type="number"
                min="0"
                name="quantityAvailable"
                value={formData.quantityAvailable}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantityAvailable: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Is Active</label>
              <select
                name="isActive"
                value={formData.isActive.toString()}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isActive: e.target.value === "true",
                  })
                }
                style={inputStyle}
                required
              >
                <option value="true">True</option>
                <option value="false">False</option>
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
              {isSubmitting ? "Saving..." : "Confirm & Create Equipment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateEquipment
