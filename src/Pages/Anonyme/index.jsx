import Map from '../../Components/map/Map'
import {
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import axios from 'axios'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import governments from '../../goverments'
import ListActualites from './ListActualites'
const Anonyme = () => {
  const [bureaux, setBureaux] = useState([])
  const [gov, setGov] = useState(null)
  const [services, setServices] = useState(null)
  useEffect(() => {
    axios
      .get('http://127.0.0.1:5000/admin/bureau', {
        params: { filter: { deletedAt: 'null' } },
      })
      .then((response) => {
        setBureaux(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
    axios
      .get('http://127.0.0.1:5000/admin/service')
      .then((response) => {
        setServices(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  return (
    <Stack>
      <Stack
        position={'relative'}
        width={'100%'}
        minHeight={'100vh'}
        justifyContent={'center'}
        direction={'row'}
        pt={'200px'}
        sx={{
          background: 'linear-gradient(#fdc613,transparent,#081d5c)',
          top: '-180px',
        }}
      >
        <Box width={'50vw'}>
          <Map gov={gov} setGov={setGov} />
        </Box>
        <Box width={'50vw'} pr={'50px'} position={'relative'}>
          {gov && (
            <>
              <Typography
                sx={{
                  zIndex: 1000,
                  fontSize: '36px',
                  fontWeight: 900,
                  top: '-10px',
                  right: '50%',
                  color: 'Black',
                }}
              >
                Les Bureaux de la Gouvernat{' '}
                {
                  governments.find((governement) => {
                    return governement.code === gov
                  }).name
                }
              </Typography>
              <Typography
                sx={{
                  cursor: 'pointer',
                  zIndex: 1000,
                  color: 'blue',
                  top: '-10px',
                }}
                onClick={() => {
                  setGov(undefined)
                }}
              >
                Afficher Tous les bureaux
              </Typography>
            </>
          )}
          <TableContainer
            component={Paper}
            sx={{ bgcolor: '#cfcfcf', borderRadius: 5 }}
          >
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>localisation</TableCell>
                  <TableCell align="center">chefService</TableCell>
                  <TableCell align="center">Horaires</TableCell>
                  <TableCell align="center">Services</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bureaux
                  .filter((bureau) => {
                    return gov ? bureau.localisation.gov === gov : true
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
                                bgcolor:
                                  service.deletedAt !== null ? 'red' : '',
                              }}
                              key={index}
                              label={service.name}
                            ></Chip>
                          )
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Stack>
      <ListActualites />
    </Stack>
  )
}

export default Anonyme
