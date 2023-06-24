import React, { useEffect, useState } from 'react'
import NeoButton from '../../Components/NeoButton'
import {
  Button,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import axios from 'axios'
import ScreenSearchDesktopIcon from '@mui/icons-material/ScreenSearchDesktop'
import FormActualite from './FormActualite'
import listeActions from '../../redux/actions'
import { useDispatch, useSelector } from 'react-redux'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import dayjs from 'dayjs'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

const Guichier = () => {
  const [actualites, setActualites] = useState([])
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const { user, statusActualite } = useSelector((state) => state)
  const getActualite = () => {
    axios.get('http://127.0.0.1:5000/actualite').then((response) => {
      setActualites(
        response.data.filter((actualite) => {
          return actualite.bureau._id === user.bureau._id
        })
      )
    })
  }

  useEffect(() => {
    getActualite()
  }, [])

  useEffect(() => {
    getActualite()
    if (statusActualite !== null) {
      dispatch({ type: listeActions.statusActualite, statusActualite: null })
    }
  }, [statusActualite])

  const deleteActualite = (idActualite) => {
    axios
      .delete('http://127.0.0.1:5000/actualite', {
        data: { id: idActualite },
      })
      .then((response) => {
        setActualites(response.data)
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
      {user.bureau ? (
        <>
          {' '}
          <FormActualite
            type={'add'}
            actualite={null}
            open={open}
            handleClose={() => setOpen(false)}
          />
          <Stack direction={'row'} spacing={5}>
            <NeoButton
              text={'Ajouter Actualité'}
              type={'success'}
              onClick={() => {
                setOpen(true)
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
                  <TableCell align="center">Image</TableCell>
                  <TableCell align="center">Texte</TableCell>
                  <TableCell align="center">Crée par : </TableCell>
                  <TableCell align="center">Date de création</TableCell>
                  <TableCell align="center">Supprimée</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {actualites
                  .filter((actualite) => {
                    return (
                      (actualite.employe.nom + ' ' + actualite.employe.prenom)
                        .toUpperCase()
                        .includes(search.toUpperCase()) ||
                      actualite.text
                        .toUpperCase()
                        .includes(search.toUpperCase())
                    )
                  })
                  .map((actualite) => {
                    return (
                      <TableRow
                        key={user._id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
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
                        <TableCell align="center">
                          <img
                            height={'50px'}
                            src={
                              'http://127.0.0.1:5000/images/' + actualite.image
                            }
                            alt=""
                          />
                        </TableCell>
                        <TableCell align="center">{actualite.text}</TableCell>
                        <TableCell align="center">
                          {actualite.employe.nom +
                            ' ' +
                            actualite.employe.prenom}
                        </TableCell>
                        <TableCell align="center">
                          {dayjs(actualite.createdAt).format(
                            'DD-MM-YYYY -  HH:mm'
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {actualite.deletedAt &&
                            dayjs(actualite.deletedAt).format(
                              'DD-MM-YYYY -  HH:mm'
                            )}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-around',
                          }}
                        >
                          {actualite.deletedAt !== null ? (
                            <Button
                              onClick={() =>
                                deleteActualite(actualite._id, false)
                              }
                              color="success"
                              variant="contained"
                              startIcon={<DeleteForeverIcon />}
                            >
                              Restorer
                            </Button>
                          ) : (
                            <Button
                              onClick={() => {
                                deleteActualite(actualite._id)
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
                    )
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Typography textAlign={'center'}>
          Vous n'êtes pas affecté au aucun bureau
        </Typography>
      )}
    </Stack>
  )
}

export default Guichier
