import React from 'react'
import PropTypes from 'prop-types'

const DatePicker = ({ name, value, label, onChange, externalError }) => {
    return (
        <div className="form-group">
            {label && <label className="form-label">{label}</label>}
            <input
                type="date"
                className={`form-control ${externalError ? 'is-invalid' : ''}`}
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
            />
            {externalError && <span className="error-feedback">{externalError}</span>}
        </div>
    )
}

DatePicker.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    externalError: PropTypes.string
}
DatePicker.defaultProps = { value: '', label: '', externalError: '' }

export default DatePicker
