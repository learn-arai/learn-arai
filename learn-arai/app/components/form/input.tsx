type prop = {
    htmlFor : string,
    label : string,
    type : string,
    placeholder? : string,
    name : string
    children? : React.ReactNode
  }
  
  export default function Input({htmlFor, label, type, placeholder, name, children} : prop ) {
    return (
      <>
        <label htmlFor={htmlFor}>{label}</label>   
        <div className="relative">
          { children }
          <input
                                  type={type}
                                  className="w-full"
                                  placeholder={placeholder}
                                  name={name}
                              />
        </div>
      </>
    )
  }