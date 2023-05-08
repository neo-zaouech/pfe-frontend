import { Stack } from '@mui/material'
import React from 'react'
import NeoButton from '../../Components/NeoButton'
import { useNavigate } from 'react-router-dom'

const Chef_service = () => {
  const navigate = useNavigate()
  return (
    <Stack
      position={'absolute'}
      top={0}
      zIndex={-1}
      height={'100vh'}
      width={'100vw'}
      justifyContent={'center'}
      alignItems={'center'}
      spacing={3}
    >
      <NeoButton
        text={'Gérer Les Services de mon Bureau'}
        type={'info'}
        onClick={() => {
          navigate('/services')
        }}
      />
      <NeoButton
        text={'Gérer Les Employés de mon Bureau'}
        type={'info'}
        onClick={() => {
          navigate('/users')
        }}
      />
    </Stack>
  )
}

export default Chef_service
