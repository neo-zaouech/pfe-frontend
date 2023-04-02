import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
} from "@mui/material";
import React from "react";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import theme from "../../theme";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import NeoButton from "../../Components/NeoButton";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch } from "react-redux";
import listeActions from "../../redux/actions";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const { reset, control, handleSubmit } = useForm({
    defaultValues: {
      cin: "",
      motPasse: "",
    },
  });
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const login = (data) => {
    const { cin, motPasse } = data;
    axios
      .post("http://127.0.0.1:5000/user/login", { cin, motPasse })
      .then((response) => {
        if (response.data.errors) {
        } else {
          if (response.data === "cin incorrecte") {
            alert("CIN 8alta");
          } else if (response.data === "mot de passe incorrecte") {
            alert("Mdp 8alta");
          } else {
            localStorage.setItem("user", JSON.stringify(response.data)); //json ----> string
            dispatch({ type: listeActions.login, user: response.data });
            navigate("/");
          }
        }
      })
      .catch((error) => {});
  };
  return (
    <Stack
      width={"100%"}
      height={"calc(65vh)"}
      justifyContent={"center"}
      alignItems={"center"}>
      <form onSubmit={handleSubmit(login)}>
        <Stack width={"281px"} alignItems={"center"} spacing={3}>
          <AdminPanelSettingsIcon
            sx={{ fontSize: "250px", color: theme.colors.primary }}
          />

          <Controller
            name="cin"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextField
                id="outlined-basic"
                fullWidth
                label="Outlined"
                variant="outlined"
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            name="motPasse"
            control={control}
            render={({ field: { value, onChange } }) => (
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  value={value}
                  onChange={onChange}
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
            )}
          />
          <NeoButton type={"edit"} text={"connection"} />
        </Stack>
      </form>
    </Stack>
  );
};

export default Login;
