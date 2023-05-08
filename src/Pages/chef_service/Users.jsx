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
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import SettingsIcon from '@mui/icons-material/Settings'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import NeoButton from '../../Components/NeoButton'
import { useDispatch, useSelector } from 'react-redux'
import listeActions from '../../redux/actions'
import FormUser from './FormUser'
const LocalUsers = () => {
  const [type, setType] = useState('add')
  const [open, setOpen] = useState(false)
  const [serviceProps, setServiceProps] = useState(false)
  const [employes, setEmployes] = useState([])
  const { statusService, user } = useSelector((state) => state)
  const dispatch = useDispatch()

  useEffect(() => {
    setEmployes(user.bureau.listeEmploye.employe || [])
    if (statusService !== null) {
      dispatch({ type: listeActions.statusService, statusService: null })
    }
  }, [statusService])

  const deleteUser = (idUser) => {
    axios
      .delete('http://127.0.0.1:5000/admin/user', { data: { idUser } })
      .then((response) => {
        console.log(response.data)
        setEmployes(response.data)
      })
  }

  const [users, setServices] = useState([])

  const getUsers = () => {
    axios
      .get('http://127.0.0.1:5000/admin/user')
      .then((response) => {
        setServices(response.data)
      })
      .catch((error) => {})
  }

  useEffect(() => {
    getUsers()
  }, [user])

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
      <FormUser
        type={type}
        user={serviceProps}
        open={open}
        handleClose={() => setOpen(false)}
      />
      <NeoButton
        text={'add User'}
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
              <TableCell>Name</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">CIN</TableCell>
              <TableCell align="center">Role</TableCell>
              <TableCell align="center">Bureau</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employes.map((u, index) => {
              return (
                <TableRow
                  key={u}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {users.find((lu) => {
                      return lu._id == u
                    }) != undefined
                      ? users.find((lu) => {
                          return lu._id == u
                        }).nom
                      : ''}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {users.find((lu) => {
                      return lu._id == u
                    }) != undefined
                      ? users.find((lu) => {
                          return lu._id == u
                        }).email
                      : ''}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {users.find((lu) => {
                      return lu._id == u
                    }) != undefined
                      ? users.find((lu) => {
                          return lu._id == u
                        }).cin
                      : ''}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {users.find((lu) => {
                      return lu._id == u
                    }) != undefined
                      ? users.find((lu) => {
                          return lu._id == u
                        }).role
                      : ''}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {users.find((lu) => {
                      return lu._id == u
                    }) != undefined
                      ? users.find((lu) => {
                          return lu._id == u
                        }).bureau._id
                      : ''}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ display: 'flex', justifyContent: 'space-around' }}
                  >
                    {u.deletedAt === null && (
                      <Button
                        color="warning"
                        variant="contained"
                        startIcon={<SettingsIcon />}
                        onClick={() => {
                          setType('edit')
                          setOpen(true)
                          setServiceProps(u)
                        }}
                      >
                        Edit
                      </Button>
                    )}

                    {u.deletedAt !== null ? (
                      <Button
                        onClick={() => deleteUser(u._id)}
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
                            window.confirm(
                              'Are you sure to delete this office ?'
                            )
                          ) {
                            deleteUser(u._id)
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
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  )
}

export default LocalUsers
