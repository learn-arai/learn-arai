import { sql } from "@/lib/db";
import { Elysia } from "elysia";

export const classroomRoute = new Elysia({ prefix : '/classroom' })
  .post('/join-room', async ( { body, cookie } ) => {
    const joiningCode = body.classroomCode;
    const sessionID = cookie.auth_session.value;

    const classroomID = await sql`
      SELECT id
      FROM classroom
      WHERE code=${joiningCode}
    `

    if ( classroomID.length == 0 ) {
      return {
        status : "error",
        message : "There is no classroom, please try again later." 
      }
    }

  })