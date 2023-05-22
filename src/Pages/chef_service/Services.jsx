import {
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
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
const LocalServices = () => {
  const [type, setType] = useState('add')
  const [open, setOpen] = useState(false)
  const [serviceProps, setServiceProps] = useState(false)
  const [services, setServices] = useState([])
  const [allServices, setAllServices] = useState([])
  const { statusService, user } = useSelector((state) => state)
  const dispatch = useDispatch()

  const getServices = () => {
    axios
      .get('http://127.0.0.1:5000/admin/service')
      .then((response) => {
        setAllServices(response.data)
      })
      .catch((error) => {})
  }
  useEffect(() => {
    getServices()
    setServices(user.bureau ? user.bureau.listeServices : [])
    if (statusService !== null) {
      dispatch({ type: listeActions.statusService, statusService: null })
    }
  }, [statusService])

  // const deleteService = (idService) => {
  //   axios
  //     .delete('http://127.0.0.1:5000/admin/service', { data: { idService } })
  //     .then((response) => {
  //       localStorage.setItem(
  //         'user',
  //         JSON.stringify({ ...user, bureau: response.data.bureau })
  //       )
  //       dispatch({
  //         type: listeActions.login,
  //         user: { ...user, bureau: response.data.bureau },
  //       })
  //       setServices(response.data.bureau.listeServices)
  //     })
  // }

  const actionService = (data) => {
    axios
      .post('http://127.0.0.1:5000/chef_service/service', {
        idService: data.service._id,
        idBureau: user.bureau._id,
        action: data.action,
      })
      .then((response) => {
        setOpen(false)
        localStorage.setItem(
          'user',
          JSON.stringify({ ...user, bureau: response.data })
        )
        dispatch({ type: listeActions.statusService, statusService: 'delete' })
        dispatch({
          type: listeActions.login,
          user: { ...user, bureau: response.data },
        })
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
      {open && (
        <FormService
          actionService={actionService}
          type={type}
          service={serviceProps}
          allServices={allServices}
          open={open}
          handleClose={() => setOpen(false)}
        />
      )}
      {user.bureau ? (
        <>
          {' '}
          <NeoButton
            text={'Affecter Service'}
            type={'success'}
            onClick={() => {
              setType('add')
              setOpen(true)
              setServiceProps(null)
            }}
          />
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Name of Service</TableCell>
                  <TableCell align="center">crée le</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.reverse().map((service) => (
                  <TableRow
                    key={service._id + '' + Math.random()}
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
                      <Button
                        onClick={() => {
                          if (
                            window.confirm(
                              'Are you sure to delete this office ?'
                            )
                          ) {
                            actionService({ service, action: 'désaffecter' })
                          }
                        }}
                        color="error"
                        variant="contained"
                        startIcon={<DeleteForeverIcon />}
                      >
                        Désaffecter
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Typography>Vous n'etes pas affecté au aucun bureau</Typography>
      )}
    </Stack>
  )
}

export default LocalServices
