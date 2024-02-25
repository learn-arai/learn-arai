type prop = {
    htmlFor?: string;
    label?: string;
    type: string;
    placeholder?: string;
    name: string;
    icon: React.ReactNode;
};

export default function Input({
    htmlFor,
    label,
    type,
    placeholder,
    name,
    icon,
}: prop) {
    return (
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
    );
}
