import React from 'react'

const ErrorComponent = ({styleClass, error}) => {
  return (
    <div className={styleClass}>
        <h3>Error Loading Data</h3>
        <p>{error.message || String(error)}</p>
    </div>
  )
}

export default ErrorComponent