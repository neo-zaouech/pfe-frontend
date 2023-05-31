import { Stack } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import listeActions from '../../redux/actions'
import NeoButton from '../NeoButton'
const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  return (
    <Stack
      justifyContent={'space-between'}
      alignItems={'center'}
      padding={'0 100px 0 80px'}
      direction={'row'}
      height={'182px'}
      width={'calc(100%-180px)'}
      bgcolor={'#CFCFCF'}
      borderRadius={'0 0 91px 91px'}
      zIndex={10000}
      position={'sticky'}
    >
      <img
        onClick={() => {
          navigate('/')
        }}
        alt=""
        style={{ objectFit: 'contain', cursor: 'pointer' }}
        src={window.location.origin + '/logo.png'}
        height={'100%'}
        width={'100px'}
      />
      <Stack direction={'row'} spacing={1}>
        {user !== null && (
          <NeoButton
            onClick={() => {
              navigate('/')
            }}
            text={'Acceuil'}
            type={location.pathname === '/' ? 'info' : 'none'}
          />
        )}
        {user === null && (
          <>
            <NeoButton
              onClick={() => {
                navigate('/login')
              }}
              text={'Connection'}
              type={location.pathname === '/' ? 'info' : 'none'}
            />
            <NeoButton
              onClick={() => {
                navigate('/reclamation')
              }}
              text={'Reclamation'}
              type={location.pathname === '/reclamation' ? 'info' : 'none'}
            />
          </>
        )}
        <NeoButton
          onClick={() => {
            navigate('/about')
          }}
          text={'A propos'}
          type={location.pathname === '/about' ? 'info' : 'none'}
        />
        {user !== null && (
          <NeoButton
            onClick={() => {
              localStorage.setItem('user', null)
              dispatch({ type: listeActions.login, user: null })
              navigate('/')
            }}
            text={'Déconnexion'}
            type={'delete'}
          />
        )}
      </Stack>
    </Stack>
  )
}

export default Navbar
