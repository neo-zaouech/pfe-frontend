import {
  Autocomplete,
  Box,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import NeoButton from '../../Components/NeoButton'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Map from '../../Components/map/Map'
import governments from '../../goverments'
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { Label } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
const FormBureau = ({ type }) => {
  const route = useLocation()
  const navigate = useNavigate()
  const [gov, setGov] = useState(
    type === 'add' ? null : route.state.bureau.localisation.gov
  )
  const [services, setServices] = useState(
    type === 'add' ? [] : route.state.bureau.listeServices
  )
  const [users, setUsers] = useState([])
  const [horaire, setHoraire] = useState(
    type === 'add' ? [] : route.state.bureau.horaire
  )

  const { control, handleSubmit } = useForm({
    defaultValues:
      type === 'add'
        ? {
            localisation: {},
            listeServices: [],
            city: '',
            chefService: null,
          }
        : {
            listeServices: services,
            city: route.state.bureau.localisation.city,
            chefService: route.state.bureau.listeEmploye.chefService,
          },
  })

  const submitForm = (data) => {
    const { listeServices, city, chefService } = data
    if (type === 'add') {
      console.log(data)
      axios
        .post(`${process.env.REACT_APP_URL}/admin/bureau`, {
          localisation: { gov: gov, city: city },
          listeServices: listeServices,
          horaire,
          chefService,
        })
        .then((response) => {
          navigate('/bureaux')
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      axios
        .put(`${process.env.REACT_APP_URL}/admin/bureau`, {
          bureauReq: {
            ...route.state.bureau,
            localisation: { gov: gov, city: city },
            listeServices: listeServices,
            horaire,
            listeEmploye: { chefService },
          },
        })
        .then((response) => {
          navigate('/bureaux')
        })
        .catch((error) => {
          console.log(error)
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
        p={10}
        direction={'row'}
        height={'100%'}
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
                    item ? setGov(item.code) : setGov(null)
                  }}
                  value={
                    governments.find((g) => g !== null && g.code === gov) ||
                    null
                  }
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
                  includeInputInList
                  id="tags-standard"
                  options={services.filter((service) => {
                    return service.deletedAt === null
                  })}
                  getOptionLabel={(option) => option.name}
                  defaultValue={[]}
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
                  fullWidth
                  id="tags-standard"
                  options={users.filter(({ role, deletedAt, bureau }) => {
                    return (
                      role === 'chef_service' &&
                      deletedAt === null &&
                      bureau === null
                    )
                  })}
                  getOptionLabel={(option) => option.nom + ' ' + option.prenom}
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
            <Typography
              sx={{
                cursor: 'pointer',
                zIndex: 1000,
              }}
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
            >
              Add Horaire
            </Typography>
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
                    <InputLabel>Start Date</InputLabel>
                    <Select
                      value={h.dateDeb}
                      label="Start Date"
                      onChange={(event) => {
                        const value = event.target.value
                        const x = [...horaire]
                        x[index].dateDeb = value
                        setHoraire(x)
                      }}
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
                    <InputLabel>Start Date</InputLabel>
                    <Select
                      value={h.dateFin}
                      label="End Date"
                      onChange={(event) => {
                        const value = event.target.value
                        const x = [...horaire]
                        x[index].dateFin = value
                        setHoraire(x)
                      }}
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
                    <InputLabel>Heure début</InputLabel>
                    <TimePicker
                      label=""
                      value={
                        h.heureDeb !== ''
                          ? dayjs('2022-04-17T' + h.heureDeb)
                          : null
                      }
                      onChange={(value) => {
                        const x = [...horaire]
                        x[index].heureDeb = dayjs(value).format('HH:mm')
                        setHoraire(x)
                      }}
                    />
                  </Box>
                  <Box>
                    <InputLabel>End Time</InputLabel>
                    <TimePicker
                      label=""
                      value={
                        h.heureFin !== ''
                          ? dayjs('2022-04-17T' + h.heureFin)
                          : null
                      }
                      onChange={(value) => {
                        const x = [...horaire]
                        x[index].heureFin = dayjs(value).format('HH:mm')
                        setHoraire(x)
                      }}
                    />
                  </Box>
                  <IconButton
                    onClick={() => {
                      console.log(index)
                      let x = [...horaire]
                      x = x.filter((item, i) => {
                        return i !== index
                      })
                      setHoraire(x)
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Stack>
              )
            })}
            <NeoButton
              type={'success'}
              text={type === 'add' ? 'Add new' : 'Edit'}
            />
          </Stack>
        </form>
      </Stack>
    </LocalizationProvider>
  )
}

export default FormBureau
