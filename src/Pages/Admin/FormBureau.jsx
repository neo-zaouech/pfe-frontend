import {
  Autocomplete,
  Box,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import NeoButton from '../../Components/NeoButton'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import Map from '../../Components/map/Map'
import governments from '../../goverments'
import {
  DateTimePicker,
  LocalizationProvider,
  TimePicker,
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DayCalendar } from '@mui/x-date-pickers/internals'
import dayjs from 'dayjs'
import { Label } from '@mui/icons-material'

const FormBureau = () => {
  const [gov, setGov] = useState('TU')
  const [services, setServices] = useState([])
  const [users, setUsers] = useState([])
  const [horaire, setHoraire] = useState([])
  const route = useLocation()
  const { control, handleSubmit } = useForm({
    defaultValues: {
      localisation: {},
      listeServices: [],
      city: '',
    },
  })

  const submitForm = (data) => {
    const { listeServices, city } = data
    if (route.state !== null) {
    } else {
      axios.post(`${process.env.REACT_APP_URL}/admin/bureau`, {
        localisation: { gov: gov, city: city },
        listeServices: listeServices,
        horaire: [],
      })
    }
  }

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_URL}/admin/service`).then((res) => {
      setServices(res.data)
    })
    axios.get(`${process.env.REACT_APP_URL}/admin/user`).then((res) => {
      setUsers(res.data)
    })
  }, [])

  useEffect(() => {
    console.log(horaire)
  }, [horaire])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack
        justifyContent={'center'}
        alignItems={'center'}
        pt={10}
        direction={'row'}
      >
        <span hidden>{gov}</span>
        <Map gov={gov} setGov={setGov} />
        <form onSubmit={handleSubmit(submitForm)}>
          <Stack
            height={'50vh'}
            spacing={5}
            width={'300px'}
            alignItems={'center'}
          >
            <Controller
              name="government"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  fullWidth
                  id="tags-standard"
                  options={governments}
                  getOptionLabel={(option) => option.name}
                  defaultValue={[]}
                  onChange={(event, item) => {
                    onChange(item)
                    setGov(item.code)
                  }}
                  value={governments.find((g) => g.code === gov)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Gouvernement"
                    />
                  )}
                />
              )}
            />
            <Controller
              name="city"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  label="City"
                />
              )}
            />
            <Controller
              name="listeServices"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  multiple
                  fullWidth
                  id="tags-standard"
                  options={services}
                  getOptionLabel={(option) => option.name}
                  defaultValue={[]}
                  onChange={(event, item) => {
                    onChange(item)
                  }}
                  value={value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Liste des services"
                      placeholder="Favorites"
                    />
                  )}
                />
              )}
            />
            <Controller
              name="chefService"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  multiple
                  fullWidth
                  id="tags-standard"
                  options={users.filter(({ role }) => {
                    return role === 'chef_service'
                  })}
                  getOptionLabel={(option) => option.nom + ' ' + option.prenom}
                  defaultValue={[]}
                  onChange={(event, item) => {
                    onChange(item)
                  }}
                  value={value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Chef services"
                      placeholder="Favorites"
                    />
                  )}
                />
              )}
            />
            <NeoButton
              type={'edit'}
              text={'Add Horaire'}
              onClick={() => {
                setHoraire([
                  ...horaire,
                  {
                    dateDeb: '',
                    dateFin: '',
                    heureDeb: '',
                    heureFin: '',
                  },
                ])
              }}
            />
            {horaire.map((h, index) => {
              return (
                <Stack
                  direction={'row'}
                  width={'600px'}
                  key={index}
                  spacing={2}
                >
                  <Label />
                  <Box>
                    <InputLabel id="demo-simple-select-label">
                      Start Date
                    </InputLabel>
                    <Select
                      id="demo-simple-select-label"
                      label="Start Date"
                      defaultValue="LU"
                    >
                      <MenuItem value={'LU'}>Monday</MenuItem>
                      <MenuItem value={'MA'}>Tuesday</MenuItem>
                      <MenuItem value={'ME'}>Wednesday</MenuItem>
                      <MenuItem value={'JE'}>Thursday</MenuItem>
                      <MenuItem value={'VE'}>Friday</MenuItem>
                      <MenuItem value={'SA'}>Saturday</MenuItem>
                      <MenuItem value={'DI'}>Sunday</MenuItem>
                    </Select>
                  </Box>
                  <Box>
                    <InputLabel id="demo-simple-select-label">
                      Start Date
                    </InputLabel>
                    <Select
                      id="demo-simple-select-label"
                      label="End Date"
                      defaultValue="LU"
                    >
                      <MenuItem value={'LU'}>Monday</MenuItem>
                      <MenuItem value={'MA'}>Tuesday</MenuItem>
                      <MenuItem value={'ME'}>Wednesday</MenuItem>
                      <MenuItem value={'JE'}>Thursday</MenuItem>
                      <MenuItem value={'VE'}>Friday</MenuItem>
                      <MenuItem value={'SA'}>Saturday</MenuItem>
                      <MenuItem value={'DI'}>Sunday</MenuItem>
                    </Select>
                  </Box>
                  <Box>
                    <InputLabel id="demo-simple-select-label">
                      Heure début
                    </InputLabel>
                    <TimePicker
                      id="demo-simple-select-label"
                      label=""
                      onChange={(value) => {
                        const x = [...horaire]
                        x[index].heureDeb = dayjs(value).format('HH:mm:ss')
                        setHoraire(x)
                      }}
                    />
                  </Box>
                  <Box>
                    <InputLabel id="demo-simple-select-label">
                      End Time
                    </InputLabel>
                    <TimePicker
                      id="demo-simple-select-label"
                      label=""
                      onChange={(value) => {
                        const x = [...horaire]
                        x[index].heureDeb = dayjs(value).format('HH:mm:ss')
                        setHoraire(x)
                      }}
                    />
                  </Box>
                </Stack>
              )
            })}
            <NeoButton type={'success'} text={'Edit'} />
          </Stack>
        </form>
      </Stack>
    </LocalizationProvider>
  )
}

export default FormBureau
