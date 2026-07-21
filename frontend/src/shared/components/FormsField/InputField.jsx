import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'

export const validateInput = (validators, value) => {
    if (!validators) return ''
    for (const validate of validators) {
        if (validate.type === 'required' && (!value || value.toString().trim() === '')) {
            return validate.message || 'This field is required'
        }
    }
    return ''
}

const InputField = memo(({ name, value, label, placeholder, validators, type, onChange, externalError }) => {
    const [localError, setLocalError] = useState('')

    const handleChange = (event) => {
        const val = event.target.value
        setLocalError(validateInput(validators, val))
        onChange(name, val)
    }

    const activeError = externalError || localError

    return (
        <div className="form-group">
            {label && <label className="form-label">{label}</label>}
            {type === 'textarea' ? (
                <textarea
                    className={`form-control ${activeError ? 'is-invalid' : ''}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    className={`form-control ${activeError ? 'is-invalid' : ''}`}
                    placeholder={placeholder}
                    onChange={handleChange}
                    min={type === 'datetime-local' ? new Date().toISOString().slice(0, 16) : undefined}
                />
            )}
            {activeError && <span className="error-feedback">{activeError}</span>}
        </div>
    )
})

InputField.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
    placeholder: PropTypes.string,
    validators: PropTypes.array,
    type: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    externalError: PropTypes.string
}
InputField.defaultProps = { value: '', label: '', placeholder: '', type: 'text', validators: [], externalError: '' }

export default InputField
