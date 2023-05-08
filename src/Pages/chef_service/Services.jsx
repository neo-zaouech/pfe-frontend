import {
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  const { statusService, user } = useSelector((state) => state)
  const dispatch = useDispatch()

  useEffect(() => {
    setServices(user.bureau.listeServices)
    if (statusService !== null) {
      dispatch({ type: listeActions.statusService, statusService: null })
    }
  }, [statusService])

  const deleteService = (idService) => {
    axios
      .delete('http://127.0.0.1:5000/admin/service', { data: { idService } })
      .then((response) => {
        console.log(response.data)
        setServices(response.data)
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
      <NeoButton
        text={'add Service'}
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
            {services.map((service) => (
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
                      Edit
                    </Button>
                  )}

                  {service.deletedAt !== null ? (
                    <Button
                      onClick={() => deleteService(service._id)}
                      color="success"
                      variant="contained"
                      startIcon={<DeleteForeverIcon />}
                    >
                      Restore
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        if (
                          window.confirm('Are you sure to delete this office ?')
                        ) {
                          deleteService(service._id)
                        }
                      }}
                      color="error"
                      variant="contained"
                      startIcon={<DeleteForeverIcon />}
                    >
                      Delete
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

export default LocalServices
