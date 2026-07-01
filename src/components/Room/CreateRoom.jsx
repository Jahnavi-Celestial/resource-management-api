import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CreateRoom as CreateRoomMutation } from "../../graphql/mutations";

const CreateRoom = ({ onSubmitSuccess }) => {
  const initialFormState = {
    name: "",
    location: "",
    capacity: 1,
    isActive: true,
  }
  const [formData, setFormData] = useState(initialFormState)

  const [createRoomAction, { loading: isSubmitting }] = useMutation(CreateRoomMutation)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await createRoomAction({
        variables: {
          name: formData.name,
          location: formData.location,
          capacity: parseInt(formData.capacity),
          isActive: formData.isActive,
        },
      });

      alert("Room created successfully!")
      setFormData(initialFormState)
      if (onSubmitSuccess) {
        onSubmitSuccess()
      }
    } catch (error) {
      console.error("Error creating room:", error)
      alert("Failed to create room. Please try again.")
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
            Add New Room
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#718096" }}>
            Fill out the form below to add a new room.
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
              <label style={labelStyle}>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Capacity</label>
              <input
                type="number"
                min="1"
                name="capacity"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
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
              {isSubmitting ? "Saving..." : "Confirm & Create Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateRoom