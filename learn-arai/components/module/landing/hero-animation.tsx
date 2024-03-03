import './hero-animation.css';

export default function HeroAnimation() {
    return (
        <>
            <span className="relative w-auto overflow-hidden inline-block">
                <span className="text-transparent">Learning</span>
                <span className="absolute left-1/2 -translate-x-1/2 select-none w-auto space-y-4 animate-[1s_slide-in_cubic-bezier(0.25,0.46,0.45,0.94)_forwards_750ms]">
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
