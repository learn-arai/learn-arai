import './hero-animation.css';

export default function HeroAnimation() {
    return (
        <>
            <span className="relative inline-block w-auto overflow-hidden">
                <span className="text-transparent">Learning</span>
                <span className="absolute left-1/2 w-auto -translate-x-1/2 animate-[1s_slide-in_cubic-bezier(0.25,0.46,0.45,0.94)_forwards_750ms] select-none space-y-4">
                    <p>Coding</p>
                    <p>Teaching</p>
                    <p>Learning</p>
                    <p>Coding</p>
                    <p>Teaching</p>
                    <p>Learning</p>
                    <p>Coding</p>
                    <p>Teaching</p>
                    <p>Learning</p>
                </span>
            </span>
        </>
    );
}
