import Image from "next/image"
import { FaRegUser } from "react-icons/fa";
import { IoMdKey } from "react-icons/io";

export default function page() {
  return (
    <>
    <div className="flex">
      <div className="w-1/2 h-screen 
                      flex items-center
                      pl-10
                    bg-greymain-100">
        <div>
          <h1>Login to <span className="text-redLogo-500">Learn</span><span className="text-blueLogo-500">Arai</span></h1>
          
          <div id="input-field">
            <form action="">
                <label htmlFor="Email">Email</label> <br />
              <div className="relative">
                <FaRegUser fill="black" className="icon-in-input-field"/>
                <input type="text" /> <br />
              </div>

              <label htmlFor="Password">Password</label> <br />
              
              <div className="relative">
                <IoMdKey fill="black" className="icon-in-input-field"/>
                <input type="password" /> <br />
              </div>

              <input type="submit" /> <br />
            </form>
          </div>
        </div>
        
      </div>

      <Image src={"/login/teaching.jpeg"}
              alt="hello"
              height={0}
              width={0}
              sizes="100vw"
              style={{width : '50%', height : 'auto', objectFit : 'cover'}}
              />
    </div>
    </>
  )
}