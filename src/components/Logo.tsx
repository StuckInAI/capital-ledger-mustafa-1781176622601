import clsx from 'clsx';

type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export default function Logo({ size = 'md', className }: LogoProps) {
  const dims = {
    sm: { outer: 'w-8 h-8', rx: '9', coinR: 11, coinR2: 9, fontSize: 10, kX: 16, kY: 20, dotR: 1.2, coinCx: 16, coinCy: 15 },
    md: { outer: 'w-10 h-10', rx: '11', coinR: 14, coinR2: 11, fontSize: 13, kX: 20, kY: 26, dotR: 1.5, coinCx: 20, coinCy: 18 },
    lg: { outer: 'w-20 h-20', rx: '22', coinR: 28, coinR2: 23, fontSize: 26, kX: 41, kY: 56, dotR: 3, coinCx: 50, coinCy: 46 },
  }[size];

  const vb = size === 'lg' ? '0 0 100 100' : size === 'md' ? '0 0 40 40' : '0 0 32 32';
  const w = size === 'lg' ? 100 : size === 'md' ? 40 : 32;
  const h = w;

  return (
    <div className={clsx('flex-shrink-0', className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={vb}
        width={w}
        height={h}
        className={dims.outer}
      >
        <defs>
          <linearGradient id={`bgGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id={`coinGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        {/* Background */}
        <rect width={w} height={h} rx={dims.rx} fill={`url(#bgGrad-${size})`} />
        {/* Inner border */}
        <rect
          x={w * 0.06}
          y={h * 0.06}
          width={w * 0.88}
          height={h * 0.88}
          rx={Number(dims.rx) - 2}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
        {/* Coin */}
        <circle cx={dims.coinCx} cy={dims.coinCy} r={dims.coinR} fill={`url(#coinGrad-${size})`} />
        <circle cx={dims.coinCx} cy={dims.coinCy} r={dims.coinR2} fill="none" stroke="#d97706" strokeWidth={size === 'sm' ? 1 : 1.5} />
        {/* K letter */}
        <text
          x={dims.kX}
          y={dims.kY}
          fontFamily="Georgia, serif"
          fontSize={dims.fontSize}
          fontWeight="bold"
          fill="#1d4ed8"
          textAnchor="middle"
        >
          K
        </text>
        {/* Bottom dots */}
        {size === 'lg' && (
          <>
            <circle cx={22} cy={82} r={dims.dotR} fill="rgba(255,255,255,0.4)" />
            <circle cx={50} cy={88} r={dims.dotR} fill="rgba(255,255,255,0.4)" />
            <circle cx={78} cy={82} r={dims.dotR} fill="rgba(255,255,255,0.4)" />
          </>
        )}
      </svg>
    </div>
  );
}
