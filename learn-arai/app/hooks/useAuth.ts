'use client'

// this react hook responsible for checking if user is logged in.
import { User } from "./useUser";
import { useEffect, useState } from "react";
import { useUser } from "./useUser"

export const useAuth = () => {
  const { addUser, removeUser, user } = useUser();
  const [ isAuthenticated, setIsAuthenticated ] = useState< boolean >();
  
  const isUserNull = user;

  useEffect(() => {
    if ( isUserNull ) {
      setIsAuthenticated( true );
    } else {
      setIsAuthenticated( false );
    }
  }, [user]);

  const signIn = ( user : User ) => {
    addUser( user );
  }

  const signOut = ( ) => {
    removeUser();
  }

  return { signIn, signOut, user, isAuthenticated }
}