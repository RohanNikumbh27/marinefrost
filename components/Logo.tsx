export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
    // Exact geometric construction
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* 
        Width of bars = 8
        Gap = 10
        Center X = 50
      */}

            {/* --- Vertical Bars --- */}

            {/* Center Top Bar */}
            {/* x=50, from y=10 to y=35 */}
            <path d="M46 14 L50 10 L54 14 L54 31 L50 35 L46 31 Z" fill="currentColor" />

            {/* Center Bottom Bar */}
            {/* x=50, from y=65 to y=90 */}
            <path d="M46 69 L50 65 L54 69 L54 86 L50 90 L46 86 Z" fill="currentColor" />

            {/* Outer Left Bar */}
            {/* x=14, from y=35 to y=65 */}
            <path d="M10 39 L14 35 L18 39 L18 61 L14 65 L10 61 Z" fill="currentColor" />

            {/* Outer Right Bar */}
            {/* x=86, from y=35 to y=65 */}
            <path d="M82 39 L86 35 L90 39 L90 61 L86 65 L82 61 Z" fill="currentColor" />


            {/* --- THE M SHAPE --- */}
            {/* 
         Composed of:
         1. Left Vertical Leg (Inner Left)
         2. Right Vertical Leg (Inner Right)
         3. The V-Bridge connecting them
      */}

            {/* Left Leg: x=32. Top y=20, Bottom y=80? No, usually M legs go full height in this design.
          In the image, the Inner bars are the tallest.
          Let's say y=20 to y=80.
      */}
            {/* However, the V connects to them. 
          Let's draw the M as one merged path to be perfect.
      */}

            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="
          M32 15 
          L36 19 L36 45 
          L50 59 
          L64 45 L64 19 
          L68 15 
          L72 19 L72 81 
          L68 85 
          L64 81 L64 56 
          L50 70 
          L36 56 L36 81 
          L32 85 
          L28 81 L28 19 
          Z
        "
                fill="currentColor"
            />

            {/* 
         Refining M coordinates for perfect 45 degree looks?
         If width is 8 (from 28 to 36), center is 32.
         V-shape inner slope: 
         From (36, 45) to (50, 59). Delta X = 14. Delta Y = 14. Slope = 1. Perfect 45 deg.
         V-shape outer slope:
         From (36, 56) to (50, 70). Delta X = 14. Delta Y = 14. Slope = 1. Perfect.
         
         Wait, (36,45) is the inner corner?
         If the bar is x=28..36. Center 32.
         The gap to center is 36..64 (width 28). Center at 50.
         
         The V tip is at x=50y=59 (inner) and x=50y=70 (outer)?
         Thickness of V: sqrt(14^2 + 14^2) is length... horizontal thickness is 14? 
         Bar width is 8. We need diagonal thickness to visually match bar width.
         
         If vertical bar width is 8.
         The diagonal width should ideally be close to 8.
         Distance between parallel lines y=x and y=x+c.
         
         Let's stick to the coordinate geometry which looks 'correct' on grid.
         
         One detail: The Tips of the M legs.
         Top Left Tip: 32,15 center. Triangle top.
         Bottom Left Tip: 32,85 center. Triangle bottom.
      */}

        </svg>
    );
}
