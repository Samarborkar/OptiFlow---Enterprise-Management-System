import { createContext ,useState} from "react";

export const UserContext=createContext(null);

export const UserProvider = (props) =>{
    const [login,setLogin]= useState(false);
    const [username1,setUsername1]= useState(null);
    const [image1,setImage1]= useState(null);
    const [id,setId]=useState(null);
    const [total,setTotal]=useState(0);
    const [user, setUser] = useState(null);
    const [tokenId,setTokenId]=useState(null);
    const [tokenName,setTokenName]=useState(null);
    const [tokenDesig,setTokenDesig]=useState(null);
    const [tokenAdmin,setTokenAdmin]=useState(null);

    const toggle=()=>{
        setLogin(!login)
    };
    return(
    <UserContext.Provider value={{login,setLogin,tokenId,setTokenId,tokenName,setTokenName,tokenDesig,setTokenDesig,tokenAdmin,setTokenAdmin,toggle,username1,setUsername1,image1,user,setUser,setImage1,id , setId,total,setTotal}}>
        {props.children}
    </UserContext.Provider>
    );
}