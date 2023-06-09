import {
  Button,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import axios from 'axios'
import dayjs from 'dayjs'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import SettingsIcon from '@mui/icons-material/Settings'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import NeoButton from '../../Components/NeoButton'
import FormService from './FormService'
import { useDispatch, useSelector } from 'react-redux'
import listeActions from '../../redux/actions'
import ScreenSearchDesktopIcon from '@mui/icons-material/ScreenSearchDesktop'
import Swal from 'sweetalert2'

const Services = () => {
  const [type, setType] = useState('add')
  const [open, setOpen] = useState(false)
  const [serviceProps, setServiceProps] = useState(false)
  const [services, setServices] = useState([])
  const statusService = useSelector((state) => state.statusService)
  const [search, setSearch] = useState('')

  const dispatch = useDispatch()
  const getServices = () => {
    axios
      .get('http://127.0.0.1:5000/admin/service')
      .then((response) => {
        setServices(response.data)
      })
      .catch((error) => {})
  }

  useEffect(() => {
    getServices()
    if (statusService !== null) {
      dispatch({ type: listeActions.statusService, statusService: null })
    }
  }, [statusService])

  const deleteService = (idService, deleted = true) => {
    deleted
      ? Swal.fire({
          title: 'Etes vous sur de supprimer ce service',
          text: '',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Oui',
          cancelButtonText: 'Non',
        }).then((result) => {
          if (result.isConfirmed) {
            axios
              .delete('http://127.0.0.1:5000/admin/service', {
                data: { idService },
              })
              .then((response) => {
                console.log(response.data)
                setServices(response.data)
                Swal.fire('Supprimé!', `Service supprimé avec succé`, 'success')
              })
          }
        })
      : axios
          .delete('http://127.0.0.1:5000/admin/service', {
            data: { idService },
          })
          .then((response) => {
            console.log(response.data)
            setServices(response.data)
            Swal.fire('Restoré!', `Service restoré avec succé`, 'success')
          })
  }
  return (
    <Stack
      position={'absolute'}
      top={0}
      zIndex={-1}
      height={'100vh'}
      width={'100vw'}
      pt={'200px'}
      spacing={3}
    >
      <FormService
        type={type}
        service={serviceProps}
        open={open}
        handleClose={() => setOpen(false)}
      />
      <Stack direction={'row'} spacing={5}>
        <NeoButton
          text={'ajouter Service'}
          type={'success'}
          onClick={() => {
            setType('add')
            setOpen(true)
            setServiceProps(null)
          }}
        />
        <TextField
          id="input-with-icon-textfield"
          label="Rechercher"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <ScreenSearchDesktopIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
      </Stack>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Nom du Service</TableCell>
              <TableCell align="center">crée le</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services
              .filter((s) => {
                return s.name.toUpperCase().includes(search.toUpperCase())
              })
              .map((service) => (
                <TableRow
                  key={service._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {service.deletedAt === null ? (
                      <CheckCircleOutlineIcon
                        htmlColor="green"
                        sx={{ fontSize: '30px' }}
                      />
                    ) : (
                      <HighlightOffIcon
                        htmlColor="red"
                        sx={{ fontSize: '30px' }}
                      />
                    )}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {service.name}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {dayjs(service.createdAt).format('YYYY-MM-DD HH:mm')}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{ display: 'flex', justifyContent: 'space-around' }}
                  >
                    {service.deletedAt === null && (
                      <Button
                        color="warning"
                        variant="contained"
                        startIcon={<SettingsIcon />}
                        onClick={() => {
                          setType('edit')
                          setOpen(true)
                          setServiceProps(service)
                        }}
                      >
                        Modifier
                      </Button>
                    )}

                    {service.deletedAt !== null ? (
                      <Button
                        onClick={() => deleteService(service._id, false)}
                        color="success"
                        variant="contained"
                        startIcon={<DeleteForeverIcon />}
                      >
                        Restorer
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          deleteService(service._id)
                        }}
                        color="error"
                        variant="contained"
                        startIcon={<DeleteForeverIcon />}
                      >
                        Supprimer
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  )
}

export default Services
