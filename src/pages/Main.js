import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Grid,
  capitalize,
  CircularProgress,
} from "@material-ui/core";

import MediaCard from "../components/MediaCard";
import firebase from "../firebase/firebase.utils"

const stylesFunc = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    maxWidth: "85%",
    marginTop: "5rem",
    marginBottom: "2rem",
    textAlign: "center",
  },
  avatar: {
    margin: "1rem auto",
    backgroundColor: theme.palette.secondary.main,
  },
  circular: {
    margin: 'auto',
  }
}));

function Main() {
  const [userList, setUserList] = useState();

  const currentUserId = firebase.firebaseAuth.currentUser?.uid
  const mainStyles = stylesFunc();

  const fetchData = async () => {

    const res = await firebase.firebaseDb.collection("users").get()

    const userArrayFromFirebase = res.docs?.map(user => user.data())

    setUserList(userArrayFromFirebase)
  };

  useEffect(() => {
    fetchData();

  }, []);

  
  return (
    <Container className={mainStyles.wrapper}>
      {!userList ? (
        //TODO: center loading icon
        <CircularProgress className={mainStyles.circular} />
      ) : (
          <Grid container spacing={1}>
            {userList?.map((user) => {
              if (user.id == currentUserId) {
                return null
              } else {

                return (
                  <Grid item lg={3} md={4} sm={6} xs={12} key={user?.id}>
                    <MediaCard
                      id={user.id}
                      userImage={user?.picture}
                      userName={`${capitalize(user?.title)} ${user?.firstName} ${user?.lastName
                        }`}
                      userEmail={user?.email}
                    />
                  </Grid>
                )
              };
            })}
          </Grid>
        )}
    </Container>
  );
}

export default Main;
