export const customErrorHandler=(err=>{
  
    if(err.code==="auth/user-not-found"){
        return "There is no user with this email" 
    }
    if(err.code==="auth/email-already-in-use"){
        return "The email address is already in use by another account"
    }
    if(err.code==="auth/wrong-password"){
        return "Wrong Password!! Plese try again"
    }
 
    
});

