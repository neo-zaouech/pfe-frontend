import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import NeoButton from '../../Components/NeoButton'
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import { useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import listeActions from '../../redux/actions'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

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

export default function FormUser({ type, open, handleClose }) {
  const dispatch = useDispatch()
  const [bureaux, setBureaux] = useState([])
  const user = useSelector((state) => state.user)
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      email: type === 'add' ? '' : user.email,
      nom: type === 'add' ? '' : user.nom,
      motPasse: type === 'add' ? '' : user.motPasse,
      prenom: type === 'add' ? '' : user.prenom,
      cin: type === 'add' ? '' : user.cin,
      role: 'guichier',
    },
  })

  const getBreaux = () => {
    axios
      .get('http://127.0.0.1:5000/admin/bureau')
      .then((response) => {
        setBureaux(response.data)
      })
      .catch((error) => {})
  }

  const actionService = (data) => {
    const { email, nom, prenom, cin, role, motPasse } = data
    if (type === 'add') {
      axios
        .post('http://127.0.0.1:5000/admin/user', {
          email,
          nom,
          motPasse,
          prenom,
          cin,
          role: 'guichier',
          bureau: user.bureau,
        })
        .then((response) => {
          localStorage.setItem(
            'user',
            JSON.stringify({ ...user, bureau: response.data })
          )
          dispatch({ type: listeActions.addEmploye, bureau: response.data })
          window.location.reload()
        })
        .catch((error) => {})
    } else {
      axios
        .put('http://127.0.0.1:5000/admin/user', {
          userReq: {
            ...user,
            email,
            nom,
            prenom,
            cin,
            role,
            bureau: user.bureau,
          },
        })
        .then((response) => {
          handleClose()
          localStorage.setItem(
            'user',
            JSON.stringify({ ...user, bureau: response.data })
          )
          dispatch({ type: listeActions.addEmploye, bureau: response.data })
        })
        .catch((error) => {})
    }
  }

  useEffect(() => {
    getBreaux()
  }, [])

  useEffect(() => {
    reset({
      email: type === 'add' ? '' : user.email,
      nom: type === 'add' ? '' : user.nom,
      prenom: type === 'add' ? '' : user.prenom,
      cin: type === 'add' ? '' : user.cin,
      role: type === 'add' ? '' : user.role,
      bureau: type === 'add' ? null : user.bureau,
    })
  }, [type, user])

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleSubmit(actionService)}>
            <Stack spacing={3} alignItems={'center'}>
              <Controller
                name={'nom'}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    label={'First Name'}
                  />
                )}
              />
              <Controller
                name={'prenom'}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    label={'Last Name'}
                  />
                )}
              />
              <Controller
                name={'motPasse'}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    hidden={type === 'edit'}
                    type="password"
                    fullWidth
                    value={value}
                    onChange={onChange}
                    label={'Password'}
                  />
                )}
              />
              <Controller
                name={'cin'}
                control={control}
                rules={{
                  required: { value: true, message: 'CIN required' },
                  minLength: { value: 8, message: 'Length must be 8' },
                  maxLength: { value: 8, message: 'Length must be 8' },
                }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <TextField
                    fullWidth
                    type="number"
                    value={value}
                    onChange={onChange}
                    label={'CIN'}
                    error={!!error}
                    helperText={error && error.message}
                  />
                )}
              />
              <Controller
                name={'email'}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    type="email"
                    value={value}
                    onChange={onChange}
                    label={'Email'}
                  />
                )}
              />
              <Controller
                name={'role'}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                    <Select
                      disabled
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={'guichier'}
                      label="Role"
                      onChange={onChange}
                    >
                      <MenuItem value={'guichier'}>Guichier</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />

              <NeoButton
                text={type === 'add' ? 'Add new' : 'Edit'}
                type={type === 'add' ? 'success' : 'edit'}
              />
            </Stack>
          </form>
        </Box>
      </Modal>
    </div>
  )
}
