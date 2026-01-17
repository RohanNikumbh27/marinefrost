export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="marine-star-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563EB" /> {/* Blue 600 */}
                    <stop offset="50%" stopColor="#0EA5E9" /> {/* Sky 500 */}
                    <stop offset="100%" stopColor="#06B6D4" /> {/* Cyan 500 */}
                </linearGradient>
                <filter id="star-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* The Compass Star Construction */}
            {/* A 4-pointed star formed by concave curves */}
            <path
                d="M50 5 
                   C55 35 65 45 95 50 
                   C65 55 55 65 50 95 
                   C45 65 35 55 5 50 
                   C35 45 45 35 50 5 Z"
                fill="url(#marine-star-gradient)"
                className="drop-shadow-sm"
            />

            {/* Central Diamond Accent for depth */}
            <path
                d="M50 35 L65 50 L50 65 L35 50 Z"
                fill="white"
                fillOpacity="0.2"
                style={{ mixBlendMode: 'overlay' }}
            />
        </svg>
    );
}
