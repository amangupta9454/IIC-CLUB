import React, { useEffect, useState, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionTemplate,
  useMotionValue,
  animate
} from 'framer-motion';
import {
  Rocket,
  Cpu,
  Globe,
  Lightbulb,
  Users,
  TrendingUp,
  Layers,
  ArrowRight,
  Code2,
  Share2,
  Target,
  Box,
  Terminal,
  GitBranch,
  Zap,
  Trophy,
  FileCode,
  Braces
} from 'lucide-react';
import { FaLinkedinIn, FaGithub } from 'react-icons/fa';
import innovationImg from '/about.png';

const CODE_SNIPPETS = [
  'const innovate = () => {};',
  'function build() {}',
  'import { future }',
  'npm run create',
  'git commit -m "innovation"',
  'while(learning) { grow(); }',
  'class Hackathon {}',
  'async research() {}',
  'export default Ideas;',
  '<Innovation />',
  '{ transform: "ideas" }',
  'SELECT * FROM solutions;'
];

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
            style={{ background, willChange: 'background' }}
        />
    );
};

const FloatingCode = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden opacity-20">
            {CODE_SNIPPETS.map((snippet, i) => (
                <motion.div
                    key={i}
                    className="absolute font-mono text-xs md:text-sm text-cyan-400 whitespace-nowrap"
                    style={{
                        left: `${Math.random() * 100}%`,
                        filter: 'blur(0.5px)',
                        willChange: 'transform, opacity'
                    }}
                    initial={{
                        y: -100,
                        opacity: 0,
                        rotate: Math.random() * 20 - 10
                    }}
                    animate={{
                        y: '110vh',
                        opacity: [0, 0.8, 0.8, 0],
                        rotate: Math.random() * 40 - 20
                    }}
                    transition={{
                        duration: Math.random() * 15 + 10,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: "linear"
                    }}
                >
                    {snippet}
                </motion.div>
            ))}
        </div>
    );
};

const MatrixRain = () => {
    const columns = 30;
    return (
        <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden opacity-10">
            {[...Array(columns)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute top-0 font-mono text-green-500 text-xs"
                    style={{ left: `${(i / columns) * 100}%`, willChange: 'transform' }}
                    initial={{ y: -100 }}
                    animate={{ y: '110vh' }}
                    transition={{
                        duration: Math.random() * 3 + 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "linear"
                    }}
                >
                    {Array.from({ length: 20 }, () =>
                        Math.random() > 0.5 ? '1' : '0'
                    ).join(' ')}
                </motion.div>
            ))}
        </div>
    );
};

const TiltCard = ({ children, className = "" }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set(mouseX / width - 0.5);
        y.set(mouseY / height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0); y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
            className={`relative w-full h-full ${className}`}
        >
            <div style={{ transform: "translateZ(40px)" }} className="absolute inset-0 z-20 pointer-events-none"></div>
            <div style={{ transform: "translateZ(20px)" }} className="w-full h-full relative z-10">
                {children}
            </div>
        </motion.div>
    );
};

const CountUp = ({ to, suffix = "+" }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        const controls = animate(0, to, {
            duration: 2.5,
            ease: "easeOut",
            onUpdate: (val) => setCount(Math.floor(val))
        });
        return () => controls.stop();
    }, [to]);
    return <span>{count}{suffix}</span>;
};

const HackathonBadge = () => (
    <motion.div
        className="absolute top-20 right-10 bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-2xl shadow-2xl border-4 border-amber-300"
        style={{ willChange: 'transform' }}
        animate={{
            rotateY: [0, 360],
            scale: [1, 1.1, 1]
        }}
        transition={{
            rotateY: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity }
        }}
    >
        <Trophy className="text-white" size={32} />
    </motion.div>
);

const TerminalWindow = ({ children, className = "" }) => (
    <div className={`bg-[#0d1117] rounded-lg border border-[#30363d] overflow-hidden shadow-2xl ${className}`}>
        <div className="bg-[#161b22] px-4 py-2 flex items-center gap-2 border-b border-[#30363d]">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            <span className="ml-2 text-xs text-slate-500 font-mono">terminal</span>
        </div>
        <div className="p-4 font-mono text-sm">
            {children}
        </div>
    </div>
);

const About = () => {
    const { scrollYProgress } = useScroll();
    const yHeroParallax = useTransform(scrollYProgress, [0, 1], [0, -400]);
    const yGlobeScroll = useTransform(scrollYProgress, [0, 1], [0, 300]);
    const rotateGlobeScroll = useTransform(scrollYProgress, [0, 1], [0, 180]);

    return (
        <div className="bg-[#020617] text-slate-200 font-sans overflow-hidden selection:bg-cyan-500/30">
            <CursorGlow />
            <FloatingCode />
            <MatrixRain />

            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
                {[...Array(40)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: Math.random() * 3 + 1,
                            height: Math.random() * 3 + 1,
                            backgroundColor: i % 3 === 0 ? '#22d3ee' : i % 3 === 1 ? '#a855f7' : '#10b981',
                            boxShadow: `0 0 10px ${i % 3 === 0 ? '#22d3ee' : i % 3 === 1 ? '#a855f7' : '#10b981'}`,
                            willChange: 'transform, opacity'
                        }}
                        initial={{
                            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000) + 500,
                            opacity: 0
                        }}
                        animate={{
                            y: [null, -100],
                            x: [null, `+=${Math.random() * 200 - 100}`],
                            opacity: [0, Math.random() * 0.8, 0]
                        }}
                        transition={{
                            duration: Math.random() * 20 + 15,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 5
                        }}
                    />
                ))}
            </div>

            <section className="relative h-[120vh] flex flex-col items-center justify-center pt-20 overflow-hidden z-10 border-b border-white/5">
                <motion.div style={{ y: yHeroParallax }} className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(2,6,23,0)_50%,#020617_100%)] z-10" />

                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `linear-gradient(rgba(34, 211, 238, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.2) 1px, transparent 1px)`,
                            backgroundSize: '50px 50px',
                            transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
                            willChange: 'transform'
                        }}
                    />

                    <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] opacity-40">
                        <motion.div
                            style={{ y: yGlobeScroll, rotateZ: rotateGlobeScroll }}
                            className="relative w-full h-full border border-purple-500/30 rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(124,58,237,0.2)]"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                className="absolute w-[120%] h-[120%] border border-cyan-500/20 rounded-full border-dashed"
                            />

                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute w-full h-full">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#020617] border border-cyan-500 rounded-full p-3 shadow-[0_0_20px_#22d3ee]">
                                    <Lightbulb size={24} className="text-cyan-400" />
                                </div>
                            </motion.div>
                            <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute w-[80%] h-[80%] border border-blue-500/20 rounded-full">
                                <div className="absolute top-1/2 -right-6 -translate-y-1/2 bg-[#020617] border border-blue-500 rounded-full p-3 shadow-[0_0_20px_#3b82f6]">
                                    <Rocket size={24} className="text-blue-400" />
                                </div>
                            </motion.div>
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute w-[60%] h-[60%]">
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-[#020617] border border-green-500 rounded-full p-3 shadow-[0_0_20px_#10b981]">
                                    <Code2 size={24} className="text-green-400" />
                                </div>
                            </motion.div>
                            <div className="w-32 h-32 bg-purple-600 rounded-full blur-3xl opacity-50 animate-pulse" />
                        </motion.div>
                    </div>
                </motion.div>

                <div className="relative z-20 text-center max-w-5xl px-6 mt-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                    >
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-green-500/30 bg-green-500/10 text-green-300 text-sm font-mono"
                            animate={{ boxShadow: ['0 0 20px rgba(16,185,129,0.3)', '0 0 40px rgba(16,185,129,0.6)', '0 0 20px rgba(16,185,129,0.3)'] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Terminal size={16} className="animate-pulse" />
                            <span>$ sudo apt install innovation</span>
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-cyan-100 to-purple-400 drop-shadow-[0_0_30px_rgba(124,58,237,0.3)]">
                            Driving Innovation Through <br className="hidden md:block"/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500">
                                Creativity & Technology
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed border-l-4 border-cyan-500 pl-6 text-left md:text-center md:border-l-0 md:pl-0">
                            The Institution's Innovation Council empowers students to build innovative solutions, startups, and impactful edge technologies.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-32 relative z-20 bg-[#020617]">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                        >
                            <TiltCard>
                                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(124,58,237,0.15)] bg-slate-900/50 p-2">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 mix-blend-overlay z-10" />
                                    <img src={innovationImg} alt="IIC Innovation" loading="lazy" width="800" height="500" className="w-full h-[500px] object-cover rounded-xl grayscale-[20%] contrast-125 bg-slate-800" />

                                    <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity }} style={{ willChange: 'transform' }} className="absolute top-10 right-10 z-20 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-cyan-500/50">
                                        <Cpu size={32} className="text-cyan-400" />
                                    </motion.div>
                                    <motion.div animate={{ y: [10, -10, 10] }} transition={{ duration: 5, repeat: Infinity }} style={{ willChange: 'transform' }} className="absolute bottom-20 left-10 z-20 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-purple-500/50">
                                        <Code2 size={32} className="text-purple-400" />
                                    </motion.div>
                                    <motion.div
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                        style={{ willChange: 'transform' }}
                                        className="absolute top-1/2 right-20 z-20 bg-black/60 backdrop-blur-md p-3 rounded-full border border-green-500/50"
                                    >
                                        <GitBranch size={24} className="text-green-400" />
                                    </motion.div>
                                </div>
                            </TiltCard>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm font-bold tracking-widest uppercase">
                                <Globe size={16} /> Overview
                            </div>
                            <h3 className="text-4xl md:text-5xl font-bold leading-tight">
                                A <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:from-purple-400 group-hover:to-cyan-400">vibrant ecosystem</span> for future builders.
                            </h3>
                            <p className="text-lg text-slate-400 leading-relaxed">
                                The Institution's Innovation Council creates a dynamic platform for students to experiment, collaborate, and transform raw ideas into innovative solutions through rigorous workshops, high-stakes hackathons, and elite industry mentorship.
                            </p>

                            <TerminalWindow>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-green-400">$</span>
                                        <motion.span
                                            className="text-slate-300"
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            cat innovation_stats.txt
                                        </motion.span>
                                    </div>
                                    <motion.div
                                        className="text-cyan-400 pl-4"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ delay: 1 }}
                                    >
                                        Years: <CountUp to={5} suffix="+" /> | Students: <CountUp to={500} suffix="+" />
                                    </motion.div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-green-400">$</span>
                                        <motion.span
                                            className="text-slate-300 animate-pulse"
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            transition={{ delay: 1.5 }}
                                        >
                                            _
                                        </motion.span>
                                    </div>
                                </div>
                            </TerminalWindow>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-24 relative z-20">
                <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0b1021] to-[#020617] pointer-events-none" />
                <div className="container mx-auto px-6 max-w-7xl relative z-10">
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">

                        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                            <TiltCard>
                                <div className="group h-full p-10 rounded-[2rem] bg-[#0f172a]/50 backdrop-blur-2xl border border-white/10 hover:border-purple-500/50 shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_50px_rgba(124,58,237,0.3)] transition-all duration-500 overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-purple-500/40 transition-colors duration-500 pointer-events-none" />

                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mb-8 shadow-lg">
                                        <Target size={32} className="text-white" />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-purple-400 transition-colors flex items-center gap-2">
                                        <Braces size={28} className="text-purple-400" />
                                        Our Vision
                                    </h3>
                                    <p className="text-lg text-slate-400 leading-relaxed font-light">
                                        Build a deeply rooted culture of creativity, radical experimentation, and technological innovation across the institution.
                                    </p>

                                    <motion.div
                                        className="mt-6 font-mono text-xs text-purple-400/50"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        // Vision.init() → Success ✓
                                    </motion.div>
                                </div>
                            </TiltCard>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
                            <TiltCard>
                                <div className="group h-full p-10 rounded-[2rem] bg-[#0f172a]/50 backdrop-blur-2xl border border-white/10 hover:border-cyan-500/50 shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_50px_rgba(34,211,238,0.3)] transition-all duration-500 overflow-hidden relative">
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] -ml-32 -mb-32 group-hover:bg-cyan-500/40 transition-colors duration-500 pointer-events-none" />

                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-8 shadow-lg">
                                        <TrendingUp size={32} className="text-white" />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                                        <Zap size={28} className="text-cyan-400" />
                                        Our Mission
                                    </h3>
                                    <p className="text-lg text-slate-400 leading-relaxed font-light">
                                        Encourage students to intensely develop ideas, startups, and applied research solutions that actively solve real-world industry and societal challenges.
                                    </p>

                                    <motion.div
                                        className="mt-6 font-mono text-xs text-cyan-400/50"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        {"// Mission.execute() → Running..."}
                                    </motion.div>
                                </div>
                            </TiltCard>
                        </motion.div>

                    </div>
                </div>
            </section>

            <section className="py-32 relative z-20">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-20">
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-mono"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <GitBranch size={16} />
                            <span>innovation-pipeline</span>
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">The Innovation <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Pipeline</span></h2>
                        <p className="text-slate-400 text-lg font-mono">A structured ecosystem designed to accelerate growth.</p>
                    </div>

                    <div className="relative">
                        <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-1 bg-slate-800 -translate-y-1/2 z-0">
                            <motion.div
                                initial={{ width: "0%" }}
                                whileInView={{ width: "100%" }}
                                viewport={{ once: true }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                                className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 shadow-[0_0_15px_rgba(124,58,237,0.8)]"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                            {[
                                { title: "Idea Gen", icon: Lightbulb, color: "text-amber-400", border: "border-amber-400", code: "ideate()" },
                                { title: "Prototype", icon: Box, color: "text-cyan-400", border: "border-cyan-400", code: "build()" },
                                { title: "Mentorship", icon: Users, color: "text-purple-400", border: "border-purple-400", code: "learn()" },
                                { title: "Launch", icon: Rocket, color: "text-blue-400", border: "border-blue-400", code: "deploy()" }
                            ].map((stage, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.3 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className={`w-24 h-24 rounded-full bg-[#0a0f1e] border-2 ${stage.border} flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative group cursor-pointer`}>
                                        <div className={`absolute inset-0 rounded-full bg-current opacity-20 blur-xl group-hover:opacity-40 transition-opacity ${stage.color}`} />
                                        <stage.icon size={36} className={`${stage.color} relative z-10 group-hover:scale-110 transition-transform`} />
                                    </div>
                                    <h4 className="text-xl font-bold bg-[#020617] px-4 py-1 mb-2">{stage.title}</h4>
                                    <code className="text-xs text-slate-500 font-mono">{stage.code}</code>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 border-y border-white/5 bg-[#0f172a]/20 backdrop-blur-lg relative z-20">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
                        {[
                            { num: 150, label: "Active Members", color: "from-cyan-400 to-blue-500", icon: Users },
                            { num: 40, label: "Innovation Events", color: "from-purple-400 to-pink-500", icon: Trophy },
                            { num: 60, label: "Startup Ideas", color: "from-amber-400 to-orange-500", icon: Lightbulb },
                            { num: 20, label: "Prototypes Dev", color: "from-green-400 to-emerald-500", icon: FileCode }
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-white/20 transition-colors shadow-2xl group"
                            >
                                <stat.icon className={`w-10 h-10 mx-auto mb-4 text-transparent bg-clip-text bg-gradient-to-br ${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                                <h3 className={`text-5xl md:text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-br ${stat.color} drop-shadow-lg`}>
                                    <CountUp to={stat.num} />
                                </h3>
                                <p className="text-slate-400 uppercase tracking-widest text-sm font-semibold">{stat.label}</p>
                                <motion.div
                                    className="mt-3 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-50 transition-opacity"
                                    style={{ background: `linear-gradient(90deg, transparent, currentColor, transparent)` }}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-32 relative z-20 overflow-hidden">
                <div className="container mx-auto px-6 max-w-4xl relative">
                    <div className="text-center mb-20">
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full border border-green-500/30 bg-green-500/10 text-green-300 text-sm font-mono"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Terminal size={16} />
                            <span>git log --oneline</span>
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Journey of <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Excellence</span></h2>
                        <p className="text-slate-400">Milestones that define our legacy.</p>
                    </div>

                    <div className="relative border-l-2 border-slate-800 ml-4 md:ml-1/2">
                        <motion.div
                            className="absolute top-0 bottom-0 left-[-2px] w-1 bg-gradient-to-b from-cyan-500 via-purple-500 to-transparent origin-top"
                            initial={{ scaleY: 0 }}
                            whileInView={{ scaleY: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        />

                        {[
                            { year: "2021", title: "Establishment of IIC", desc: "Laid the foundation of the innovation cell with strong backing from the institution.", icon: GitBranch },
                            { year: "2022", title: "First Innovation Workshop", desc: "Hosted 500+ students in an interactive deep-tech IoT workshop.", icon: Code2 },
                            { year: "2023", title: "National Hackathon", desc: "Sent 5 teams to national finals, securing top 3 positions.", icon: Trophy },
                            { year: "2024", title: "Startup Incubator", desc: "Launched dedicated mentorship bringing 10 student startups to seed phase.", icon: Rocket },
                            { year: "2025", title: "Tech Showcase", desc: "Developed over 20+ working hardware/software prototypes for the showcase.", icon: FileCode }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="relative pl-12 pb-16 last:pb-0"
                            >
                                <div className="absolute left-[-9px] top-1 w-5 h-5 rounded-full bg-slate-900 border-2 border-cyan-500 shadow-[0_0_15px_#22d3ee] flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                                </div>
                                <div className="bg-[#0f172a]/80 backdrop-blur-md p-8 rounded-2xl border border-slate-700/50 hover:border-cyan-500/50 transition-colors shadow-xl group">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-cyan-400 font-mono font-bold text-xl">{item.year}</span>
                                        <item.icon className="text-purple-400 opacity-50 group-hover:opacity-100 transition-opacity" size={24} />
                                    </div>
                                    <h4 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">{item.title}</h4>
                                    <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                                    <motion.div
                                        className="mt-4 font-mono text-xs text-green-400/50"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        {"// commit hash: " + Math.random().toString(36).substr(2, 7)}
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-[#0a0f1e] relative z-20">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center mb-20">
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-mono"
                        >
                            <Users size={16} />
                            <span>team.json</span>
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Innovators</span></h2>
                        <p className="text-slate-400">Meet the leadership driving the vision forward.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {['President', 'Vice President', 'Tech Lead'].map((role, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.2 }}
                            >
                                <TiltCard>
                                    <div className="group relative bg-[#020617] border border-slate-700 rounded-[2rem] p-6 overflow-hidden text-center hover:border-blue-500/50 transition-colors">
                                        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-blue-500/20 to-transparent pointer-events-none" />

                                        <motion.div
                                            className="absolute top-4 right-4 font-mono text-xs text-slate-600"
                                            whileHover={{ color: '#22d3ee' }}
                                        >
                                            {"</>"}
                                        </motion.div>

                                        <div className="w-32 h-32 mx-auto rounded-full bg-slate-800 mb-6 border-4 border-[#0a0f1e] shadow-[0_0_20px_rgba(59,130,246,0.3)] overflow-hidden relative group-hover:scale-105 transition-transform duration-500">
                                            <div className="absolute inset-0 flex items-center justify-center text-slate-600"><Users size={32}/></div>
                                        </div>
                                        <h4 className="text-2xl font-bold text-white mb-1">John Doe</h4>
                                        <p className="text-blue-400 font-medium mb-2">{role}</p>
                                        <code className="text-xs text-slate-600 font-mono">console.log("innovate");</code>
                                        <div className="flex justify-center gap-4 mt-6">
                                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-colors"><FaLinkedinIn /></a>
                                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"><FaGithub /></a>
                                        </div>
                                    </div>
                                </TiltCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-32 relative z-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] to-[#020617] z-0" />

                <motion.div style={{ willChange: 'transform, opacity' }} animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600 rounded-full blur-[150px] opacity-30 mix-blend-screen pointer-events-none" />
                <motion.div style={{ willChange: 'transform, opacity' }} animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, delay: 1 }} className="absolute -bottom-20 left-1/4 w-[600px] h-[300px] bg-cyan-500 rounded-full blur-[120px] opacity-20 mix-blend-screen pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-white/5 backdrop-blur-3xl border border-white/10 p-12 md:p-20 rounded-[3rem] shadow-[0_0_50px_rgba(124,58,237,0.2)]"
                    >
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-green-500/30 bg-green-500/10 text-green-300 text-sm font-mono"
                            animate={{ boxShadow: ['0 0 0px rgba(16,185,129,0)', '0 0 20px rgba(16,185,129,0.5)', '0 0 0px rgba(16,185,129,0)'] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Terminal size={16} />
                            <span>npm start innovation</span>
                        </motion.div>

                        <Layers size={48} className="mx-auto text-purple-400 mb-8" />
                        <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                            Build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Future</span> With Us.
                        </h2>
                        <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                            We are building the next generation of deep-tech innovators, resilient entrepreneurs, and creative problem solvers.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_40px_rgba(124,58,237,0.8)] transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
                            >
                                Join The Movement <ArrowRight size={20} />
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto px-10 py-5 bg-transparent border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 rounded-full font-bold text-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
                            >
                                Submit Idea <Lightbulb size={20} />
                            </motion.button>
                        </div>

                        <motion.div
                            className="mt-12 font-mono text-xs text-slate-600"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            {"// innovation.then(success => console.log('🚀'))"}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

        </div>
    );
};

export default About;
