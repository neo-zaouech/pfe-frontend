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
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import SettingsIcon from '@mui/icons-material/Settings'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import NeoButton from '../../Components/NeoButton'
import { useDispatch, useSelector } from 'react-redux'
import listeActions from '../../redux/actions'
import FormUser from './FormUser'
import ScreenSearchDesktopIcon from '@mui/icons-material/ScreenSearchDesktop'
import governments from '../../goverments'
const Users = () => {
  const [type, setType] = useState('add')
  const [open, setOpen] = useState(false)
  const [serviceProps, setServiceProps] = useState(false)
  const [users, setServices] = useState([])
  const [search, setSearch] = useState('')

  const statusUser = useSelector((state) => state.statusUser)
  const dispatch = useDispatch()
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
    if (statusUser !== null) {
      dispatch({ type: listeActions.statusUser, statusUser: null })
    }
  }, [statusUser])

  const deleteUser = (idUser) => {
    axios
      .delete('http://127.0.0.1:5000/admin/user', { data: { idUser } })
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
      <FormUser
        type={type}
        user={serviceProps}
        open={open}
        handleClose={() => setOpen(false)}
      />
      <Stack direction={'row'} spacing={5}>
        <NeoButton
          text={'add User'}
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
              <TableCell>Name</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">CIN</TableCell>
              <TableCell align="center">Role</TableCell>
              <TableCell align="center">Bureau</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .filter((user) => {
                console.log(user)
                return (
                  user.cin.includes(search) ||
                  user.nom.toUpperCase().includes(search.toUpperCase()) ||
                  user.prenom.toUpperCase().includes(search.toUpperCase()) ||
                  user.email.toUpperCase().includes(search.toUpperCase()) ||
                  user.role.toUpperCase().includes(search.toUpperCase()) ||
                  governments
                    .find((governement) => {
                      return user.bureau
                        ? governement.code === user.bureau.localisation.gov
                        : governement
                    })
                    .name.toUpperCase()
                    .includes(search.toUpperCase())
                )
              })
              .map((user) => (
                <TableRow
                  key={user._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {user.deletedAt === null ? (
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
                    {user.nom + ' ' + user.prenom}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {user.email}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {user.cin}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {user.role}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {user.bureau &&
                      user.bureau.localisation &&
                      `${user.bureau.localisation.gov} - ${user.bureau.localisation.city}`}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ display: 'flex', justifyContent: 'space-around' }}
                  >
                    {user.deletedAt === null && (
                      <Button
                        color="warning"
                        variant="contained"
                        startIcon={<SettingsIcon />}
                        onClick={() => {
                          setType('edit')
                          setOpen(true)
                          setServiceProps(user)
                        }}
                      >
                        Edit
                      </Button>
                    )}

                    {user.deletedAt !== null ? (
                      <Button
                        onClick={() => deleteUser(user._id)}
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
                            deleteUser(user._id)
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

export default Users
