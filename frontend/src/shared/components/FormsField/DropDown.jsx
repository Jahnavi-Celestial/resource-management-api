import React, { memo } from 'react'
import PropTypes from 'prop-types'

const Dropdown = memo(({ name, value, data, label, placeholder, styleClass, onChange, externalError }) => {
    return (
        <div className={`form-group ${styleClass}`}>
            {label && <label className="form-label">{label}</label>}
            <select
                value={value}
                className={`form-control ${externalError ? 'is-invalid' : ''}`}
                onChange={(e) => onChange(name, e.target.value)}
            >
                <option value="">{placeholder || 'Select an option'}</option>
                {data.map((item, key) => (
                    <option key={key} value={item.value}>{item.label}</option>
                ))}
            </select>
            {externalError && <span className="error-feedback">{externalError}</span>}
        </div>
    )
})

Dropdown.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    data: PropTypes.array.isRequired,
    styleClass: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    externalError: PropTypes.string
}
Dropdown.defaultProps = { value: '', label: '', styleClass: '', placeholder: '', externalError: '' }

export default Dropdown
