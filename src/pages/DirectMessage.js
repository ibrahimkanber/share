import React,{useState,useEffect} from 'react'
import firebase from  "../firebase/firebase.utils"

export const DirectMessage = () => {
    const [userList, setUserList] = useState();
    const [message, setMessage] = useState()
    const fetchData = async () => {

        const res = await firebase.firebaseDb.collection("users").get()
    
        const userArrayFromFirebase = res.docs?.map(user => user.data())
    
        setUserList(userArrayFromFirebase)
      };

    const fetchDataDm=()=>{
        firebase.firebaseRealtimeDB.ref("YrQbUaerwBQgw3A1TDcxx1CUex33").once("value").then(res=>console.log(res.val()))
    }
    
      useEffect(() => {
        fetchData();
        fetchDataDm()
      }, []);

      const handleSubmit=(e)=>{
          e.preventDefault()
            firebase.firebaseRealtimeDB.ref("YrQbUaerwBQgw3A1TDcxx1CUex33").push({
                message
            })
      }
/*       YrQbUaerwBQgw3A1TDcxx1CUex33 */
    console.log(userList);
  
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" onChange={(e)=>setMessage(e.target.value)}/>
                <input type="submit"/>
            </form>
        </div>
    )
}
