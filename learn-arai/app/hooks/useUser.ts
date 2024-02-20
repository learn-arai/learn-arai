import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

type User = {
  email : string,
  password : string,
  id : string
}

export const useUser = () => {
  const [ user, setUser ] = useState< User | null >();
  const { setItem, removeItem } = useLocalStorage();

  const addUser = ( user : User ) => {
    setUser( user );
    setItem( "user", JSON.stringify(user) );
  }

  const removeUser = ( ) => {
    setUser( null );
    removeItem( "user" );
  }
}