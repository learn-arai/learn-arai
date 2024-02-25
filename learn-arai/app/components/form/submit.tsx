export default function Submit({ value }: { value: string }) {
    return (
        <input
            type="submit"
            className="sign-in-button mt-10 font-bold hover:cursor-auto"
            value={value}
        />
    );
}
