import React, { useEffect, useState, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform, animate, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Lightbulb, Rocket, Users, Target, ArrowRight, Github, Linkedin,
  Calendar, MapPin, ChevronRight, Zap
} from 'lucide-react';

import heroImg from '../assets/hero.jpg';
import innovationImg from '/about.png';
import hackathonImg from '../assets/cross.jpg';
import workshopImg from '../assets/gambed.jpeg';
import eventImg from '../assets/hackathon.jpg';
import gallery1 from '../assets/gallery1.jpg';
import gallery2 from '../assets/gallery2.jpg';
import gallery3 from '../assets/gallery3.jpg';

// Reusing gallery images for the 6-grid as per instructions
const galleryImages = [gallery1, gallery2, gallery3, gallery1, gallery2, gallery3];

const CountUp = ({ to, suffix = "+" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controls = animate(0, to, {
      duration: 2,
      onUpdate(value) {
        setCount(Math.floor(value));
      }
    });
    return () => controls.stop();
  }, [to]);

  return <span>{count}{suffix}</span>;
};

const FadeIn = ({ children, delay = 0, direction = "up" }) => {
  const baseVariants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: { duration: 0.8, delay, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-100px" }}
      variants={baseVariants}
    >
      {children}
    </motion.div>
  );
};

const CursorGlow = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const background = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(34, 211, 238, 0.08), transparent 40%)`;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[100] transition-opacity duration-300 mix-blend-screen"
      style={{ background }}
    />
  );
};

const TiltCard = ({ children, className = "" }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={`relative w-full h-full ${className}`}
    >
      <div style={{ transform: "translateZ(30px)" }} className="absolute inset-0 z-20 pointer-events-none w-full h-full"></div>
      <div style={{ transform: "translateZ(20px)" }} className="w-full h-full">
        {children}
      </div>
    </motion.div>
  );
};

const Home = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const yTextParallax = useTransform(scrollY, [0, 600], [0, -100]);
  const opacityHero = useTransform(scrollY, [0, 600], [1, 0]);

  return (
    <div className="bg-slate-950 text-slate-200 font-sans overflow-hidden pt-20">
      <CursorGlow />

      {/* 1. HERO SECTION (Parallax) */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: y1, opacity: opacityHero }}
          className="absolute inset-0 z-0"
        >
          <img
            src={heroImg}
            alt="Hero Background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
          <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay"></div>
        </motion.div>

        {/* 3D Floating Background Particles */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" style={{ perspective: '1000px' }}>
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 6 + 2,
                height: Math.random() * 6 + 2,
                background: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#8b5cf6' : '#22d3ee',
                boxShadow: `0 0 ${Math.random() * 10 + 5}px currentColor`,
              }}
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                z: Math.random() * -500,
                opacity: Math.random() * 0.5 + 0.2
              }}
              animate={{
                y: [null, Math.random() * -500],
                x: [null, `+=${Math.random() * 200 - 100}`],
                z: [null, `+=${Math.random() * 400 - 200}`],
                opacity: [null, Math.random() * 0.8 + 0.2, 0],
              }}
              transition={{
                duration: Math.random() * 15 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        {/* Real Animated Entity: Coding / Tech Illustration */}
        <div className="absolute right-[5%] md:right-[15%] top-[20%] md:top-[25%] z-0 hidden lg:block pointer-events-none opacity-40">
           <motion.div 
              initial={{ y: 0, rotateY: -15, rotateX: 10 }}
              animate={{ y: [-20, 20, -20], rotateY: [-15, -5, -15], rotateZ: [0, 2, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-64 h-64"
           >
              {/* Main Monitor Base */}
              <div className="absolute inset-0 bg-slate-800/80 backdrop-blur-xl border-2 border-slate-600 rounded-xl shadow-[0_0_50px_rgba(34,211,238,0.2)] flex flex-col overflow-hidden">
                 {/* Title bar */}
                 <div className="h-6 bg-slate-900 border-b border-slate-700 flex items-center px-3 gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                 </div>
                 {/* Screen Content */}
                 <div className="flex-1 p-4 relative flex flex-col gap-3">
                    <motion.div 
                       initial={{ width: 0 }} 
                       animate={{ width: "80%" }} 
                       transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                       className="h-2 bg-blue-500/50 rounded"
                    />
                    <motion.div 
                       initial={{ width: 0 }} 
                       animate={{ width: "60%" }} 
                       transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                       className="h-2 bg-purple-500/50 rounded"
                    />
                    <motion.div 
                       initial={{ width: 0 }} 
                       animate={{ width: "90%" }} 
                       transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", delay: 1 }}
                       className="h-2 bg-cyan-500/50 rounded"
                    />
                    {/* Floating Code Icon */}
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute bottom-4 right-4 text-cyan-400"
                    >
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                    </motion.div>
                 </div>
              </div>
              {/* Glowing Keyboard Base */}
              <motion.div 
                 animate={{ opacity: [0.4, 0.8, 0.4] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="absolute -bottom-8 -left-4 w-[110%] h-12 bg-slate-700 rounded-b-xl transform perspective-1000 rotateX-[60deg] shadow-[0_20px_50px_rgba(124,58,237,0.5)] border-t border-slate-500"
              />
           </motion.div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ y: useTransform(scrollY, [0, 500], [0, -50]) }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-purple-500/30 backdrop-blur-md mb-8">
              <Zap size={16} className="text-purple-400" />
              <span className="text-sm font-medium tracking-wider text-purple-200 uppercase">Institution’s Innovation Council</span>
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-500 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
            style={{ y: yTextParallax }}
          >
            Empowering Innovation & Entrepreneurship
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ y: useTransform(scrollY, [0, 600], [0, -80]) }}
          >
            Encouraging students to build innovative ideas, startups, and technological solutions for a better tomorrow.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 relative z-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/join" className="group relative px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold transition-all duration-300 overflow-hidden shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)]">
              <span className="relative z-10 flex items-center gap-2">Join IIC <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
            </Link>
            <Link to="/events" className="px-8 py-4 bg-slate-800/80 hover:bg-slate-700 backdrop-blur-md text-slate-100 rounded-lg font-semibold border border-slate-700 hover:border-blue-500/50 transition-all duration-300 text-center">
              Explore Events
            </Link>
            <Link to="/submit-idea" className="px-8 py-4 bg-transparent text-cyan-400 hover:text-cyan-300 font-semibold transition-all duration-300 text-center hover:underline decoration-cyan-400/50 underline-offset-8">
              Submit Innovation Idea
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-500">
          <p className="text-xs uppercase tracking-widest mb-2 text-center">Scroll</p>
          <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center p-1">
            <div className="w-1.5 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT PREVIEW SECTION */}
      <section className="py-24 relative z-10 w-full">
        <motion.div style={{ y: useTransform(scrollY, [0, 1000], [0, -100]) }} className="absolute -left-32 top-10 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right">
              <div className="relative group rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent z-10 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-500"></div>
                <img src={innovationImg} alt="Innovation" className="w-full h-[500px] object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 group-hover:opacity-50 blur transition-opacity duration-500 -z-10"></div>
              </div>
            </FadeIn>
            <FadeIn direction="left" delay={0.2}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: false, margin: "-100px" }}
              >
                <h2 className="text-sm font-bold tracking-widest text-blue-400 uppercase mb-3">About Us</h2>
                <h3 className="text-4xl md:text-5xl font-bold mb-6 heading-glow text-white">Fueling the Next Generation of Creators</h3>
                <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                  The Institution’s Innovation Council promotes innovation, entrepreneurship, and creativity among students through workshops, hackathons, and startup mentoring. We bridge the gap between academic learning and real-world problem solving.
                </p>
                <Link to="/about" className="inline-flex items-center gap-2 text-purple-400 font-semibold hover:text-purple-300 transition-colors group">
                  Read More <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 3. WHAT WE DO SECTION */}
      <section className="py-24 bg-slate-900/50 relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-sm font-bold tracking-widest text-cyan-400 uppercase mb-3">Core Activities</h2>
              <h3 className="text-4xl font-bold text-white mb-6">What We Do</h3>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Startup Ideation", desc: "Turn your raw ideas into viable business models with expert mentorship.", icon: Lightbulb, color: "text-amber-400", bg: "bg-amber-400/10", border: "group-hover:border-amber-400/50" },
              { title: "Hackathons", desc: "Compete in intense building sessions and solve real-world problems.", icon: Zap, color: "text-purple-400", bg: "bg-purple-400/10", border: "group-hover:border-purple-400/50" },
              { title: "Workshops", desc: "Learn cutting-edge skills and technologies from industry leaders.", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10", border: "group-hover:border-blue-400/50" },
              { title: "Project Incubation", desc: "Get resources and guidance to build long-term impactful projects.", icon: Rocket, color: "text-cyan-400", bg: "bg-cyan-400/10", border: "group-hover:border-cyan-400/50" }
            ].map((item, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <TiltCard>
                  <div className={`h-full group p-8 rounded-2xl bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 ${item.border} hover:bg-slate-800/80 transition-all duration-300 relative overflow-hidden shadow-xl hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]`}>
                    <div className={`w-14 h-14 rounded-xl ${item.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className={item.color} size={28} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-100 mb-3">{item.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    <div className="absolute top-0 right-0 -m-8 w-32 h-32 bg-white/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </div>
                </TiltCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED EVENTS SECTION */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <FadeIn>
              <h2 className="text-sm font-bold tracking-widest text-purple-400 uppercase mb-3">Our Calendar</h2>
              <h3 className="text-4xl font-bold text-white">Featured Events</h3>
            </FadeIn>
            <FadeIn direction="left">
              <Link to="/events" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-700 hover:border-slate-500 hover:bg-slate-800 transition-colors">
                View All Events <ChevronRight size={16} />
              </Link>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { img: hackathonImg, title: "CROSSROADS 2026", date: "FEBRUARY 27-28, 2026" },
              { img: workshopImg, title: "GAMBED QUIZ COMPETITION", date: "NOV 2, 2026" },
              { img: eventImg, title: "HACKATHON 2026", date: "June 10, 2026" }
            ].map((event, idx) => (
              <FadeIn key={idx} delay={idx * 0.15}>
                <div className="group rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-purple-500/50 transition-colors duration-300">
                  <div className="relative h-60 overflow-hidden">
                    <img src={event.img} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80"></div>
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs font-medium bg-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-full text-cyan-300">
                      <Calendar size={14} /> {event.date}
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-slate-100 mb-4 group-hover:text-purple-400 transition-colors">{event.title}</h4>
                    <button className="w-full py-3 rounded-lg bg-slate-800 hover:bg-purple-600 text-white font-medium transition-colors duration-300">
                      Register Now
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INNOVATION PROJECTS SECTION */}
      <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-sm font-bold tracking-widest text-blue-400 uppercase mb-3">Student Showcase</h2>
              <h3 className="text-4xl font-bold text-white">Innovation Projects</h3>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "NeuroSync API", desc: "A brain-computer interface middleware for web applications.", img: gallery1, tag: "AI/ML" },
              { title: "EcoCharge Network", desc: "Decentralized EV charging station mapping and booking DApp.", img: gallery2, tag: "Web3" },
              { title: "Smart Agro IoT", desc: "Precision agriculture utilizing low-cost sensors to predict crop yields.", img: gallery3, tag: "Hardware" }
            ].map((proj, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <TiltCard>
                  <div className="group relative bg-slate-800/30 rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_20px_40px_rgba(59,130,246,0.2)] transition-all duration-500 border border-slate-700/50 hover:border-blue-500/50 h-full">
                    <div className="h-48 overflow-hidden relative">
                      <img src={proj.img} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 text-xs font-bold rounded text-slate-300">{proj.tag}</div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-white mb-2">{proj.title}</h4>
                      <p className="text-slate-400 text-sm mb-6">{proj.desc}</p>
                      <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">
                        <Github size={18} /> View Source
                      </a>
                    </div>
                  </div>
                </TiltCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 6. IMPACT STATISTICS SECTION */}
      <section className="py-20 relative border-y border-slate-800 bg-slate-900/20">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            {[
              { num: 150, text: "Active Members", color: "text-purple-400" },
              { num: 40, text: "Events Hosted", color: "text-blue-400" },
              { num: 60, text: "Innovation Ideas", color: "text-cyan-400" },
              { num: 20, text: "Startup Projects", color: "text-amber-400" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
                }}
              >
                <div className={`text-5xl md:text-6xl font-black mb-2 font-mono ${stat.color}`}>
                  <CountUp to={stat.num} />
                </div>
                <p className="text-slate-400 font-medium uppercase tracking-wide text-sm">{stat.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 7. TEAM PREVIEW SECTION REMOVED */}

      {/* 8. CALL TO ACTION SECTION */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-[#0a0f1e] to-slate-950 opacity-95 z-0"></div>
        {/* Animated Background Shapes */}
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-[120px] opacity-30 pointer-events-none"
          animate={{ x: [0, -70, 0], y: [0, 70, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[120px] opacity-40 pointer-events-none"
          animate={{ x: [0, 70, 0], y: [0, -70, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="container mx-auto px-6 relative z-10 max-w-4xl text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight text-shadow-lg">
              Become a Part of the Innovation Community
            </h2>
            <p className="text-xl md:text-2xl text-slate-300/90 mb-10 max-w-2xl mx-auto">
              Turn your ideas into impactful innovations. Get resources, mentorship, and a platform to shine.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/join" className="w-full sm:w-auto px-8 py-4 bg-white text-blue-900 hover:bg-slate-100 rounded-lg font-bold transition-colors shadow-lg shadow-white/10">
                Join IIC Today
              </Link>
              <Link to="/submit" className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/30 text-white hover:bg-white/10 rounded-lg font-bold transition-colors">
                Submit Your Idea
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 8. GALLERY PREVIEW SECTION */}
      <section className="py-24 bg-slate-950 relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <FadeIn>
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-sm font-bold tracking-widest text-cyan-400 uppercase mb-3">Moments</h2>
                <h3 className="text-4xl font-bold text-white">Gallery Preview</h3>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {galleryImages.map((img, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="group relative aspect-square md:aspect-[4/3] rounded-xl overflow-hidden bg-slate-800">
                  <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay group-hover:opacity-0 transition-opacity z-10"></div>
                  <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-end justify-center pb-6">
                    <span className="text-white font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-300">View Memory</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Footer is rendered in App.jsx globally */}

    </div>
  );
};

export default Home;