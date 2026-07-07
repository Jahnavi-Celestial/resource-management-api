import { useMutation, useQuery } from "@apollo/client/react";
import { Equipments, Rooms } from "../../graphql/queries";
import { useState } from "react";
import { CreateBooking as CreateBookingMutation } from "../../graphql/mutations";
import { client } from "../../apolloClient";

const CreateBooking = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    roomId: "",
    startTime: "",
    endTime: "",
    purpose: "",
    numberOfAttendees: 1,
    equipments: [],
  })

  const [selectedEquipId, setSelectedEquipId] = useState("")
  const [equipQuantity, setEquipQuantity] = useState(0)

  const { data: roomData, loading: roomLoading, error: roomError } = useQuery(Rooms, {
    variables: { page: 1, limit: 10, searchTerm: "" },
  })
  const rooms = roomData?.rooms?.rooms || []

  const { data: equipmentsData, loading: equipmentLoading, error: equipmentError } = useQuery(Equipments, {
    variables: { page: 1, limit: 10, searchTerm: "" },
  });
  const equipments = equipmentsData?.equipments?.equipments || []

  const [createBookingAction, { loading: isSubmitting }] = useMutation(CreateBookingMutation, {
    onCompleted: async()=>{
      await client.refetchQueries({
        include: "active",
      });
    }
  }
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddEquipment = () => {
    if (!selectedEquipId) return
    const existingIndex = formData.equipments.findIndex(
      (e) => e.equipmentId === selectedEquipId,
    )

    if (existingIndex > -1) {
      const updatedEquip = [...formData.equipments]
      updatedEquip[existingIndex].quantity = equipQuantity
      setFormData((prev) => ({ ...prev, equipments: updatedEquip }))
    } else {
      setFormData((prev) => ({
        ...prev,
        equipments: [
          ...prev.equipments,
          { equipmentId: selectedEquipId, quantity: equipQuantity },
        ],
      }))
    }
    setSelectedEquipId("")
    setEquipQuantity(1)
  }

  const handleRemoveEquipment = (id) => {
    setFormData((prev) => ({
      ...prev,
      equipments: prev.equipments.filter((e) => e.equipmentId !== id),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const bookingData = await createBookingAction({
        variables: {
          meetingRoomId: Number(formData.roomId),
          startTime: new Date(formData.startTime).toISOString(),
          endTime: new Date(formData.endTime).toISOString(),
          purpose: formData.purpose,
          numberOfAttendees: parseInt(formData.numberOfAttendees, 10),
          equipmentRequested: formData.equipments.map((e) => ({
            equipId: Number(e.equipmentId),
            quantity: parseInt(e.quantity, 10),
          })),
        },
      })
      formData.roomId = ""
      formData.startTime = ""
      formData.endTime = ""
      formData.purpose = ""
      formData.numberOfAttendees = 1
      formData.equipments = []
      setSelectedEquipId("")
      setEquipQuantity(1)

      if (onSubmitSuccess) {
        onSubmitSuccess()
      }
    } catch (err) {
      console.error("Error creating booking:", err)
      alert(`${err.message}`)
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

  if (roomError || equipmentError) {
    return (
      <div
        style={{
          maxWidth: "450px",
          margin: "40px auto",
          padding: "24px",
          backgroundColor: "#fef2f2",
          border: "1px solid #fee2e2",
          color: "#b91c1c",
          borderRadius: "12px",
          textAlign: "center",
          fontFamily: "sans-serif",
        }}
      >
        <h3 style={{ margin: "0 0 4px 0", fontSize: "18px" }}>
          Failed to load configurations
        </h3>
        <p style={{ margin: 0, fontSize: "14px" }}>Please refresh the page.</p>
      </div>
    )
  }

  if (roomLoading || equipmentLoading) {
    return (
      <div
        style={{
          maxWidth: "600px",
          margin: "40px auto",
          padding: "32px",
          textAlign: "center",
          color: "#64748b",
          fontFamily: "sans-serif",
        }}
      >
        <p>Gathering system resources...</p>
      </div>
    )
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
            Reserve a Meeting Room
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#718096" }}>
            Fill out the form below to book a meeting room.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div>
            <label style={labelStyle}>Select Meeting Room</label>
            <select
              name="roomId"
              value={formData.roomId}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Choose a Room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <label style={labelStyle}>Start Time</label>
              <input
                type="datetime-local"
                min={new Date().toISOString().slice(0, 16)}
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>End Time</label>
              <input
                type="datetime-local"
                min={new Date().toISOString().slice(0, 16)}
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <label style={labelStyle}>Meeting Purpose</label>
              <input
                type="text"
                name="purpose"
                placeholder="e.g., Project Sync"
                value={formData.purpose}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Attendees</label>
              <input
                type="number"
                name="numberOfAttendees"
                min="1"
                value={formData.numberOfAttendees}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#f8fafc",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #f1f5f9",
            }}
          >
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "12px",
                fontWeight: "700",
                color: "#4a5568",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Add Equipment
            </h3>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: "12px",
              }}
            >
              <select
                value={selectedEquipId}
                onChange={(e) => setSelectedEquipId(e.target.value)}
                style={{ ...inputStyle, flex: "1", backgroundColor: "#ffffff" }}
              >
                <option value="">Choose Equipment</option>
                {equipments.map((equipment) => (
                  <option key={equipment.id} value={equipment.id}>
                    {equipment.name}
                  </option>
                ))}
              </select>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#64748b",
                  }}
                >
                  Qty:
                </span>
                <input
                  type="number"
                  min="0"
                  value={equipQuantity}
                  onChange={(e) =>
                    setEquipQuantity(
                      Math.max(1, parseInt(e.target.value, 10) || 1),
                    )
                  }
                  style={{
                    ...inputStyle,
                    width: "70px",
                    backgroundColor: "#ffffff",
                    textAlign: "center",
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddEquipment}
                  disabled={!selectedEquipId}
                  style={{
                    padding: "10px 16px",
                    backgroundColor: "#1e293b",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    cursor: "pointer",
                    opacity: selectedEquipId ? 1 : 0.5,
                  }}
                >
                  Add
                </button>
              </div>
            </div>

            {formData.equipments.length > 0 && (
              <div
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                }}
              >
                {formData.equipments.map((item) => {
                  const details = equipments.find(
                    (e) => e.id === item.equipmentId,
                  )
                  return (
                    <div
                      key={item.equipmentId}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyInverted: "space-between",
                        justifyContent: "space-between",
                        padding: "12px",
                        borderBottom: "1px solid #f1f5f9",
                        fontSize: "14px",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontWeight: "500",
                            color: "#334155",
                            marginRight: "8px",
                          }}
                        >
                          {details?.name || "Asset"}
                        </span>
                        <span
                          style={{
                            padding: "2px 6px",
                            backgroundColor: "#f1f5f9",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: "600",
                          }}
                        >
                          Qty: {item.quantity}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveEquipment(item.equipmentId)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#ef4444",
                          fontSize: "12px",
                          cursor: "pointer",
                          fontWeight: "500",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingTop: "16px",
              borderTop: "1px solid #edf2f7",
            }}
          >
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
              {isSubmitting ? "Saving..." : "Confirm & Create Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateBooking