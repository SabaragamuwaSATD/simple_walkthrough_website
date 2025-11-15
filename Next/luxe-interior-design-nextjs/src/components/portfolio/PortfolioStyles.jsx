export const PortfolioStyles = () => (
  <style>{`
    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-60px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes slideOutRight {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(60px);
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeOut {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-20px);
      }
    }

    @keyframes fadeOverlay {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }

    @keyframes shine {
      0% {
        transform: translateX(-100%) skewX(-15deg);
      }
      100% {
        transform: translateX(200%) skewX(-15deg);
      }
    }
    
    @keyframes glowPulse {
      0%, 100% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.2); }
      50% { box-shadow: 0 0 15px rgba(255, 255, 255, 0.9), 0 0 30px rgba(255, 255, 255, 0.4); }
    }

    .perspective-3d {
      perspective: 2000px;
      transform-style: preserve-3d;
    }

    .animate-glowPulse {
      animation: glowPulse 2.5s ease-in-out infinite;
    }

    @media (max-width: 1024px) {
      .perspective-3d {
        perspective: 1000px;
      }
    }
  `}</style>
);