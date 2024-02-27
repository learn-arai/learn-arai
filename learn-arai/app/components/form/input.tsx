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
    );
}
