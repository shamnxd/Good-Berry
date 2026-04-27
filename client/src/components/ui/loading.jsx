"use client";

const BallScaleMultiple = () => {
  return (
    <div className="ball-scale-multiple">
      <div></div>
      <div></div>
      <div></div>
      <style>{`
        .ball-scale-multiple {
          position: absolute;
          left: 50%;
          top: 50%;
          margin-top: -30px;
          margin-left: -30px;
        }
        .ball-scale-multiple div {
          position: absolute;
          left: 0;
          top: 0;
          width: 60px;
          height: 60px;
          background: #90c846;
          border-radius: 100%;
          opacity: 0;
          animation: ball-scale-multiple 1.5s linear infinite;
        }
        .ball-scale-multiple div:nth-child(2) {
          animation-delay: 0.2s;
        }
        .ball-scale-multiple div:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes ball-scale-multiple {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default BallScaleMultiple;

// Usage example
export function Component() {
  return (
    <div className="wrapper">
      <BallScaleMultiple />
      <style>{`
        .wrapper {
          position: relative;
          width: 100%;
          height: 100vh;
          background: black;
        }
      `}</style>
    </div>
  );
}
