import { Stack } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import NeoButton from '../../Components/NeoButton'

const Dashboard = () => {
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
        text={'Bureaux'}
        type={'info'}
        onClick={() => {
          navigate('/bureaux')
        }}
      />
      <NeoButton text={'Services'} type={'info'} />
      <NeoButton text={'Utilisateurs'} type={'info'} />
    </Stack>
  )
}

export default Dashboard
