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

  const [allUsers, setAllUsers] = useState([])

  const getUsers = () => {
    axios
      .get('http://127.0.0.1:5000/admin/user')
      .then((response) => {
        setAllUsers(response.data)
      })
      .catch((error) => {})
  }

  useEffect(() => {
    getUsers()
  }, [user])

  const actionUser = (data) => {
    axios
      .post('http://127.0.0.1:5000/chef_service/user', {
        idGuichier: data.bureau._id,
        idBureau: user.bureau._id,
        action: data.action ? '' : 'affecter',
      })
      .then((response) => {
        setOpen(false)
        localStorage.setItem(
          'user',
          JSON.stringify({ ...user, bureau: response.data })
        )
        dispatch({ type: listeActions.statusUser, statusService: data.action })
        dispatch({
          type: listeActions.login,
          user: { ...user, bureau: response.data },
        })
      })
    console.log('sfbqsdjfqds', data)
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
        <FormUser
          actionUser={actionUser}
          type={type}
          user={serviceProps}
          allUsers={allUsers}
          open={open}
          handleClose={() => setOpen(false)}
        />
      )}
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
            </TableRow>
          </TableHead>
          <TableBody>
            {user.bureau.listeEmploye.employe.map((u, index) => {
              return (
                <TableRow
                  key={u}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell></TableCell>
                  <TableCell component="th" scope="row">
                    {allUsers.find((lu) => {
                      return lu._id == u._id
                    }) != undefined
                      ? allUsers.find((lu) => {
                          return lu._id == u._id
                        }).nom +
                        ' ' +
                        allUsers.find((lu) => {
                          return lu._id == u._id
                        }).prenom
                      : ''}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {allUsers.find((lu) => {
                      return lu._id == u._id
                    }) != undefined
                      ? allUsers.find((lu) => {
                          return lu._id == u._id
                        }).email
                      : ''}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {allUsers.find((lu) => {
                      return lu._id == u._id
                    }) != undefined
                      ? allUsers.find((lu) => {
                          return lu._id == u._id
                        }).cin
                      : ''}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {allUsers.find((lu) => {
                      return lu._id == u._id
                    }) != undefined
                      ? allUsers.find((lu) => {
                          return lu._id == u._id
                        }).role
                      : ''}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{ display: 'flex', justifyContent: 'space-around' }}
                  >
                    <Button
                      onClick={() => {
                        if (
                          window.confirm('Are you sure to delete this office ?')
                        ) {
                          actionUser({ bureau: u, action: 'delete' })
                        }
                      }}
                      color="error"
                      variant="contained"
                      startIcon={<DeleteForeverIcon />}
                    >
                      Delete
                    </Button>
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
