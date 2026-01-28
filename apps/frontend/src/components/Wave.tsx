export default function WaveSection() {
  return (
    <div className="absolute bottom-0 left-0 w-full h-64 overflow-hidden pointer-events-none">
      <div className="relative z-10 px-10 py-32"></div>

      <div className="absolute bottom-0 left-0 w-full">
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path
            fill="#2563eb"
            d="M0 210c180-70 360-120 540-95 180 30 360 105 540 95 120-10 240-45 360-70v180H0Z"
          />
        </svg>
      </div>
    </div>
  );
}
