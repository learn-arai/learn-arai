import '@/app/register/register.css';


export default function Home() {
    return (
      <div className="flex items-center">
        
        <div className="w-full h-full">
          <div className="flex justify-center items-center">
            <h1 className="text-center">Register Learn Arai</h1>
          </div>
          <div className="input-form">
            <form className="flex flex-col">
              <label htmlFor="FirstName">Name</label>
              <input type="text" className="w-full" placeholder="Name" name="Name" />
              <label htmlFor="LastName">Surname</label>
              <input type="text" className="w-full" placeholder="Surname" name="Surname" />
              <label htmlFor="Phone">Phone </label>
              <input type="text" className="w-full" placeholder="Phone" name="Phone" />
              <label htmlFor="Email">Email</label>
              <input type="text" className="w-full" placeholder="Email" name="Email" />
              <label htmlFor="Password">Password</label>
              <input type="text" className="w-full" placeholder="Password" name="Password" />
              <div className="flex justify-center">
                <input
                  type="submit"
                  className="register-button mt-10 font-bold w-full border-4"
                  value="Register"
                />{' '}
              </div>
            </form>
          </div>
        </div>
        <div className="w-full h-full">
          <h1>Cover</h1>
        </div>
      </div>
    );
  }
  