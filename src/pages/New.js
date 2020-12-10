import React,{useState} from 'react'
import firebase from  "../firebase/firebase.utils"

export const New = () => {
  console.log(firebase.firebaseStorage)
  const [image,setImage]=useState()

  const handleSubmit=(e)=>{
    e.preventDefault()
    const uploadTask=firebase.firebaseStorage.ref(`images/${image.name}`).put(image)
    uploadTask.on(
      "state_changed",
      snapshot=>{},
      err=>{
        console.log(err)
      },
      ()=>{
         firebase.firebaseStorage
         .ref("images")
         .child(image.name)
         .getDownloadURL()
         .then(url=>console.log(url))
      }
      
      
      )
  }

  const handleChange=(e)=>{
    if(e.target.files[0])
    setImage(e.target.files[0])
  }


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
        type="file"
        onChange={handleChange}/>
        <input type="submit" value="send"/>
      </form>
    </div>
  )
}
