import React,{useState} from "react";
import {
  Button,
  TextField,
  Grid,
  Container,
  Avatar,
  Input,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useFormik } from "formik";
import firebase from "../firebase/firebase.utils";
import * as Yup from "yup";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { useHistory } from "react-router-dom";

const signUpValidationSchema = Yup.object().shape({
  displayName: Yup.string().required("Display Name is required!!"),
  email: Yup.string().email("Invalid Email").required("Email is required!!"),
  password: Yup.string()
    .required("No password provided.")
    .min(8, "Password is too short - should be 8 chars minimum."),
});

const stylesFunc = makeStyles((theme) => ({
  wrapper: {
    marginTop: "3rem",
    height: "calc(100vh - 19.0625rem)",
    textAlign: "center",
    marginBottom: "12rem",
  },
  avatar: {
    margin: "1rem auto",
    backgroundColor: theme.palette.secondary.main,
  },
  signUp: {
    margin: "1rem",
  },
  login: {
    textDecoration: 'none',
    fontWeight: '600',
    paddingLeft : '0.5rem'
  }  
}));

function Signup(props) {
  const [url,setUrl]=useState()
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      displayName: "",
      email: "",
      password: "",
      firstName:"",
      lastName:"",
      title:"",
      file:"",
    
    },
    validationSchema: signUpValidationSchema,

    onSubmit: async (values) => {
      console.log(values)
      await  firebase.firebaseStorage.ref(`images/${values.file.name}`).put(values.file)
      firebase.firebaseStorage.ref(`images/${values.file.name}`).getDownloadURL().then(res=>
      
      firebase.register(values.displayName, values.email, values.password,values.title, values.firstName,values.lastName,res)).then(()=>history.push("/"))
      
      
  
    },
  });
  const signupStyles = stylesFunc();

  const handleGoogleButtonClick = () => {
    firebase.useGoogleProvider();
  };

  return (
    <Container className={signupStyles.wrapper} maxWidth="sm">
      <Avatar className={signupStyles.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography className={signupStyles.signUp} variant="h4">
        Sign Up
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              name="displayName"
              label="Display Name"
              variant="outlined"
              fullWidth
              {...formik.getFieldProps("displayName")}
              error={formik.touched.displayName && formik.errors.displayName}
              helperText={
                formik.touched.displayName && formik.errors.displayName
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="title"
              label="Title"
              variant="outlined"
              fullWidth
              {...formik.getFieldProps("title")}
            />
            </Grid>
            <Grid item xs={12}>
            <TextField
              name="firstName"
              label="First Name"
              variant="outlined"
              fullWidth
              {...formik.getFieldProps("firstName")}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="lastName"
              label="lastName"
              variant="outlined"
              fullWidth
              {...formik.getFieldProps("lastName")}
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              name="title"
              label="Title"
              variant="outlined"
              type="file"
              fullWidth
              onChange={(event)=>formik.setFieldValue("file",event.target.files[0])}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="email"
              label="Email"
              variant="outlined"
              fullWidth
              {...formik.getFieldProps("email")}
              error={formik.touched.email && formik.errors.email}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="password"
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              {...formik.getFieldProps("password")}
              error={formik.touched.password && formik.errors.password}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Register
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleGoogleButtonClick}
            >
              SignUp with Google
            </Button>
          </Grid>
        </Grid>
      </form>
      <p>
        Already have an account? <a className={signupStyles.login}  href="/login"> Login.</a>
      </p>
    </Container>
  );
}

export default Signup;
