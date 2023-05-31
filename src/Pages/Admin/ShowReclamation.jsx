import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import governments from '../../goverments'

const ShowReclamation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  if (location.state === null) {
    navigate('/')
    return
  }

  const { reclamation } = location.state

  return (
    <Box padding={10}>
      <Typography>
        {reclamation.bureau
          ? `Bureau : ${
              governments.find((governement) => {
                return governement.code === reclamation.bureau.localisation.gov
              }).name
            } - ${reclamation.bureau.localisation.city}`
          : ''}
      </Typography>
      <Typography>Email : {reclamation.email}</Typography>
      <Typography>Texte : {reclamation.text}</Typography>
      <Typography>
        Date d'envoie : {dayjs(reclamation.createdAt).format('DD-MM-YYYY')}
      </Typography>
    </Box>
  )
}

export default ShowReclamation
