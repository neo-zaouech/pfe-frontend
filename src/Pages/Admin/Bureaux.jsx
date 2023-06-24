import {
  Button,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import SettingsIcon from '@mui/icons-material/Settings'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { useNavigate } from 'react-router-dom'
import NeoButton from '../../Components/NeoButton'
import governments from '../../goverments'
import InputAdornment from '@mui/material/InputAdornment'
import ScreenSearchDesktopIcon from '@mui/icons-material/ScreenSearchDesktop'
import Swal from 'sweetalert2'
const Bureaux = () => {
  const navigate = useNavigate()
  const [bureaux, setBureaux] = useState([])
  const [search, setSearch] = useState('')
  useEffect(() => {
    axios
      .get('http://127.0.0.1:5000/admin/bureau')
      .then((response) => {
        setBureaux(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  const deleteOffice = (idBureau, deleted = true) => {
    deleted
      ? Swal.fire({
          title: 'Etes vous sur de supprimer ce bureau',
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
              .delete('http://127.0.0.1:5000/admin/bureau', {
                data: { idBureau },
              })
              .then((response) => {
                console.log(response.data)
                setBureaux(response.data)
                Swal.fire('Supprimé!', `Bureau supprimé avec succé`, 'success')
              })
          }
        })
      : axios
          .delete('http://127.0.0.1:5000/admin/bureau', { data: { idBureau } })
          .then((response) => {
            console.log(response.data)
            setBureaux(response.data)
            Swal.fire('Restoré!', `Bureau restoré avec succé`, 'success')
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
      <Stack direction={'row'} spacing={5}>
        <NeoButton
          text={'Ajouter bureau'}
          type={'success'}
          onClick={() => {
            navigate('/add_bureau')
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
              <TableCell>localisation</TableCell>
              <TableCell align="center">chef Service</TableCell>
              <TableCell align="center">Horaires</TableCell>
              <TableCell align="center">Services</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bureaux
              .filter((bureau) => {
                return (
                  governments
                    .find((governement) => {
                      return governement.code === bureau.localisation.gov
                    })
                    .name.toUpperCase()
                    .includes(search.toUpperCase()) ||
                  bureau.localisation.city
                    .toUpperCase()
                    .includes(search.toUpperCase())
                )
              })
              .map((bureau) => (
                <TableRow
                  key={bureau._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {bureau.deletedAt === null ? (
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
                    {`${
                      governments.find((governement) => {
                        return governement.code === bureau.localisation.gov
                      }).name
                    } - ${bureau.localisation.city}`}
                  </TableCell>
                  <TableCell align="center">
                    {bureau.listeEmploye.chefService
                      ? bureau.listeEmploye.chefService.nom +
                        ' ' +
                        bureau.listeEmploye.chefService.prenom
                      : ''}
                  </TableCell>
                  <TableCell align="center">
                    {bureau.horaire.map((horaire, index) => {
                      return (
                        <Typography marginY={'5px'} key={index}>
                          Du
                          <span style={{ fontWeight: 900 }}>
                            {` ${horaire.dateDeb} `}
                          </span>
                          Jusqu'à
                          <span style={{ fontWeight: 900 }}>
                            {` ${horaire.dateFin} `}
                          </span>
                          Du
                          <span style={{ fontWeight: 900 }}>
                            {` ${horaire.heureDeb} `}
                          </span>
                          Au
                          <span style={{ fontWeight: 900 }}>
                            {` ${horaire.heureFin} `}
                          </span>
                        </Typography>
                      )
                    })}
                  </TableCell>
                  <TableCell align="center">
                    {bureau.listeServices.map((service, index) => {
                      return (
                        <Chip
                          sx={{
                            mr: '10px',
                            bgcolor: service.deletedAt !== null ? 'red' : '',
                          }}
                          key={index}
                          label={service.name}
                        ></Chip>
                      )
                    })}
                  </TableCell>
                  <TableCell align="center">
                    {dayjs(bureau.createdAt).format('YYYY-MM-DD HH:mm')}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ display: 'flex', justifyContent: 'space-around' }}
                  >
                    {bureau.deletedAt === null && (
                      <Button
                        color="warning"
                        variant="contained"
                        startIcon={<SettingsIcon />}
                        onClick={() => {
                          navigate('/edit_bureau', { state: { bureau } })
                        }}
                      >
                        Modifier
                      </Button>
                    )}

                    {bureau.deletedAt !== null ? (
                      <Button
                        onClick={() => deleteOffice(bureau._id, false)}
                        color="success"
                        variant="contained"
                        startIcon={<DeleteForeverIcon />}
                      >
                        Restorer
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          deleteOffice(bureau._id)
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

export default Bureaux
