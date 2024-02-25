import Image from 'next/image';

export default function GitHubIcon () {
  return (
        <Image
            src={'/login/github-mark.png'}
            alt="github logo"
            width={40}
            height={40}
        />
    );
};
