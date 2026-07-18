import React, { useState } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { Equipments, Rooms } from "../../graphql/queries"
import { CreateBooking as CreateBookingMutation } from "../../graphql/mutations"
import { client } from "../../apolloClient"
import DynamicForm from "../FormsField/DynamicForm"
import "../FormsField/Form.css"

const CreateBooking = ({ onSubmitSuccess }) => {
  const [selectedEquipId, setSelectedEquipId] = useState("")
  const [equipQuantity, setEquipQuantity] = useState(1)
  const [backendErrors, setBackendErrors] = useState({})

  const { data: roomData, loading: roomLoading, error: roomError } = useQuery(Rooms, {
    variables: { input: { page: 1, limit: 10, searchTerm: "" } },
    fetchPolicy: 'network-only'
  })
  const rooms = roomData?.rooms?.data || []

  const { data: equipmentsData, loading: equipmentLoading, error: equipmentError } = useQuery(Equipments, {
    variables: { input: { page: 1, limit: 10, searchTerm: "" } },
    fetchPolicy: 'network-only'
  })
  const equipments = equipmentsData?.equipments?.data || []

  const [createBookingAction, { loading: isSubmitting }] = useMutation(CreateBookingMutation, {
    onCompleted: async () => {
      await client.refetchQueries({ include: "active" })
    }
  })

  const handleFormSubmit = async (formData, resetForm) => {
    setBackendErrors({})
    try {
      await createBookingAction({
        variables: {
          input: {
            meetingRoomId: Number(formData.roomId),
            startTime: new Date(formData.startTime).toISOString(),
            endTime: new Date(formData.endTime).toISOString(),
            purpose: formData.purpose,
            numberOfAttendees: parseInt(formData.numberOfAttendees, 10),
            equipmentRequested: (formData.equipments || []).map((e) => ({
              equipId: Number(e.equipmentId),
              quantity: parseInt(e.quantity, 10),
            })),
          }
        },
      })

      setSelectedEquipId("")
      setEquipQuantity(1)
      resetForm()

      if (onSubmitSuccess) {
        onSubmitSuccess()
      }
    } catch (err) {
      if (err.graphQLErrors && err.graphQLErrors[0]?.extensions?.validation) {
        setBackendErrors(err.graphQLErrors[0].extensions.validation)
      } else {
        setBackendErrors({ global: err.message })
      }
    }
  }

  if (roomError || equipmentError) {
    return (
      <div className="error-state">
        <h3>Failed to load configurations</h3>
        <p>Please refresh the page.</p>
      </div>
    )
  }

  if (roomLoading || equipmentLoading) {
    return (
      <div className="state-container">
        <p>Gathering system resources...</p>
      </div>
    )
  }

  const formSchema = [
    {
      name: "roomId",
      type: "select",
      label: "Select Meeting Room",
      placeholder: "Choose a Room",
      validators: [{ type: "required", message: "Meeting Room choice is mandatory" }],
      options: rooms.map(room => ({ value: room.id, label: room.name }))
    },
    {
      name: "startTime",
      type: "datetime-local",
      label: "Start Time",
      validators: [{ type: "required", message: "Start timeline context window is required" }]
    },
    {
      name: "endTime",
      type: "datetime-local",
      label: "End Time",
      validators: [{ type: "required", message: "Conclusion benchmark timeline is mandatory" }]
    },
    {
      name: "purpose",
      type: "text",
      label: "Meeting Purpose",
      placeholder: "e.g., Project Sync",
      validators: [{ type: "required", message: "Agenda explanation is required" }]
    },
    {
      name: "numberOfAttendees",
      type: "number",
      label: "Attendees",
      defaultValue: 1,
      validators: [{ type: "required", message: "Count metric is required" }]
    },
    {
      name: "equipments",
      label: "Add Equipment",
      defaultValue: [],
      renderCustom: ({ name, value: equipmentList, onChange, externalError }) => {
        const handleAddEquipmentClick = () => {
          if (!selectedEquipId) return
          const existingIndex = equipmentList.findIndex(e => e.equipmentId === selectedEquipId)
          let updatedList = [...equipmentList]

          if (existingIndex > -1) {
            updatedList[existingIndex].quantity = equipQuantity
          } else {
            updatedList.push({ equipmentId: selectedEquipId, quantity: equipQuantity })
          }
          onChange(name, updatedList)
          setSelectedEquipId("")
          setEquipQuantity(1)
        }

        const handleRemoveEquipmentClick = (id) => {
          const filteredList = equipmentList.filter(e => e.equipmentId !== id)
          onChange(name, filteredList)
        }

        return (
          <div key={name} className="custom-box">
            <h3 className="custom-title">Add Equipment</h3>
            <div className="flex-row">
              <select
                value={selectedEquipId}
                onChange={(e) => setSelectedEquipId(e.target.value)}
                className="form-control"
                style={{ flex: "1", backgroundColor: "#ffffff" }}
              >
                <option value="">Choose Equipment</option>
                {equipments.map((eq) => <option key={eq.id} value={eq.id}>{eq.name}</option>)}
              </select>
              <div className="flex-center">
                <span className="qty-label">Qty:</span>
                <input
                  type="number"
                  min="1"
                  value={equipQuantity}
                  onChange={(e) => setEquipQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="form-control qty-input"
                />
                <button
                  type="button"
                  onClick={handleAddEquipmentClick}
                  disabled={!selectedEquipId}
                  className="btn-add"
                  style={{ opacity: selectedEquipId ? 1 : 0.5 }}
                >
                  Add
                </button>
              </div>
            </div>

            {equipmentList.length > 0 && (
              <div className="list-container">
                {equipmentList.map((item) => {
                  const details = equipments.find((e) => e.id === item.equipmentId)
                  return (
                    <div key={item.equipmentId} className="list-item">
                      <div>
                        <span className="item-name">{details?.name || "Asset"}</span>
                        <span className="item-badge">Qty: {item.quantity}</span>
                      </div>
                      <button type="button" onClick={() => handleRemoveEquipmentClick(item.equipmentId)} className="btn-remove">
                        Remove
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
            {externalError && <span className="error-feedback">{externalError}</span>}
          </div>
        )
      }
    }
  ]

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h1 className="form-title">Reserve a Meeting Room</h1>
          <p className="form-subtitle">Fill out the form below to book a meeting room.</p>
        </div>

        {backendErrors.global && (
          <div className="global-error">
            {backendErrors.global}
          </div>
        )}

        <DynamicForm 
          config={formSchema} 
          onSubmit={handleFormSubmit} 
          backendErrors={backendErrors}
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  )
}

export default CreateBooking
