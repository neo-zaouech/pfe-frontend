import {
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

const Bureaux = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    axios
      .get('http://127.0.0.1:5000/admin/bureau')
      .then((response) => {
        setUsers(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
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
              <TableCell>localisation</TableCell>
              <TableCell align="center">chefService</TableCell>
              <TableCell align="center">Horaires</TableCell>
              <TableCell align="center">crée le</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((row) => (
              <TableRow
                key={row._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.localisation}
                </TableCell>
                <TableCell align="center">{row.chefService}</TableCell>
                <TableCell align="center">
                  {row.horaire.map((horaire) => {
                    return (
                      <Typography marginY={'5px'}>
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
                  {dayjs(row.createdAt).format('YYYY-MM-DD HH:mm')}
                </TableCell>
                <TableCell align="center">{}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  )
}

export default Bureaux
