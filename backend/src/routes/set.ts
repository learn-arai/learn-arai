import { sql } from "@/lib/db";
import { Elysia } from "elysia";

const setRoute = new Elysia({ prefix : "/set"})
  .post("/change-session-expired-date", 

  sql`
    
  `
  )