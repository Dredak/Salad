import React from 'react'
import PropTypes from 'prop-types'

import './style.scss'

const classes = {
  error: 'error-message',
}

const Error = ({ text, ...rest }) => {
  return (
    <div className={classes.error} role="alert" {...rest}>
      {text}
    </div>
  )
}

Error.propTypes = {
  text: PropTypes.string,
}

export default Error
