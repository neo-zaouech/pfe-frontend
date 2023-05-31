import {
  Stack,
  Table,
  TableContainer,
  Paper,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Typography,
} from '@mui/material'
import axios from 'axios'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import governments from '../../goverments'
import { useNavigate } from 'react-router-dom'

const Reclamations = () => {
  const [reclamations, setReclamations] = useState([])
  const navigate = useNavigate()
  const getReclamations = () => {
    axios.get('http://127.0.0.1:5000/reclamation').then((response) => {
      setReclamations(response.data)
    })
  }

  useEffect(() => {
    getReclamations()
  }, [])
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
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Bureau</TableCell>
              <TableCell align="center">email</TableCell>
              <TableCell align="center">Texte</TableCell>
              <TableCell align="center">Date d'envoie</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reclamations.map((reclamation) => {
              return (
                <TableRow>
                  <TableCell align="center">
                    {reclamation.bureau
                      ? `${
                          governments.find((governement) => {
                            return (
                              governement.code ===
                              reclamation.bureau.localisation.gov
                            )
                          }).name
                        } - ${reclamation.bureau.localisation.city}`
                      : ''}
                  </TableCell>
                  <TableCell align="center">
                    <a href={`mailto:${reclamation.email}`}>
                      {reclamation.email}
                    </a>
                  </TableCell>
                  <TableCell align="center" sx={{ textAlign: 'center' }}>
                    <Typography
                      onClick={() => {
                        navigate('/reclamation', { state: { reclamation } })
                      }}
                      sx={{
                        cursor: 'pointer',
                        textAlign: 'center',
                        width: '500px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {reclamation.text}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {dayjs(reclamation.createdAt).format('DD-MM-YYYY')}
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

export default Reclamations
