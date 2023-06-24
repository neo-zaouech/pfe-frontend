import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import NeoButton from '../../Components/NeoButton'
import { TextField } from '@mui/material'
import { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import listeActions from '../../redux/actions'
import { useEffect } from 'react'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
}

export default function FormService({ type, service, open, handleClose }) {
  const [name, setName] = useState(type === 'add' ? '' : service.name)
  const dispatch = useDispatch()

  const actionService = () => {
    if (type === 'add') {
      axios
        .post('http://127.0.0.1:5000/admin/service', {
          name,
        })
        .then((response) => {
          handleClose()
          dispatch({ type: listeActions.statusService, statusService: 'add' })
        })
        .catch((error) => {})
    } else {
      axios
        .put('http://127.0.0.1:5000/admin/service', {
          serviceReq: { ...service, name },
        })
        .then((response) => {
          handleClose()
          dispatch({ type: listeActions.statusService, statusService: 'edit' })
        })
        .catch((error) => {})
    }
  }

  useEffect(() => {
    if (type === 'edit') {
      setName(service.name)
    } else {
      setName('')
    }
  }, [type, service])

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <TextField
              sx={{ mb: '30px' }}
              fullWidth
              label={'Nom du service'}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <NeoButton
              text={type === 'add' ? 'Ajouter nouveau' : 'Modifier'}
              type={type === 'add' ? 'success' : 'edit'}
              onClick={() => {
                actionService()
              }}
            />
          </form>
        </Box>
      </Modal>
    </div>
  )
}
