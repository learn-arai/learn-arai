'use client';

import Image from "next/image";
import Link from "next/link";
import { FaRegUser } from "react-icons/fa";
import { IoMdKey } from "react-icons/io";
import "@/app/login/login.css";
import { GoPlus } from "react-icons/go";
import { FormEvent } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const GoogleIcon = () => {
  return (
    <div className="">
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={40}
        height={40}
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            d="M30.0014 16.3109C30.0014 15.1598 29.9061 14.3198 29.6998 13.4487H16.2871V18.6442H24.1601C24.0014 19.9354 23.1442 21.8798 21.2394 23.1864L21.2127 23.3604L25.4536 26.58L25.7474 26.6087C28.4458 24.1665 30.0014 20.5731 30.0014 16.3109Z"
            fill="#4285F4"
          ></path>{" "}
          <path
            d="M16.2863 29.9998C20.1434 29.9998 23.3814 28.7553 25.7466 26.6086L21.2386 23.1863C20.0323 24.0108 18.4132 24.5863 16.2863 24.5863C12.5086 24.5863 9.30225 22.1441 8.15929 18.7686L7.99176 18.7825L3.58208 22.127L3.52441 22.2841C5.87359 26.8574 10.699 29.9998 16.2863 29.9998Z"
            fill="#34A853"
          ></path>{" "}
          <path
            d="M8.15964 18.769C7.85806 17.8979 7.68352 16.9645 7.68352 16.0001C7.68352 15.0356 7.85806 14.1023 8.14377 13.2312L8.13578 13.0456L3.67083 9.64746L3.52475 9.71556C2.55654 11.6134 2.00098 13.7445 2.00098 16.0001C2.00098 18.2556 2.55654 20.3867 3.52475 22.2845L8.15964 18.769Z"
            fill="#FBBC05"
          ></path>{" "}
          <path
            d="M16.2864 7.4133C18.9689 7.4133 20.7784 8.54885 21.8102 9.4978L25.8419 5.64C23.3658 3.38445 20.1435 2 16.2864 2C10.699 2 5.8736 5.1422 3.52441 9.71549L8.14345 13.2311C9.30229 9.85555 12.5086 7.4133 16.2864 7.4133Z"
            fill="#EB4335"
          ></path>{" "}
        </g>
      </svg>
    </div>
  );

};

const GitHubIcon = () => {
  return (
    <div className="">
      <Image
        src={"/login/github-mark.png"}
        alt="github logo"
        width={40}
        height={40}
      />
    </div>
  );
};

const LineIcon = () => {
  return (
    <div className="">
      <Image src={"/login/LINE_Brand_icon.png"}
             alt="line icon"
             width={40}
             height={40}/>
    </div>
  )
}

const AppleIcon = () => {
  return (
    <div className="">
      <svg
        fill="#000000"
        height="40px"
        width="40px"
        version="1.1"
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 22.773 22.773"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <g>
            {" "}
            <g>
              {" "}
              <path d="M15.769,0c0.053,0,0.106,0,0.162,0c0.13,1.606-0.483,2.806-1.228,3.675c-0.731,0.863-1.732,1.7-3.351,1.573 c-0.108-1.583,0.506-2.694,1.25-3.561C13.292,0.879,14.557,0.16,15.769,0z"></path>{" "}
              <path d="M20.67,16.716c0,0.016,0,0.03,0,0.045c-0.455,1.378-1.104,2.559-1.896,3.655c-0.723,0.995-1.609,2.334-3.191,2.334 c-1.367,0-2.275-0.879-3.676-0.903c-1.482-0.024-2.297,0.735-3.652,0.926c-0.155,0-0.31,0-0.462,0 c-0.995-0.144-1.798-0.932-2.383-1.642c-1.725-2.098-3.058-4.808-3.306-8.276c0-0.34,0-0.679,0-1.019 c0.105-2.482,1.311-4.5,2.914-5.478c0.846-0.52,2.009-0.963,3.304-0.765c0.555,0.086,1.122,0.276,1.619,0.464 c0.471,0.181,1.06,0.502,1.618,0.485c0.378-0.011,0.754-0.208,1.135-0.347c1.116-0.403,2.21-0.865,3.652-0.648 c1.733,0.262,2.963,1.032,3.723,2.22c-1.466,0.933-2.625,2.339-2.427,4.74C17.818,14.688,19.086,15.964,20.67,16.716z"></path>{" "}
            </g>{" "}
            <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g>{" "}
            <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g>{" "}
            <g> </g>{" "}
          </g>{" "}
        </g>
      </svg>
    </div>
  );
};

const FacebookIcon = () => {
  return (
    <div className="">
      <Image
        src={"/login/Facebook_Logo_Primary.png"}
        alt="facebook logo"
        width={40}
        height={40}
      />
    </div>
  );
};

export default function Page() {

  const queryClient = new QueryClient();
  // const { mutate : addMutate, isLoading, isError } = useSignIn();

  // const { isLoading, isError } = useMutation( signIn, { retry : 3 } );

  async function sendCredentialToServer(event : FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch('http://localhost:3000/auth/sign-in', { 
        method : 'POST',
        body : formData
      })

    } catch (error) {
      console.log( error );
    }
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="flex">
          <div
            className="flex h-screen 
                        w-1/2 items-center justify-center
                        bg-greymain-100
                      pl-10"
          >
            <div className="w-[55%]">
              <h1 className="text-center">
                Login to <span className="text-redLogo-500">Learn</span>
                <span className="text-blueLogo-500">Arai</span>
              </h1>

              <div id="input-field">

                <form onSubmit={(e) => sendCredentialToServer(e)} className="py-4 my-8">
                  <div className="flex flex-col gap-2">
                    <div>
                      <label htmlFor="Email">Email</label> <br />
                      <div className="relative">
                        <FaRegUser fill="black" className="icon-in-input-field" />
                        <input
                          type="text"
                          className="w-full"
                          placeholder="Email"
                          name="email"
                        />{" "}
                        <br />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="Password">Password</label> <br />
                      <div className="relative">
                        <IoMdKey fill="black" className="icon-in-input-field z-0" />
                        <input
                          type="password"
                          className="w-full z-10"
                          placeholder="Password"
                          name="password"
                        />{" "}
                        <br />
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div className="flex gap-1">
                        <input type="checkbox" id="rememberMe" name="isRememberMe"/> <br />
                        <label htmlFor="rememberMe" id="rememberMe">
                          <span className="font-medium">Remember Me</span>
                        </label>
                      </div>

                      <Link href={"#"} className="forget-password font-medium">
                        Forget Password
                      </Link>
                    </div>
                  </div>
                  <p className="text-red-400">{}</p>
                  <input
                    type="submit"
                    className="sign-in-button mt-10 font-bold"
                    value="Sign In"
                  />{" "}
                  <br />
                </form>
              </div>

              <p className="text-middle">
                <span className="font-bold">or</span>
              </p>

              <div className="flex justify-center my-4">
                <div className="flex gap-6">
                  <FacebookIcon />
                  <GoogleIcon />
                  <GitHubIcon />
                  <AppleIcon />
                  <LineIcon />
                </div>
              </div>

              <button className="register">
                <div className="flex items-center justify-center">
                  <GoPlus size={25}/>
                  <span className="font-bold">Register New Account</span>
                </div>
              </button>
            </div>
          </div>

          <Image
            src={"/login/teaching.jpeg"}
            alt="hello"
            height={0}
            width={0}
            sizes="100vw"
            style={{ width: "50%", height: "auto", objectFit: "cover" }}
          />
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}
