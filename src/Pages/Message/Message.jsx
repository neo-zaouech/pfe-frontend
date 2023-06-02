import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import SendIcon from '@mui/icons-material/Send'
const Message = ({ discussionSelected }) => {
  const user = useSelector((state) => state.user)
  const [messages, setMessages] = useState([])
  const [messageSent, setMessageSent] = useState(false)

  const { control, watch, setValue } = useForm({
    defaultValues: { text: '' },
  })
  const getMessage = () => {
    axios
      .get('http://127.0.0.1:5000/message/messages', {
        params: { user1: user._id, user2: discussionSelected },
      })
      .then((response) => {
        setMessages(response.data)
      })
  }

  const sendMessage = () => {
    axios
      .post('http://127.0.0.1:5000/message', {
        receiver: discussionSelected,
        sender: user._id,
        text: watch('text'),
      })
      .then((response) => {
        setMessageSent()
        setValue('text', '')
      })
  }

  useEffect(() => {
    getMessage()
    setMessageSent(false)
  }, [discussionSelected, messageSent])
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <Box p={'25px'} height={'80%'}>
        {messages
          .sort((a, b) => {
            return a.createdAt > b.createdAt ? 1 : -1
          })
          .map((m) => {
            return (
              <Typography
                sx={{ textAlign: m.sender._id === user._id ? 'right' : 'left' }}
                key={m._id}
              >
                {m.text}
              </Typography>
            )
          })}
      </Box>
      <Controller
        control={control}
        name="text"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <FormControl fullWidth>
            <InputLabel htmlFor="outlined-adornment-amount">Texte</InputLabel>
            <OutlinedInput
              value={value}
              onChange={onChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage()
                }
              }}
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
    </div>
  )
}

export default Message
