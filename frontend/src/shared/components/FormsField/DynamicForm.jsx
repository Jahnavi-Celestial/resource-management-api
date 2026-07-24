import React, { useState, useEffect, memo, useCallback } from 'react'
import PropTypes from 'prop-types'
import Button from './Button'
import InputField, { validateInput } from './InputField'
import Dropdown from './DropDown'
import DatePicker from './DatePicker'
import './Form.css';

const DynamicForm = memo(({ config, onSubmit, backendErrors, isSubmitting }) => {
    const [formData, setFormData] = useState({})
    const [errors, setErrors] = useState({})

    useEffect(() => {
        const initialData = {}
        config.forEach(field => {
            initialData[field.name] = field.defaultValue !== undefined ? field.defaultValue : ''
        })
        setFormData(initialData)
    }, [config])

    useEffect(() => {
        if (backendErrors) {
            setErrors(backendErrors)
        }
    }, [backendErrors])

    const handleFieldChange = useCallback((name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }, [errors])

    const resetForm = useCallback(() => {
        const initialData = {}
        config.forEach(field => {
            initialData[field.name] = field.defaultValue !== undefined ? field.defaultValue : ''
        })
        setFormData(initialData)
        setErrors({})
    }, [config])

    const handleSubmit = useCallback((e) => {
        e.preventDefault()
        const localErrors = {}
        config.forEach(field => {
            if (field.validators) {
                const errMessage = validateInput(field.validators, formData[field.name])
                if (errMessage) localErrors[field.name] = errMessage
            }
        })

        if (Object.keys(localErrors).length > 0) {
            setErrors(localErrors)
            return
        }

        onSubmit(formData, resetForm)
    }, [config, formData, onSubmit, resetForm])

    const renderField = useCallback((field) => {
        const name = field.name
        const label = field.label
        const value = formData[field.name] || ''
        const externalError = errors[field.name] || ''

        if (field.renderCustom) {
            return field.renderCustom({
                name,
                label,
                value,
                onChange: handleFieldChange,
                externalError,
                config: field
            })
        }

        switch (field.type) {
            case 'text':
            case 'email':
            case 'password':
            case 'textarea':
            case 'number':
            case 'datetime-local':
                return (
                    <InputField
                        key={name}
                        name={name}
                        label={label}
                        value={value}
                        onChange={handleFieldChange}
                        externalError={externalError}
                        type={field.type}
                        placeholder={field.placeholder}
                        validators={field.validators}
                    />
                )
            case 'select':
                return (
                    <Dropdown
                        key={name}
                        name={name}
                        label={label}
                        value={value}
                        onChange={handleFieldChange}
                        externalError={externalError}
                        data={field.options || []}
                        placeholder={field.placeholder}
                    />
                )
            case 'date':
                return (
                    <DatePicker
                        key={name}
                        name={name}
                        label={label}
                        value={value}
                        onChange={handleFieldChange}
                        externalError={externalError}
                    />
                )
            default:
                return null
        }
    }, [formData, errors, handleFieldChange])

    return (
        <form onSubmit={handleSubmit}>
            {config.map(renderField)}
            <div className="footer-actions">
                <Button type="submit" value={isSubmitting ? 'Submitting...' : 'Submit'} />
            </div>
        </form>
    )
})

DynamicForm.propTypes = {
    config: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    backendErrors: PropTypes.object,
    isSubmitting: PropTypes.bool
}

DynamicForm.defaultProps = {
    backendErrors: {},
    isSubmitting: false
}

export default DynamicForm
