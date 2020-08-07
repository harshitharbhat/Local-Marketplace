import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import axios from 'axios';
import validateLogin from './validateLogin.jsx';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  error: {
    color: "red",
  },
}));

export default (props) => {
  const { setUsersObj, handleClose } = props;
  const classes = useStyles();
  const [password, setPassword] = React.useState(''),
    [email, setEmail] = React.useState(''),
    [name, setName] = React.useState(''),
    [error, setError] = React.useState({ name: "", email: "", password: "" }),
    [serverError, setServerError] = React.useState();

  const onSubmitLoginForm = (e) => {
    let validateError = validateLogin(name, email, password);
    if (validateError.name || validateError.email || validateError.password) {
      setError(validateError);
      return;
    }
    e.preventDefault();
    let usrObjReq = {
      name,
      email,
      password,
      itemsBought: [],
      cartItems: []
    }
    axios.post('/register', usrObjReq).then(response => {
      if (response.status === 200) {
        setUsersObj(response.data);
        handleClose();
      }
    }).catch(() => {
      setServerError(true);
      setError(validateLogin(name, email, password));
    })
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoFocus
            onChange={(e) => { setName(e.target.value) }}
          />
          {error.name && <p className={classes.error}>{error.name}</p>}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => { setEmail(e.target.value) }}
          />
          {error.email && <p className={classes.error}>{error.email}</p>}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => { setPassword(e.target.value) }}
          />
          {error.password && <p className={classes.error}>{error.password}</p>}
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={onSubmitLoginForm}
          >
            Go
          </Button>
          {(serverError) &&
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Incorrect Credentials
            </Typography>}
        </form>
      </div>
    </Container>
  );
};
