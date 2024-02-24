import Image from 'next/image';

export const FacebookIcon = () => {
    return (
        <div className="">
            <Image
                src={'/login/Facebook_Logo_Primary.png'}
                alt="facebook logo"
                width={40}
                height={40}
            />
        </div>
    );
};
