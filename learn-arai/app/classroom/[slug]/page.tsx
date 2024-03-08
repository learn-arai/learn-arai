'use client';

import CreateInvite from "@/components/module/classrooom/create-invited-code/create-invited-code";
import { createContext } from "react";

export const SlugContext = createContext('');

export default function Page({params} : {params : { slug : string}}) {
  return (
      <>
        <SlugContext.Provider value={ params.slug }>
          <h1>Slug is {params.slug}</h1>
          <CreateInvite/>
        </SlugContext.Provider>
      </>
  )
}