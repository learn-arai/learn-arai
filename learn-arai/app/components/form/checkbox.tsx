type prop = {
    name: string;
    label: string;
};

export default function Checkbox({ name, label }: prop) {
    return (
        <>
            <div className="flex gap-2">
              <div className="relative">
                  <input
                      type="checkbox"
                      className="w-full hover:cursor-pointer"
                      name={name}
                      id={name}
                  />
                  <br />
              </div>
              <label htmlFor={name}>
                  <span className="font-medium hover:cursor-pointer">
                      {label}
                  </span>
              </label>
            </div>
        </>
    );
}
