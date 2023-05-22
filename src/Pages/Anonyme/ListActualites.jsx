import { Box, Button, Stack, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const ListActualites = () => {
  const [actualites, setActualites] = useState([])
  const [showSliderIndex, setShowSliderIndex] = useState(0)

  useEffect(() => {
    axios
      .get('http://127.0.0.1:5000/actualite', {
        params: { filter: { deletedAt: 'null' } },
      })
      .then((response) => {
        console.log(response.data)
        setActualites(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  return (
    <Stack
      position={'relative'}
      width={'100%'}
      pb={'100px'}
      textAlign={'center'}
      top={'-150px'}
    >
      <Typography fontWeight={900} fontSize={'52px'}>
        Actualités
      </Typography>
      {actualites.length > 0 && (
        <Stack
          direction={'row'}
          alignItems={'center'}
          spacing={5}
          width={'100%'}
          justifyItems={'center'}
        >
          <Stack sx={{ width: '20%', alignItems: 'center' }}>
            <Button
              sx={{ height: '50px', width: '50px' }}
              variant="contained"
              disabled={showSliderIndex === 0}
              onClick={() => {
                setShowSliderIndex(showSliderIndex - 1)
              }}
            >
              {'<'}
            </Button>
          </Stack>
          <Stack width={'60%'} textAlign={'center'}>
            <img
              style={{ objectFit: 'contain' }}
              height={'450px'}
              src={
                'http://127.0.0.1:5000/images/' +
                actualites[showSliderIndex].image
              }
              alt=""
            />
            {actualites[showSliderIndex].text}
          </Stack>
          <Stack sx={{ width: '20%', alignItems: 'center' }}>
            <Button
              sx={{ height: '50px' }}
              variant="contained"
              disabled={showSliderIndex === actualites.length - 1}
              onClick={() => {
                setShowSliderIndex(showSliderIndex + 1)
              }}
            >
              {'>'}
            </Button>
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}

export default ListActualites
