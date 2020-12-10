import React, { useContext, useCallback,useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { FirebaseAuthContext } from "../context/AuthContex";
import firebase from "../firebase/firebase.utils";
import Modal from '@material-ui/core/Modal';
import { useFormik } from "formik";
import {
  Button,
  TextField,
  Grid,
  Container,
  Avatar,
  Input
} from "@material-ui/core";
function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  accountCircle: {
    marginLeft: 5,
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));




export default function Navbar() {
  const [url,setUrl]=useState()
 
  const { currentUser } = useContext(FirebaseAuthContext);
  /* console.log(currentUser) */
  const formik = useFormik({
    initialValues: {
      text: "",
      file:""
    },

    onSubmit: (values) => {
      
      const uploadTask= firebase.firebaseStorage.ref(`images/${values.file.name}`).put(values.file)
      uploadTask.on(
      "state_changed",
      snapshot=>{},
      err=>{
        console.log(err)
      },
      ()=>{
         firebase.firebaseStorage
         .ref("images")
         .child(values.file.name)
         .getDownloadURL()
         .then(url=>setUrl(url))
      }
      
      
      )
      
      firebase.firebaseDb.collection("allPosts").doc(currentUser?.uid).collection("userPosts").add({
        id: "fIAYZDRcLOJ1DQg25JPh",
        owner: { firstName: "ibrahim", lastName: "benedict" },
        picture: url,
        text: values.text,
        likes: 200,
        publishDate: new Date()

      }).then((res)=>{
        console.log(res.id)
        setOpen(false)
      })

    },
  });



  const classes = useStyles();
  const history = useHistory();

  const [modalStyle] = React.useState(getModalStyle);
  const [openModal, setOpen] = React.useState(false);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };



  const body = (
    <div style={modalStyle} className={classes.paper}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
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
              name="title"
              label="Title"
              variant="outlined"
              fullWidth
              {...formik.getFieldProps("text")}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Share
            </Button>
          </Grid>
        </Grid>
       
      </form>
    </div>
  );


  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleHomeClick = useCallback(() => {
    history.push(`/`);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleSignOut = useCallback(() => {
    firebase.signOut();
    history.push("/");
  }, []);

  const handleLoginClick = () => {
    history.push("/login");
  };

  const handleRegisterClick = () => {
    history.push("/register");
  };
  const handleCreatePost = () => {

    setOpen(true)

  };

  const handleDirectMessage=()=>{
    history.push("/dm")
  }

  return (
    <div className={classes.root}>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={handleHomeClick}
          >
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            React Share
          </Typography>
          {currentUser ? (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {currentUser?.displayName}
                <AccountCircle className={classes.accountCircle} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                <MenuItem onClick={handleCreatePost}>New Post</MenuItem>
                <MenuItem onClick={handleDirectMessage}>Direct Message</MenuItem>
              </Menu>
            </div>
          ) : (
              <>
                <MenuItem onClick={handleLoginClick}>Sign in</MenuItem>
                <MenuItem onClick={handleRegisterClick}>Sign up</MenuItem>
              </>
            )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
