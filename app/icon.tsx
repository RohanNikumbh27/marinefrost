import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
    width: 32,
    height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 24,
                    background: 'transparent', // Transparent background for the shape itself
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* Compass Star Shape - Optimized for 32x32 */}
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="marine-star-gradient-icon" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#2563EB" /> {/* Blue 600 */}
                            <stop offset="100%" stopColor="#06B6D4" /> {/* Cyan 500 */}
                        </linearGradient>
                    </defs>
                    <path
                        d="M50 5 C55 35 65 45 95 50 C65 55 55 65 50 95 C45 65 35 55 5 50 C35 45 45 35 50 5 Z"
                        fill="url(#marine-star-gradient-icon)"
                    />
                </svg>
            </div>
        ),
        {
            ...size,
        }
    );
}
