import { useState, useRef, useEffect } from "react";
import "./Hero.css";
import { translations } from '../../translations';


export default function Hero({ lang }: { lang: string }) {
  const [rotation, setRotation] = useState({ x: 10, y: 20 });
  const [showDemo, setShowDemo] = useState(false);
  const mobileRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isDraggingRef = useRef(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null); 
  const [isVideoTransitioning, setIsVideoTransitioning] = useState(false);
  
  // Fix: Get the full language object instead of just the about section
  const t = translations[lang as keyof typeof translations] || translations.es;

  
  const handleActionClick = (action: string, e: React.MouseEvent) => {
    if (action === selectedAction) return;
    e.preventDefault();
    setIsVideoTransitioning(true); 

    if (window.innerWidth < 768) {
      mobileRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    setTimeout(() => {
      setSelectedAction(action);
      setVideoPlaying(false);
      setTimeout(() => {
        setIsVideoTransitioning(false);
      }, 500); 
    }, 200); 
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastPositionRef.current = { x: e.clientX, y: e.clientY };
    tryPlayVideo();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      lastPositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      document.body.style.overflowY = 'hidden';
      tryPlayVideo();
    }
  };

  const tryPlayVideo = () => {
    if (videoRef.current && !videoPlaying) {
      videoRef.current.play()
        .then(() => {
          setVideoPlaying(true);
        })
        .catch(error => {
          console.log("Auto-play prevented:", error);
        });
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    document.body.style.overflowY = '';
    
    setTimeout(() => {
      setRotation({ x: 0, y: 0 });
    }, 1000);
  };

  const handleMouseLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setTimeout(() => {
        setRotation({ x: 0, y: 0 });
      }, 1000);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    
    const deltaX = e.clientX - lastPositionRef.current.x;
    const deltaY = e.clientY - lastPositionRef.current.y;
    
    setRotation(prev => ({
      x: Math.max(-20, Math.min(20, prev.x + deltaY * 0.5)),
      y: Math.max(-30, Math.min(30, prev.y - deltaX * 0.5))
    }));
    
    lastPositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    
    e.preventDefault();
    
    const deltaX = e.touches[0].clientX - lastPositionRef.current.x;
    const deltaY = e.touches[0].clientY - lastPositionRef.current.y;
    
    setRotation(prev => ({
      x: Math.max(-20, Math.min(20, prev.x + deltaY * 0.5)),
      y: Math.max(-30, Math.min(30, prev.y - deltaX * 0.5))
    }));
    
    lastPositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    tryPlayVideo();
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        tryPlayVideo();
      }
    }, { threshold: 0.5 });
    
    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (videoRef.current && selectedAction) {
      videoRef.current.load();
      tryPlayVideo();
    }
  }, [selectedAction]);

  return (
    <div className="hero">
      <div className="hero-container">
        {/* Left side - Mobile phone with video */}
        <div
          id="hero-mobile-container" 
          className="hero-mobile-container">
          <div 
            ref={mobileRef}
            className="hero-mobile" 
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{
              transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
            }}
          >
            <div className="hero-mobile-frame">
              <div className="hero-mobile-notch">
              </div>
              <div className="hero-mobile-screen">
                {
                  !selectedAction ? (
                    <img
                      src="/images/logo.png" 
                      alt="Mobile phone"
                      className='hero-mobile-image'
                      />
                  ) : (
                    <video 
                      ref={videoRef}
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      disablePictureInPicture 
                      className={`hero-mobile-video ${isVideoTransitioning ? 'video-transitioning' : ''}`}
                      onClick={tryPlayVideo}
                    >
                    <source src={`/video/${selectedAction}.webm`} type="video/webm" />
                    Your browser does not support the video tag.
                    </video>
                  )
                }

              </div>
              <div className="hero-mobile-button"></div>
            </div>
          </div>
          <p className="hero-mobile-hint">{t.hero.rotateHint}</p>
        </div>

        {/* Right side - Name and tech stack */}
        <div className={`hero-content ${showDemo ? 'slide-out' : 'slide-in'}`}>
          <h1 className="hero-title">{t.hero.title}</h1>
          <p className="hero-description">
            {t.hero.description}
          </p>
          <div className="hero-tech-stack">
            <h2>{t.hero.keyFeatures}</h2>
            <div className="hero-tech-icons">
              <span className="tech-icon">{t.hero.features.attendanceTracking}</span>
              <span className="tech-icon">{t.hero.features.timeHistory}</span>
              <span className="tech-icon">{t.hero.features.workReports}</span>
              <span className="tech-icon">{t.hero.features.workerManagement}</span>
              <span className="tech-icon">{t.hero.features.projectTracking}</span>
              <span className="tech-icon">{t.hero.features.realTimeUpdates}</span>
              <span className="tech-icon">{t.hero.features.dataAnalytics}</span>
            </div>
          </div>
          <button onClick={() => setShowDemo(true)} className="hero-button">{t.hero.showDemo}</button>
        </div>

        <div className={`hero-proyect-demo ${showDemo ? 'slide-in' : 'slide-out'}`}>
          <div className="hero-proyect-demo-content">
            <h2 className="demo-title">{t.hero.characteristics}</h2>
            
            <div className="role-legend">
              <div className="role-item">
                <div className="role-indicator employee"></div>
                <span>{t.hero.roles.employee}</span>
              </div>
              <div className="role-item">
                <div className="role-indicator manager"></div>
                <span>{t.hero.roles.manager}</span>
              </div>
            </div>
            
            <div className="demo-cards-container">
              <div className="demo-cards-grid">
                { [
                  { id: 'control-asistencia', key: 'attendanceControl', icon: '⏱️', role: 'employee' },
                  { id: 'historial-horario', key: 'timeHistory', icon: '📊', role: 'employee' },
                  { id: 'partes-trabajo', key: 'createReports', icon: '📝', role: 'employee' },
                  { id: 'gestionar-obras', key: 'manageWorkers', icon: '👷', role: 'manager' }
                ].map((action) => (
                  <div 
                    key={action.id}
                    className={`demo-card ${selectedAction === action.id ? 'active' : ''} ${action.role}`}
                    onClick={(e) => handleActionClick(action.id, e)}
                  >
                    <div className="demo-card-icon">{action.icon}</div>
                    <span className="demo-card-title">
                      {t.hero.actions[action.key as keyof typeof t.hero.actions]}
                    </span>
                    <div className="demo-card-indicator"></div>
                  </div>
                )) }
              </div>
            </div>
            
            <button 
              onClick={() => setShowDemo(false)} 
              className="hero-close-button"
            >
              <span className="close-icon">×</span>
              <span className="close-text">{t.hero.close}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}