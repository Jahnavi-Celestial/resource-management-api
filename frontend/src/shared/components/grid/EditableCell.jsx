import React, { useEffect, useRef, useState } from "react";

const EditableCell = ({ value, row, field, onCellSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const inputRef = useRef(null);

  useEffect(() => {
    if(isEditing && inputRef.current){
      inputRef.current.focus();
    }
  }, [isEditing])

  const handleBlur = () => {
    setIsEditing(false);
    if(inputValue !== value && onCellSave){
      onCellSave(row.id, field, inputValue)
    }
  }

  const handleKeyDown = (e) => {
    if(e.key === "Enter"){
      handleBlur()
    }
    if(e.key === "Escape"){
      setInputValue(value || "")
      setIsEditing(false)
    }
  }

  if(isEditing){
    return (
      <input
        ref={inputRef}
        type="text"
        className="inline-cell-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    )
  }

  return (
    <span className="editable-cell-wrapper" onClick={() => setIsEditing(true)}>
      {value || <span style={{ color: "#aaa" }}>—</span>}
    </span>
  )
}

export default EditableCell;