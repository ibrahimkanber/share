import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import Input from "@material-ui/core/Input";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { fetchData } from "../helper/FetchData";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import {
  Button,
  TextField,
  Grid,
  Container,
} from "@material-ui/core";

import firebase from "../firebase/firebase.utils";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));
export default function UserPostCard({
  id,
  userInitial,
  title,
  /* subheader, */
  imgSrc,
  imgTitle,
  description,
  likes,
  postOwnerId
}) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [comments, setComments] = useState();
  const [likesCount,setLikesCount]=useState(0)
  const [isLiked,setIsLiked]=useState(false)
  const [likesId,setLikesId]=useState()


  useEffect(()=>{
    
    if(isLiked){
        handleLikes()
    }else{
      const likesRefFirestore=firebase.firebaseDb.collection("allPosts").doc(postOwnerId).collection("userPosts")
      .doc(id)

      likesRefFirestore.collection("likes").doc(likesId).delete().then(()=>likesRefFirestore.collection("likes")
      .get().then(res=>setLikesCount(res.docs.length)))
    }


  },[isLiked])

  useEffect(()=>{

    const commentRefFirestore=firebase.firebaseDb.collection("allPosts").doc(postOwnerId).collection("userPosts")
    .doc(id).collection("comments")

    commentRefFirestore.get().then(res=>{
      const arrFromFirestore=res.docs.map(comment=>comment.data())
      setComments(arrFromFirestore)
    })


  },[])



  const formik = useFormik({
    initialValues: {
      text: ""
    },

    onSubmit: (values) => {
      const commentRefFirestore=firebase.firebaseDb.collection("allPosts").doc(postOwnerId).collection("userPosts")
      .doc(id).collection("comments")

      commentRefFirestore.add({
        comment:values.text
      }).then(()=>commentRefFirestore.get().then(res=>{
        const arrFromFirestore=res.docs.map(comment=>comment.data())
        setComments(arrFromFirestore)
      }))
    },
  });





  const handleExpandClick = (postId) => {
    setExpanded(!expanded);
  };

/*   const getComments = (postId) => {
    fetchData(`/post/${postId}/comment`)
      .then((res) => setComments(res?.data))
      .catch()
      .finally();
  }; */

  const handleLikes=()=>{
    const likesRefFirestore=firebase.firebaseDb.collection("allPosts").doc(postOwnerId).collection("userPosts")
      .doc(id)

    likesRefFirestore.collection("likes").add({likes:"likes"}).then((res)=>{
      setLikesId(res.id)
      likesRefFirestore.collection("likes")
      .get().then(res=>setLikesCount(res.docs.length))
    }
    
    )
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {userInitial}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={title}
       /*  subheader={subheader} */
      />
      <CardMedia className={classes.media} image={imgSrc} title={imgTitle} />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites"
          onClick={()=>setIsLiked(!isLiked)}

        >
          <FavoriteIcon 
          style={{color:isLiked? "red":"grey"}}
          />
        </IconButton>
        <Typography variant="body2" color="textSecondary" component="p">
          {`${likesCount} Likes`}
        </Typography>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={() => handleExpandClick(id)}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              name="title"
              label="Comment"
              variant="outlined"
              fullWidth
              {...formik.getFieldProps("text")}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
           Send
            </Button>
          </Grid>
        </Grid>
       
      </form>


        <CardContent>
          {!comments ? (
            <CircularProgress />
          ) : comments.length ? (
            comments.map((comment,index) => {
              return (
                <React.Fragment key={index}>
                  <Typography variant="body2">
                   name
                  </Typography>
                  <Typography paragraph>{comment.comment}</Typography>
                  <hr />
                </React.Fragment>
              );
            })
          ) : (
            "No comment"
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
}

UserPostCard.propTypes = {
  id: PropTypes.string.isRequired,
  userInitial: PropTypes.string,
  title: PropTypes.string,
 /*  subheader: PropTypes.string, */
  imgSrc: PropTypes.string,
  imgTitle: PropTypes.string,
  description: PropTypes.string,
  likes: PropTypes.bool,
};
