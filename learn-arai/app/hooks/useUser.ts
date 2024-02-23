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