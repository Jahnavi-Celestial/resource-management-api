import React from 'react'
import PropTypes from 'prop-types'

const Button = ({ value, onClick, type }) => (
    <button type={type} className="btn-submit" onClick={onClick}>
        {value}
    </button>
)

Button.propTypes = {
    value: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    type: PropTypes.string
}

Button.defaultProps = {
    type: 'button',
    onClick: () => {}
}

export default Button
