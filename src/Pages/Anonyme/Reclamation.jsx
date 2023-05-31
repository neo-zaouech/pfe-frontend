import {
  Alert,
  Autocomplete,
  Box,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import NeoButton from '../../Components/NeoButton'
import validator from 'validator'
const Reclamation = () => {
  const { control, handleSubmit, reset, setError } = useForm({
    defaultValues: { bureau: null, text: '', email: '' },
  })
  const [bureaux, setBureaux] = useState([])
  const [open, setOpen] = useState(false)

  const getBreaux = () => {
    axios
      .get('http://127.0.0.1:5000/admin/bureau')
      .then((response) => {
        setBureaux(response.data)
      })
      .catch((error) => {})
  }

  const sendReclamation = (data) => {
    const { bureau, text, email } = data
    if (text)
      if (email && validator.isEmail(email))
        axios
          .post('http://127.0.0.1:5000/reclamation', { bureau, text, email })
          .then((response) => {
            reset()
            setOpen(true)
          })
      else setError('email', { message: 'Vérifier votre email' })
    else setError('text', { message: 'Péciser votre réclamation' })
  }
  useEffect(() => {
    getBreaux()
  }, [])
  return (
    <Stack pt={5} spacing={5} alignItems={'center'} justifyContent={'center'}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => {
          setOpen(false)
        }}
      >
        <Alert
          severity="success"
          sx={{ width: '100%' }}
          onClose={() => {
            setOpen(false)
          }}
        >
          Votre réclamation à été envoyée avec succés
        </Alert>
      </Snackbar>
      <Typography> Envoyer votre réclamation aux admins</Typography>
      <form onSubmit={handleSubmit(sendReclamation)}>
        <Stack
          height={'100%'}
          width={'450px'}
          justifyContent={'center'}
          alignItems={'center'}
          alignSelf={'center'}
          spacing={5}
        >
          <Controller
            control={control}
            name="bureau"
            render={({ field: { value, onChange } }) => (
              <Controller
                name="bureau"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    sx={{ width: '450px' }}
                    includeInputInList
                    id="tags-standard"
                    options={bureaux}
                    getOptionLabel={(option) =>
                      `${option.localisation.gov} - ${option.localisation.city}`
                    }
                    defaultValue={[]}
                    onChange={(event, item) => {
                      onChange(item)
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option._id === value._id
                    }
                    value={value}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Liste des bureaux"
                        placeholder="Bureaux"
                      />
                    )}
                  />
                )}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <TextField
                type="email"
                fullWidth
                multiline
                value={value}
                onChange={onChange}
                label="Email"
                error={!!error}
                helperText={error && error.message}
              />
            )}
          />
          <Controller
            control={control}
            name="text"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <TextField
                fullWidth
                multiline
                value={value}
                onChange={onChange}
                label="Texte"
                error={!!error}
                helperText={error && error.message}
              />
            )}
          />
          <NeoButton type={'success'} text={'envoyer'} />
        </Stack>
      </form>
    </Stack>
  )
}

export default Reclamation
