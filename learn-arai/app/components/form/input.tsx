type prop = {
    htmlFor?: string;
    label?: string;
    type: string;
    placeholder?: string;
    name: string;
    children?: React.ReactNode;
};

export default function Input({
    label,
    type,
    placeholder,
    name,
    children,
}: prop) {
    return (
<<<<<<< HEAD
    <div>
      <label htmlFor={name}>{label}</label> <br />
      <div className="relative">
          {children}
          <input
              type={type}
              className="w-full"
              placeholder={placeholder}
              name={name}
          />
      </div>
    </div>
=======
        <div>
            <label htmlFor={htmlFor}>{label}</label> <br />
            <div className="relative">
                {icon}
                <input
                    type={type}
                    className="w-full"
                    placeholder={placeholder}
                    name={name}
                />
            </div>
        </div>
>>>>>>> 84c0931b6c21521b746d49020479fd2e9446e19c
    );
}
