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

export default function FormUser({
  type,
  open,
  allUsers,
  handleClose,
  actionUser,
}) {
  const dispatch = useDispatch()
  const [bureaux, setBureaux] = useState([])
  const user = useSelector((state) => state.user)
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      bureau: null,
      action: 'affecter',
    },
  })

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
          <form onSubmit={handleSubmit(actionUser)}>
            <Controller
              name="bureau"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  fullWidth
                  includeInputInList
                  id="tags-standard"
                  options={allUsers.filter((s) => {
                    return (
                      s.deletedAt === null &&
                      s.role === 'guichier' &&
                      user.bureau.listeEmploye.employe.filter((ls) => {
                        return s._id === ls._id
                      }).length === 0
                    )
                  })}
                  getOptionLabel={(option) => option.nom + ' ' + option.prenom}
                  defaultValue={null}
                  onChange={(event, item) => {
                    onChange(item)
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.nom + ' ' + option.prenom ===
                    value.nom + ' ' + value.prenom
                  }
                  value={value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Liste des bureaux"
                      placeholder="Bureaux"
                    />
                  )}
                />
              )}
            />
            <NeoButton text={'Affecter'} type={'success'} />
          </form>
        </Box>
      </Modal>
    </div>
  )
}
