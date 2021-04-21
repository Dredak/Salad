/* eslint-disable react/display-name */
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from 'react'
import PropTypes from 'prop-types'

import { Dialog } from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'

import CloseIcon from '@material-ui/icons/Close'

import './style.scss'

const KEY_CODE = {
  ESC: 27,
}

const CustomModal = forwardRef((props, ref) => {
  const {
    title,
    okText = 'Ok',
    cancelText = 'Cancel',
    onOk,
    onCancel,
    onClose,
    children,
    disabled,
    ...rest
  } = props

  const [visible, setVisible] = useState(false)

  const close = useCallback(() => {
    setVisible(false)
  }, [])
  const open = useCallback(() => {
    setVisible(true)
  }, [])

  useImperativeHandle(ref, () => ({
    close,
    open,
    isOpen: visible,
  }))

  return (
    <Dialog
      classes={{ root: 'Modal' }}
      open={visible}
      onKeyDown={event => {
        if (event.keyCode === KEY_CODE.ESC) {
          onCancel(event)
        }
      }}
      onClose={onCancel}
      {...rest}
    >
      <MuiDialogTitle classes={{ root: 'Modal-title' }}>
        <Typography>{title}</Typography>
        <IconButton
          aria-label="close"
          classes={{ root: 'button-root' }}
          onClick={event => {
            onClose && onClose()
            onCancel(event)
          }}
        >
          <CloseIcon />
        </IconButton>
      </MuiDialogTitle>
      <MuiDialogContent dividers>{children}</MuiDialogContent>
      <MuiDialogActions>
        <Button onClick={onCancel} color="primary" variant="outlined">
          {cancelText}
        </Button>
        <Button
          onClick={onOk}
          variant="contained"
          color="primary"
          disabled={disabled}
        >
          {okText}
        </Button>
      </MuiDialogActions>
    </Dialog>
  )
})

export default CustomModal

CustomModal.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  onClose: PropTypes.func,
  children: PropTypes.node,
  disabled: PropTypes.bool,
}
