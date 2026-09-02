import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DevCard from "./DevCard";
import LaserFlow from "./LaserFlow";

gsap.registerPlugin(ScrollTrigger);

const allDevelopers = [
  // {
  //   name: "Aryan Singh",
  //   role: "WEB DEV Facilitator",
  //   image: "/clubprofiles/aryan-singh.webp",
  //   username: "@aryancheers",
  //   github: "https://github.com/masamasaowl",
  //   linkedin: "https://www.linkedin.com/in/aryan-singh-ait/",
  // },
  {
    name: "Nishant Singh",
    role: "GDG Secretary",
    image: "/clubprofiles/nishant.jpeg",
    username: "@_nishant_singhh_",
    github: "https://github.com/NishantSinghhhhh",
    linkedin: "https://www.linkedin.com/in/nishant-singh-8a5a00282/",
  },
  {
    name: "Aryan Singh",
    role: "Web Facilitator",
    image: "/clubprofiles/aryan-singh.webp",
    username: "@aryancheers",
    github: "https://github.com/masamasaowl",
    linkedin: "https://www.linkedin.com/in/aryancheers/",
  },
  {
    name: "Sanya singh",
    role: "UI/UX Designer",
    image: "/clubprofiles/mam.jpeg",
    username: "@sanyasingh5290",
    github: "https://github.com/PeushYadav",
    linkedin: "https://www.linkedin.com/in/peush-yadav-8b4357335/",
  },
  {
    name: "Peush Yadav",
    role: "Web Facilitator",
    image: "/clubprofiles/peush.png",
    username: "@peush_btw",
    github: "https://github.com/PeushYadav",
    linkedin: "https://www.linkedin.com/in/peush-yadav-8b4357335/",
  },
  {
    name: "Jitesh Yadav",
    role: "Dev X UI/UX",
    image: "/clubprofiles/jittu.jpeg",
    username: "@jittu.raox",
    github: "https://github.com/JiteshYadavvvvv",
    linkedin: "https://www.linkedin.com/in/jitesh-yadav01/",
  },
  {
    name: "Vishal Goswami",
    role: "Web Developer",
    image: "/clubprofiles/vishal.jpeg",
    username: "@_goswami.vishal",
    github: "https://github.com/MyTricks-code",
    linkedin: "https://www.linkedin.com/in/vishal-goswami19/",
  },
  {
    name: "Sajal Rawat",
    role: "Web Developer",
    image: "/clubprofiles/SajalRawat.jpeg",
    imgContain: true,
    username: "@sajalrwt",
    github: "https://github.com/SajalRawat",
    linkedin: "https://www.linkedin.com/in/sajal-rawat/",
  },

];

const DevGrid = () => {
  const containerRef = useRef(null);
  const revealImgRef = useRef(null);
  const cardWrapRef = useRef(null);
  const [laser, setLaser] = useState(null);

  useLayoutEffect(() => {
    const measure = () => {
      if (!containerRef.current || !cardWrapRef.current) return;
      const containerTop = containerRef.current.getBoundingClientRect().top + window.scrollY;
      const cardTop = cardWrapRef.current.getBoundingClientRect().top + window.scrollY;
      // Canvas spans from the document top (y=0) to just past the card's top
      // edge, so the flare glow at the impact point isn't cut off.
      const height = cardTop + 260;
      setLaser({
        top: -containerTop,
        height,
        beamY: 0.5 - cardTop / height,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    ScrollTrigger.getAll().forEach(t => {
      if (t.vars.trigger === containerRef.current) {
        t.kill();
      }
    });

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".dev-card-element",
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (!revealImgRef.current) return;
      const rect = revealImgRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      revealImgRef.current.style.setProperty('--mx', `${x}px`);
      revealImgRef.current.style.setProperty('--my', `${y}px`);
    };

    const handleGlobalMouseLeave = () => {
      if (!revealImgRef.current) return;
      revealImgRef.current.style.setProperty('--mx', '-9999px');
      revealImgRef.current.style.setProperty('--my', '-9999px');
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseleave', handleGlobalMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseleave', handleGlobalMouseLeave);
    };
  }, []);

  if (allDevelopers.length === 0) {
    return (
      <div className="w-full text-center py-20 text-zinc-500">
        <p>No developers found.</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-transparent mt-0 pb-24"
    >

      {laser && (
        <div
          className="absolute left-0 right-0 z-5 pointer-events-none"
          style={{ top: laser.top, height: laser.height }}
        >
          <LaserFlow
            color="#f4f4f5"
            horizontalSizing={0.75}
            verticalSizing={3.1}
            wispDensity={5}
            wispSpeed={50}
            wispIntensity={20}
            flowSpeed={0.35}
            flowStrength={0.92}
            fogIntensity={0.71}
            fogScale={0.75}
            fogFallSpeed={0.91}
            decay={0.80}
            falloffStart={1.6}
            verticalBeamOffset={laser.beamY}
          />
        </div>
      )}


      <img
        ref={revealImgRef}
        src="/clubprofiles/bg.jpeg"
        alt="Reveal effect"
        className="fixed inset-0 -top-100 max-w-full z-4 mix-blend-lighten pointer-events-none opacity-30 object-cover"
        style={{
          '--mx': '-9999px',
          '--my': '-9999px',
          WebkitMaskImage: 'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
          maskImage: 'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat'
        }}
      />


      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 mt-20">
        <div className="w-full max-w-300 mx-auto flex flex-col items-center">
          
          <div ref={cardWrapRef} className="w-full bg-zinc-900 rounded-3xl border border-[#f4f4f5] shadow-[0_-10px_60px_rgba(255,255,255,0.02)] relative overflow-hidden px-3 py-4 sm:px-4 sm:py-5 lg:px-5 lg:py-6 z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-0.5 bg-linear-to-r from-transparent via-[#f4f4f5] to-transparent shadow-[0_0_15px_rgba(244,244,245,0.4)] z-[2]" />

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 relative z-10">
              {allDevelopers.slice(0, 6).map((dev, index) => {
                return <DevCard key={`${dev.username}-${index}`} dev={dev} />;
              })}
            </div>
          </div>

          {allDevelopers.length > 6 && (
            <div className="mx-auto bg-zinc-900 rounded-b-3xl border border-[#f4f4f5] border-t-0 relative px-3 pb-4 sm:px-4 sm:pb-5 md:px-4 lg:px-2.5 lg:pb-6 pt-0 z-20 w-full md:w-[calc(50%+8px)] lg:w-[calc(33.333%-6.66px)] -mt-[1px]">
              
              {/* Left inner rounded corner (fillet) */}
              <svg width="25" height="25" viewBox="0 0 25 25" className="absolute top-0 -left-[24px] z-30 pointer-events-none hidden sm:block">
                <path d="M 0.5,0.5 A 24,24 0 0,1 24.5,24.5 L 25,24.5 L 25,0 L 0,0 Z" fill="#18181b" />
                <path d="M 0.5,0.5 A 24,24 0 0,1 24.5,24.5" fill="none" stroke="#f4f4f5" strokeWidth="1" />
              </svg>

              {/* Right inner rounded corner (fillet) */}
              <svg width="25" height="25" viewBox="0 0 25 25" className="absolute top-0 -right-[24px] z-30 pointer-events-none hidden sm:block">
                <path d="M 24.5,0.5 A 24,24 0 0,0 0.5,24.5 L 0,24.5 L 0,0 L 25,0 Z" fill="#18181b" />
                <path d="M 24.5,0.5 A 24,24 0 0,0 0.5,24.5" fill="none" stroke="#f4f4f5" strokeWidth="1" />
              </svg>

              <div className="relative z-10">
                {allDevelopers.slice(6).map((dev, index) => {
                  return <DevCard key={`${dev.username}-${index + 6}`} dev={dev} />;
                })}
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default DevGrid;
