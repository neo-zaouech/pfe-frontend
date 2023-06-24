import { Box, Modal, Stack, TextField } from '@mui/material'
import axios from 'axios'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import NeoButton from '../../Components/NeoButton'
import { useDispatch, useSelector } from 'react-redux'
import listeActions from '../../redux/actions'

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

const FormActualite = ({ type, open, handleClose }) => {
  const [selectedFile, setSelectedFile] = React.useState(null)
  const user = useSelector((state) => state.user)
  const { handleSubmit, control } = useForm({ defaultValues: { text: '' } })
  const dispatch = useDispatch()
  const actionActualite = (data) => {
    const formData = new FormData()
    formData.append('image', selectedFile)
    formData.append('text', data.text)
    formData.append('employe', user._id)
    formData.append('bureau', user.bureau._id)

    // make a POST request to the File Upload API with the FormData object and Rapid API headers
    axios
      .post('http://127.0.0.1:5000/actualite', formData)
      .then((response) => {
        handleClose()
        dispatch({ type: listeActions.statusActualite, statusActualite: 'add' })
      })
      .catch((error) => {
        // handle errors
        console.log(error)
      })
  }

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0])
  }
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleSubmit(actionActualite)}>
            <Stack spacing={3} alignItems={'center'}>
              <Controller
                name="text"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: 'Champs texte est obligatoire',
                  },
                }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <TextField
                    multiline
                    label={'Texte'}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <input
                required
                type="file"
                name="image"
                onChange={handleFileSelect}
              />
              <NeoButton
                text={type === 'add' ? 'Add new' : 'Edit'}
                type={type === 'add' ? 'success' : 'edit'}
              />
            </Stack>
          </form>
        </Box>
      </Modal>
    </div>
  )
}

export default FormActualite
