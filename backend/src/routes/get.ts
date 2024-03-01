import { sql } from "@/lib/db";
import { Elysia } from "elysia";

export const getRoute = new Elysia({ prefix : '/get'} )
  .get('/email', async ( { cookie } ) => {
    const sessionID = cookie.auth_session.value;

    try {
      const email = await sql`
        SELECT auth_user.email
        FROM auth_user 
        INNER JOIN user_session
        ON user_session.user_id=auth_user.id
        WHERE user_session.id=${sessionID};
      `

      return {
        status : "success",
        data : {
          email : email
        }
      }
    } catch ( error ) {
      return {
        status : "error",
        message : "Error occured somewhere, please try again"
      }
    }

  })