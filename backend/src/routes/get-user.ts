import { sql } from "@/lib/db";
import { Elysia } from "elysia";

export const getUser = new Elysia().get(
  '/get-user', async (params : {sessionID : string}) => {
      console.log("get-user work");
      const record = await sql`
      SELECT user_session.expires_as, auth_user.email, auth_user.hashed_password
      FROM user_session INNER JOIN auth_user 
      ON user_session.user_id = auth_user.id
      WHERE user_session.id = ${ params.sessionID }
      `

      return {
        status : 200
      }
  }
)