import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchData } from "../helper/FetchData";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Container, CircularProgress } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { formatDateFunc } from "../helper/FormatDate";
import UserPostCard from "../components/UserPostCard";
import { PostAdd } from "@material-ui/icons";
import firebase from "../firebase/firebase.utils"
const stylesFunc = makeStyles((theme) => ({
  wrapper: {
    marginTop: "10rem",
    minHeight: "calc(100vh - 19.0625rem)",
    textAlign: "center",
  },
  avatar: {
    margin: "1rem auto",
    backgroundColor: theme.palette.secondary.main,
  },
}));
function UserPost() {
  const { id } = useParams();
  const mainStyles = stylesFunc();

  const [userPost, setUserPost] = useState();

  const fetchFromFirestore=async ()=>{
    let res= await firebase.firebaseDb.collection("allPosts").doc(id).collection("userPosts").get()
    let arr=res.docs.map(post=>post.data())
    let arr2=res.docs.map(post=>{
      return({
        postInfo:post.data(),
        postId:post.id
      })
  })
    
    setUserPost(arr2)
  }
  /* setUserPost(res?.data) */
  // TODO: fill in catch finally
  useEffect(() => {
    fetchData(`/user/${id}/post`)
      .then((res) => null)
      .catch()
      .finally();
    fetchFromFirestore()
  }, [id]);


  return (
    <Container className={mainStyles.wrapper}>
      {!userPost ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={1}>
          {userPost?.map((post) => {
            const { firstName, lastName } = post.postInfo.owner;
            return (
              <Grid item sm={4} xs={6} key={post.postInfo?.id}>
                <UserPostCard
                  postOwnerId={id}
                  id={post.postId}
                  userInitial={firstName[0]}
                  title={`${firstName} ${lastName}`}
                  /* subheader={formatDateFunc(post.publishDate)} */
                  imgSrc={post.postInfo.picture}
                  imgTitle="Image Title"
                  description={post.postInfo.text}
                  likes={post.postInfo.likes}
                />
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}

export default UserPost;
