'use client'

import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import axios from "axios";

export type User = {
  email : string,
  password : string,
  expires_at : string
};  

export const useUser = () => {
  const [ user, setUser ] = useState< User | null >(null);
  const { setItem, removeItem, getItem } = useLocalStorage();

  // const userFromLocalStorage = getItem( "user" );

  // if ( userFromLocalStorage ) {
  //   setUser( eval( userFromLocalStorage ) );
  // }

  
  // const getUserFromDb = async ( ) => {
  //   const response = axios.get("http://localhost:3000/auth/get-user", { withCredentials : true });
  //   console.log( response );
  // }

  const addUser = ( user : User ) => {
    setUser( user );
    setItem( "user", JSON.stringify(user) );
    // parse user object to string
  }

  const removeUser = ( ) => {
    setUser( null );
    removeItem( "user" );
  }

  return { addUser, removeUser, user };
}