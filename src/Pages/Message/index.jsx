import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  Modal,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Message from './Message'
import { Controller, useForm } from 'react-hook-form'
import SendIcon from '@mui/icons-material/Send'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
}
const Discussions = () => {
  const user = useSelector((state) => state.user)
  const [messages, setMessages] = useState([])
  const [discussionSelected, setDiscussionSelected] = useState(null)
  const [discussions, setDiscussions] = useState([])
  const [open, setOpen] = useState(false)
  const [users, setServices] = useState([])
  const { control, watch, setValue, handleSubmit } = useForm({
    defaultValues: { receiver: null, text: '' },
  })

  const getUsers = () => {
    axios
      .get('http://127.0.0.1:5000/admin/user')
      .then((response) => {
        setServices(response.data)
      })
      .catch((error) => {})
  }
  const getMessages = () => {
    axios
      .get('http://127.0.0.1:5000/message', { params: { userId: user._id } })
      .then((response) => {
        setMessages(response.data)
      })
  }
  useEffect(() => {
    getMessages()
    getUsers()
  }, [])

  const sendMessage = (data) => {
    axios
      .post('http://127.0.0.1:5000/message', {
        receiver: data.receiver._id,
        sender: user._id,
        text: data.text,
      })
      .then((response) => {
        setValue('text', '')
        getMessages()
        setOpen(false)
      })
  }

  useEffect(() => {
    let ids = [],
      listDestinataire = []
    messages.map((m) => {
      if (m.receiver._id !== user._id && !ids.includes(m.receiver._id)) {
        ids.push(m.receiver._id)
        listDestinataire.push({ user: m.receiver, text: m.text })
      }
      if (m.sender._id !== user._id && !ids.includes(m.sender._id)) {
        ids.push(m.sender._id)
        listDestinataire.push({ user: m.sender, text: m.text })
      }
    })
    setDiscussions(listDestinataire)
  }, [messages])

  return (
    <Stack
      direction={'row'}
      height={'calc( 100vh - 185px )'}
      width={'100vw'}
      position={'relative'}
    >
      <Modal
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form onSubmit={handleSubmit(sendMessage)}>
          <Box sx={style}>
            <Controller
              name="receiver"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Vous devez sélectionner le destinataire',
                },
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <Autocomplete
                  fullWidth
                  id="tags-standard"
                  options={users}
                  getOptionLabel={(option) => option.nom + ' ' + option.prenom}
                  onChange={(event, item) => {
                    onChange(item)
                  }}
                  value={value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      type="submit"
                      variant="standard"
                      label="Destinataire"
                      placeholder="Destinataire"
                      error={!!error}
                      helperText={error && error.message}
                    />
                  )}
                />
              )}
            />
            <Controller
              control={control}
              name="text"
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <FormControl fullWidth>
                  <InputLabel htmlFor="outlined-adornment-amount">
                    Texte
                  </InputLabel>
                  <OutlinedInput
                    value={value}
                    onChange={onChange}
                    id="outlined-adornment-amount"
                    endAdornment={
                      <InputAdornment position="end">
                        <SendIcon />
                      </InputAdornment>
                    }
                    label="Amount"
                  />
                </FormControl>
              )}
            />
          </Box>
        </form>
      </Modal>
      <div
        style={{
          width: '20%',
          height: '100%',
          overflowY: 'scroll',
        }}
      >
        <Button
          onClick={() => {
            setOpen(true)
          }}
        >
          Nouveau message
        </Button>
        {discussions.map((m) => {
          return (
            <Typography
              sx={{
                margin: '20px',
                p: '10px 5px',
                borderRadius: '10px',
                cursor: 'pointer',
                bgcolor: '#1976d2',
                color: '#fff',
                fontWeight: 900,
              }}
              key={m.user._id}
              onClick={() => setDiscussionSelected(m.user._id)}
            >
              {m.user.prenom + ' ' + m.user.nom}
            </Typography>
          )
        })}
      </div>
      <Box width={'80%'} height={'100%'} bgcolor={'azure'}>
        <Message discussionSelected={discussionSelected} />
      </Box>
    </Stack>
  )
}

export default Discussions
