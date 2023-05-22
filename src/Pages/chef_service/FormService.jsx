import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import NeoButton from '../../Components/NeoButton'
import { Autocomplete, TextField } from '@mui/material'
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

export default function FormService({
  type,
  service,
  open,
  allServices,
  handleClose,
  actionService,
}) {
  const [name, setName] = useState(type === 'add' ? '' : service.name)
  const dispatch = useDispatch()
  const { control, handleSubmit } = useForm({
    defaultValues: { service: null, action: 'affecter' },
  })
  const user = useSelector((state) => state.user)
  const [services, setServices] = useState([])
  const getServices = () => {
    axios
      .get('http://127.0.0.1:5000/admin/service')
      .then((response) => {
        setServices(response.data)
      })
      .catch((error) => {})
  }

  useEffect(() => {
    console.log(allServices)
    getServices()
  }, [])

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
          <form onSubmit={handleSubmit(actionService)}>
            <Controller
              name="service"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  fullWidth
                  includeInputInList
                  id="tags-standard"
                  options={allServices.filter((s) => {
                    return (
                      s.deletedAt === null &&
                      user.bureau.listeServices.filter((ls) => {
                        return s._id === ls._id
                      }).length === 0
                    )
                  })}
                  getOptionLabel={(option) => option.name}
                  defaultValue={null}
                  onChange={(event, item) => {
                    onChange(item)
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.name === value.name
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
