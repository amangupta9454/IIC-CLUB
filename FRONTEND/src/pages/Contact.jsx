import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Bot } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

// -------------------------------------------------------------------------------- //
// SHARED & REUSABLE COMPONENTS
// -------------------------------------------------------------------------------- //

const CODE_SNIPPETS = [
    'contact.init()',
    'await connection.establish()',
    'sys.log("User connected")',
    'fetch("/api/collaborate")',
    '{ status: 200, res: "Success" }'
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

    const background = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(124, 58, 237, 0.08), transparent 40%)`;

    return (
        <motion.div
            className="pointer-events-none fixed inset-0 z-[100] transition-opacity duration-300 mix-blend-screen"
            style={{ background, willChange: 'background' }}
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
    const bgGradient = useMotionTemplate`radial-gradient(800px circle at ${useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"])} ${useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"])}, rgba(59, 130, 246, 0.05), transparent 40%)`;

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
            <motion.div style={{ background: bgGradient }} className="absolute inset-0 z-0 pointer-events-none rounded-[2rem]" />
            <div style={{ transform: "translateZ(30px)" }} className="absolute inset-0 z-20 pointer-events-none rounded-[2rem] shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]"></div>
            <div style={{ transform: "translateZ(40px)" }} className="w-full h-full relative z-10 flex flex-col">
                {children}
            </div>
        </motion.div>
    );
};

const FloatingRobot = () => {
    const { scrollYProgress } = useScroll();
    
    // Robot scrolls down the page and rotates slightly
    const robotY = useTransform(scrollYProgress, [0, 1], ["0vh", "80vh"]);
    const robotRotate = useTransform(scrollYProgress, [0, 0.5, 1], [0, 15, -15]);
    const robotX = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], ["0px", "50px", "-50px", "0px"]);

    return (
        <motion.div
            className="fixed right-10 top-20 z-[90] pointer-events-none hidden xl:block"
            style={{ y: robotY, rotate: robotRotate, x: robotX, willChange: 'transform' }}
        >
            <motion.div 
                animate={{ y: [-15, 15, -15], rotate: [-2, 2, -2] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
            >
                {/* Robot body components */}
                <div className="w-20 h-20 bg-[#0f172a] rounded-3xl border border-cyan-500/50 shadow-[0_0_40px_rgba(34,211,238,0.2)] flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 mix-blend-overlay" />
                    
                    {/* Animated grid background inside robot */}
                    <motion.div 
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `linear-gradient(rgba(34, 211, 238, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.5) 1px, transparent 1px)`,
                            backgroundSize: '10px 10px',
                            willChange: 'transform'
                        }}
                        animate={{ y: [0, -10] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />

                    <Bot size={40} className="text-cyan-400 relative z-10 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                    
                    {/* Glowing eyes/indicators */}
                    <motion.div 
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }} 
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-red-400 shadow-[0_0_15px_rgba(248,113,113,1)] z-20"
                    />
                    <motion.div 
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }} 
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                        className="absolute top-4 left-4 w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,1)] z-20"
                    />
                </div>
                
                {/* Antenna */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-1.5 h-6 bg-slate-700/80 rounded-t-full">
                    <motion.div 
                        animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-3 -left-1.5 w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,1)]"
                    />
                </div>
                
                {/* Hover Rings */}
                <motion.div 
                    animate={{ rotateX: [60, 60], rotateZ: [0, 360], scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-cyan-500/20 shadow-[inset_0_0_20px_rgba(34,211,238,0.1)] pointer-events-none"
                    style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
                />

                {/* Thrust flame */}
                <motion.div 
                    animate={{ scaleY: [1, 1.8, 1], opacity: [0.5, 0.9, 0.5] }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-8 h-12 bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent rounded-full blur-md origin-top mix-blend-screen"
                    style={{ willChange: 'transform, opacity' }}
                />
            </motion.div>
        </motion.div>
    );
};

// -------------------------------------------------------------------------------- //
// MAIN CONTACT PAGE
// -------------------------------------------------------------------------------- //

const Contact = () => {
    const { scrollYProgress } = useScroll();
    const yHeroParallax = useTransform(scrollYProgress, [0, 1], [0, -300]);
    const opacityHeroText = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    const [formState, setFormState] = useState({
        name: '',
        email: '',
        phone: '',
        course: '',
        branch: '',
        year: '',
        section: '',
        reason: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

    const backgroundParticles = useMemo(() => {
        return [...Array(40)].map((_, i) => ({
            id: i,
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000) + 500,
            duration: Math.random() * 20 + 15,
            delay: Math.random() * 5,
            size: Math.random() * 3 + 1,
            colorOffset: i % 3,
            moveX: Math.random() * 200 - 100,
            opacityTarget: Math.random() * 0.8 + 0.2
        }));
    }, []);

    const heroCodeSnippets = useMemo(() => {
        return CODE_SNIPPETS.map((code, i) => ({
            id: i,
            text: code,
            duration: Math.random() * 10 + 15,
            delay: Math.random() * 5,
            left: Math.random() * 100,
            targetY: Math.random() * 80 + 10,
            targetX: Math.random() * 40 - 20,
        }));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);
        
        try {
            // Replace with actual Getform.io endpoint
            const formActionUrl = "https://getform.io/f/YOUR_ENDPOINT_ID_HERE"; 
            const formData = new FormData();
            Object.keys(formState).forEach(key => {
                formData.append(key, formState[key]);
            });

            // Fallback for demo purposes if endpoint isn't set
            if(formActionUrl.includes('YOUR_ENDPOINT_ID_HERE')) {
                await new Promise(r => setTimeout(r, 1500));
                setSubmitStatus('success');
                setIsSubmitting(false);
                setFormState({name:'', email:'', phone:'', course:'', branch:'', year:'', section:'', reason:'', message:''});
                return;
            }

            const response = await fetch(formActionUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    "Accept": "application/json",
                },
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormState({name:'', email:'', phone:'', course:'', branch:'', year:'', section:'', reason:'', message:''});
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error("Form submission error:", error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#020617] text-slate-200 font-sans overflow-hidden selection:bg-purple-500/30">
            <CursorGlow />
            <FloatingRobot />

            {/* Background Base & Deep Grid */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#020617]">
                
                {/* Deep Nebula Gradients */}
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.3, 0.1],
                        rotate: [0, 90, 0]
                    }} 
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-purple-900/30 blur-[120px] mix-blend-screen"
                    style={{ willChange: 'transform, opacity' }}
                />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.1, 0.2, 0.1],
                        rotate: [0, -90, 0]
                    }} 
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-cyan-900/30 blur-[120px] mix-blend-screen"
                    style={{ willChange: 'transform, opacity' }}
                />

                {/* Animated 3D Grid */}
                <div className="absolute inset-0 z-0 opacity-20 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
                    <motion.div
                        className="absolute inset-[-100%] h-[300%] w-[300%]"
                        style={{
                            backgroundImage: `linear-gradient(rgba(124, 58, 237, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(124, 58, 237, 0.3) 1px, transparent 1px)`,
                            backgroundSize: '80px 80px',
                            transformOrigin: 'center center',
                            willChange: 'transform'
                        }}
                        animate={{
                            transform: [
                                'perspective(1000px) rotateX(75deg) translateY(0px) translateZ(-200px)',
                                'perspective(1000px) rotateX(75deg) translateY(80px) translateZ(-200px)'
                            ]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </div>

                {/* Floating Particles Overlay */}
                <div className="absolute inset-0 z-10 opacity-30">
                    {backgroundParticles.map((particle) => (
                        <motion.div
                            key={particle.id}
                            className="absolute rounded-full"
                            style={{
                                width: particle.size,
                                height: particle.size,
                                backgroundColor: particle.colorOffset === 0 ? '#22d3ee' : particle.colorOffset === 1 ? '#a855f7' : '#10b981',
                                boxShadow: `0 0 10px ${particle.colorOffset === 0 ? '#22d3ee' : particle.colorOffset === 1 ? '#a855f7' : '#10b981'}`,
                                willChange: 'transform, opacity'
                            }}
                            initial={{
                                x: particle.x,
                                y: particle.y,
                                opacity: 0
                            }}
                            animate={{
                                y: [null, -200],
                                x: [null, `+=${particle.moveX}`],
                                opacity: [0, particle.opacityTarget, 0]
                            }}
                            transition={{
                                duration: particle.duration,
                                repeat: Infinity,
                                ease: "linear",
                                delay: particle.delay
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* SEC 1: Hero Section */}
            <section className="relative min-h-[70vh] flex flex-col items-center justify-center pt-32 pb-16 overflow-hidden z-10 border-b border-white/5">
                <motion.div style={{ y: yHeroParallax }} className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-[#0a0f1e]/80 to-[#020617] z-10" />
                    
                    {/* Glowing Orbs */}
                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[150px] opacity-20 mix-blend-screen" style={{ willChange: 'transform' }} />
                    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 10, repeat: Infinity, delay: 1 }} className="absolute bottom-[-100px] left-1/4 w-[600px] h-[400px] bg-cyan-500 rounded-full blur-[130px] opacity-20 mix-blend-screen" style={{ willChange: 'transform' }} />
                    
                    {/* Floating Code Snippets Hero */}
                    {heroCodeSnippets.map((snippet) => (
                         <motion.div
                            key={`hero-code-${snippet.id}`}
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ 
                                y: `${snippet.targetY}vh`, 
                                opacity: [0, 0.6, 0],
                                x: `${snippet.targetX}vw`
                            }}
                            transition={{ duration: snippet.duration, repeat: Infinity, delay: snippet.delay, ease: "linear" }}
                            className="absolute font-mono text-xs text-purple-400/40 z-0 whitespace-nowrap"
                            style={{ left: `${snippet.left}%`, willChange: 'transform, opacity' }}
                         >
                            {snippet.text}
                         </motion.div>
                    ))}
                </motion.div>

                <div className="relative z-20 text-center max-w-4xl px-6">
                    <motion.div 
                        style={{ opacity: opacityHeroText }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-mono tracking-widest uppercase"
                            animate={{ boxShadow: ['0 0 10px rgba(124,58,237,0.2)', '0 0 20px rgba(124,58,237,0.5)', '0 0 10px rgba(124,58,237,0.2)'] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Mail size={16} className="mr-1" />
                            Connection Protocol
                        </motion.div>
                        
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-200 to-purple-400 drop-shadow-[0_0_30px_rgba(124,58,237,0.3)] relative z-10">
                            Get In Touch With <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 relative inline-block">
                                IIC
                                <motion.span 
                                    className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                                    initial={{ scaleX: 0, opacity: 0 }}
                                    animate={{ scaleX: 1, opacity: 1 }}
                                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                    style={{ transformOrigin: "left" }}
                                />
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed overflow-hidden">
                            <motion.span
                                initial={{ y: "100%", opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                                className="inline-block"
                            >
                                Have questions, ideas, or collaboration opportunities? Connect with the Institution's Innovation Council team.
                            </motion.span>
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* SEC 2: Quick Contact Cards */}
            <section className="py-24 relative z-20">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1: Email */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <TiltCard>
                                <div className="group h-full bg-[#0a0f1e]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 hover:border-cyan-500/50 transition-all duration-300 shadow-2xl flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,211,238,0.2)] group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all duration-500">
                                        <Mail size={36} className="text-cyan-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Email Us</h3>
                                    <p className="text-slate-400 mb-8 flex-grow">iic@college.edu</p>
                                    <a href="mailto:iic@college.edu" className="inline-flex w-full items-center justify-center px-6 py-4 bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/50 rounded-xl text-cyan-400 font-semibold transition-all duration-300">
                                        Send Email
                                    </a>
                                </div>
                            </TiltCard>
                        </motion.div>

                        {/* Card 2: WhatsApp */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <TiltCard>
                                <div className="group h-full bg-[#0a0f1e]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 hover:border-green-500/50 transition-all duration-300 shadow-2xl flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)] group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all duration-500">
                                        <FaWhatsapp size={40} className="text-green-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">WhatsApp</h3>
                                    <p className="text-slate-400 mb-8 flex-grow">Chat instantly with the IIC team</p>
                                    <a href="https://wa.me/919560472926" target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center px-6 py-4 bg-white/5 hover:bg-green-500/10 border border-white/10 hover:border-green-500/50 rounded-xl text-green-400 font-semibold transition-all duration-300">
                                        Start Chat
                                    </a>
                                </div>
                            </TiltCard>
                        </motion.div>

                        {/* Card 3: Call */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <TiltCard>
                                <div className="group h-full bg-[#0a0f1e]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 hover:border-purple-500/50 transition-all duration-300 shadow-2xl flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-fuchsia-600/20 border border-purple-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,85,247,0.2)] group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all duration-500">
                                        <Phone size={36} className="text-purple-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Call Us</h3>
                                    <p className="text-slate-400 mb-8 flex-grow">+91 XXXXX XXXXX</p>
                                    <a href="tel:+910000000000" className="inline-flex w-full items-center justify-center px-6 py-4 bg-white/5 hover:bg-purple-500/10 border border-white/10 hover:border-purple-500/50 rounded-xl text-purple-400 font-semibold transition-all duration-300">
                                        Call Now
                                    </a>
                                </div>
                            </TiltCard>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* SEC 3: Interactive Contact Form */}
            <section className="py-24 border-y border-white/5 bg-[#0f172a]/30 relative z-20">
                <div className="container mx-auto px-6 max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="bg-[#020617]/60 backdrop-blur-2xl border border-slate-700/50 rounded-[3rem] p-8 md:p-14 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                            {/* Decorative Form Backgrounds */}
                            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-purple-900/10 via-transparent to-cyan-900/10 pointer-events-none" />
                            <div className="absolute -top-32 -left-32 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />
                            
                            <div className="flex flex-col items-center mb-12 text-center relative z-10">
                                <h2 className="text-4xl font-bold text-white mb-4">Transmit a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Message</span></h2>
                                <p className="text-slate-400">Drop your details and we will initialize contact sequences shortly.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div className="group relative z-10">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-100 transition duration-500 blur pointer-events-none"></div>
                                        <input 
                                            type="text" 
                                            name="name"
                                            value={formState.name}
                                            onChange={handleInputChange}
                                            required
                                            className="relative w-full bg-[#0a0f1e]/80 backdrop-blur-md border border-slate-700/50 rounded-xl px-4 pt-6 pb-2 text-white placeholder-transparent focus:border-cyan-400 focus:ring-0 transition-all outline-none peer shadow-inner"
                                            placeholder="Name"
                                        />
                                        <label className="absolute left-4 top-2 text-xs font-semibold text-cyan-500 uppercase tracking-wider transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-cyan-400 cursor-text pointer-events-none z-10">
                                            Full Name
                                        </label>
                                    </div>
                                    
                                    {/* Email */}
                                    <div className="group relative z-10">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-100 transition duration-500 blur pointer-events-none"></div>
                                        <input 
                                            type="email" 
                                            name="email"
                                            value={formState.email}
                                            onChange={handleInputChange}
                                            required
                                            className="relative w-full bg-[#0a0f1e]/80 backdrop-blur-md border border-slate-700/50 rounded-xl px-4 pt-6 pb-2 text-white placeholder-transparent focus:border-cyan-400 focus:ring-0 transition-all outline-none peer shadow-inner"
                                            placeholder="Email"
                                        />
                                        <label className="absolute left-4 top-2 text-xs font-semibold text-cyan-500 uppercase tracking-wider transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-cyan-400 cursor-text pointer-events-none z-10">
                                            Email Address
                                        </label>
                                    </div>

                                    {/* Mobile Number */}
                                    <div className="group relative z-10">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-100 transition duration-500 blur pointer-events-none"></div>
                                        <input 
                                            type="tel" 
                                            name="phone"
                                            value={formState.phone}
                                            onChange={handleInputChange}
                                            required
                                            className="relative w-full bg-[#0a0f1e]/80 backdrop-blur-md border border-slate-700/50 rounded-xl px-4 pt-6 pb-2 text-white placeholder-transparent focus:border-purple-400 focus:ring-0 transition-all outline-none peer shadow-inner"
                                            placeholder="Mobile Number"
                                        />
                                        <label className="absolute left-4 top-2 text-xs font-semibold text-purple-500 uppercase tracking-wider transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-400 cursor-text pointer-events-none z-10">
                                            Mobile Number
                                        </label>
                                    </div>

                                    {/* Course Select */}
                                    <div className="group relative">
                                        <select 
                                            name="course"
                                            value={formState.course}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-[#0a0f1e]/50 border border-slate-700 rounded-xl px-4 pt-6 pb-2 text-white focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled className="text-slate-500"></option>
                                            <option value="B.Tech">B.Tech</option>
                                            <option value="BCA">BCA</option>
                                            <option value="MCA">MCA</option>
                                            <option value="MBA">MBA</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <label className="absolute left-4 top-2 text-xs font-semibold text-purple-500 uppercase tracking-wider transition-all">
                                            Select Course
                                        </label>
                                        <div className="absolute right-4 top-1/2 mt-1 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-t-slate-400 border-l-transparent border-r-transparent"></div>
                                    </div>

                                    {/* Branch Select */}
                                    <div className="group relative">
                                        <select 
                                            name="branch"
                                            value={formState.branch}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-[#0a0f1e]/50 border border-slate-700 rounded-xl px-4 pt-6 pb-2 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled></option>
                                            <option value="CSE">CSE</option>
                                            <option value="IT">IT</option>
                                            <option value="ECE">ECE</option>
                                            <option value="Mechanical">Mechanical</option>
                                            <option value="Civil">Civil</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <label className="absolute left-4 top-2 text-xs font-semibold text-blue-500 uppercase tracking-wider transition-all">
                                            Select Branch
                                        </label>
                                        <div className="absolute right-4 top-1/2 mt-1 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-t-slate-400 border-l-transparent border-r-transparent"></div>
                                    </div>

                                    {/* Year Select */}
                                    <div className="group relative">
                                        <select 
                                            name="year"
                                            value={formState.year}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-[#0a0f1e]/50 border border-slate-700 rounded-xl px-4 pt-6 pb-2 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled></option>
                                            <option value="1st Year">1st Year</option>
                                            <option value="2nd Year">2nd Year</option>
                                            <option value="3rd Year">3rd Year</option>
                                            <option value="4th Year">4th Year</option>
                                        </select>
                                        <label className="absolute left-4 top-2 text-xs font-semibold text-blue-500 uppercase tracking-wider transition-all">
                                            Select Year
                                        </label>
                                        <div className="absolute right-4 top-1/2 mt-1 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-t-slate-400 border-l-transparent border-r-transparent"></div>
                                    </div>

                                    {/* Section Select */}
                                    <div className="group relative">
                                        <select 
                                            name="section"
                                            value={formState.section}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-[#0a0f1e]/50 border border-slate-700 rounded-xl px-4 pt-6 pb-2 text-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled></option>
                                            <option value="A">A</option>
                                            <option value="B">B</option>
                                            <option value="C">C</option>
                                            <option value="D">D</option>
                                        </select>
                                        <label className="absolute left-4 top-2 text-xs font-semibold text-emerald-500 uppercase tracking-wider transition-all">
                                            Select Section
                                        </label>
                                        <div className="absolute right-4 top-1/2 mt-1 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-t-slate-400 border-l-transparent border-r-transparent"></div>
                                    </div>

                                    {/* Reason Select */}
                                    <div className="group relative">
                                        <select 
                                            name="reason"
                                            value={formState.reason}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-[#0a0f1e]/50 border border-slate-700 rounded-xl px-4 pt-6 pb-2 text-white focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled></option>
                                            <option value="General Inquiry">General Inquiry</option>
                                            <option value="Event Registration">Event Registration</option>
                                            <option value="Innovation Idea">Innovation Idea</option>
                                            <option value="Collaboration">Collaboration</option>
                                            <option value="Technical Support">Technical Support</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <label className="absolute left-4 top-2 text-xs font-semibold text-emerald-500 uppercase tracking-wider transition-all">
                                            Reason to Contact
                                        </label>
                                        <div className="absolute right-4 top-1/2 mt-1 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-t-slate-400 border-l-transparent border-r-transparent"></div>
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="group relative z-10">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-100 transition duration-500 blur pointer-events-none"></div>
                                    <textarea 
                                        name="message"
                                        value={formState.message}
                                        onChange={handleInputChange}
                                        required
                                        rows="4"
                                        className="relative w-full bg-[#0a0f1e]/80 backdrop-blur-md border border-slate-700/50 rounded-xl px-4 pt-8 pb-4 text-white placeholder-transparent focus:border-cyan-400 focus:ring-0 transition-all outline-none peer resize-none shadow-inner"
                                        placeholder="Message Details"
                                    ></textarea>
                                    <label className="absolute left-4 top-3 text-xs font-semibold text-cyan-500 uppercase tracking-wider transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-5 peer-placeholder-shown:text-slate-400 peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-400 cursor-text pointer-events-none z-10">
                                        Message Details / Idea Description
                                    </label>
                                </div>

                                {/* Form Status Messages */}
                                <AnimatePresence>
                                    {submitStatus === 'success' && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }} 
                                            animate={{ opacity: 1, height: 'auto' }} 
                                            exit={{ opacity: 0, height: 0 }}
                                            className="p-4 bg-green-500/10 border border-green-500/50 rounded-xl flex items-center gap-3 text-green-400"
                                        >
                                            <CheckCircle size={20} />
                                            <p className="font-medium">Your message has been sent successfully. Our team will contact you soon.</p>
                                        </motion.div>
                                    )}
                                    {submitStatus === 'error' && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }} 
                                            animate={{ opacity: 1, height: 'auto' }} 
                                            exit={{ opacity: 0, height: 0 }}
                                            className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400"
                                        >
                                            <AlertCircle size={20} />
                                            <p className="font-medium">Transmission failed. Please try again or use direct email.</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Submit Button */}
                                <div className="text-center pt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="relative group overflow-hidden px-10 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {isSubmitting ? (
                                                <>
                                                    <span className="animate-pulse">Transmitting...</span>
                                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Bot size={20} /></motion.div>
                                                </>
                                            ) : (
                                                <>
                                                    Initialize Transmission <Send size={20} />
                                                </>
                                            )}
                                        </span>
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* SEC 4: Google Map Section */}
            <section className="py-32 relative z-20">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center mb-16">
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-mono"
                            animate={{ y: [-5, 5, -5] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <MapPin size={16} className="text-blue-400" />
                            <span>Location Data</span>
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-bold">Find Us On <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Map</span></h2>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="relative group"
                    >
                        {/* Glowing Map Container */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 rounded-[2.5rem] blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                        
                        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-700/50 shadow-2xl h-[400px] md:h-[500px] w-full group-hover:scale-[1.01] transition-transform duration-500">
                            {/* NOTE: Replace the src below with your actual Google Maps Embed URL */}
                            <iframe 
                                title="Institution Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112001.371302831!2d77.106822291583!3d28.685366406214533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d03b7454807cf%3A0xe1043361e646276b!2sDelhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(80%) contrast(120%)' }} // Custom dark mode filter for map
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                            
                            {/* Overlay to enforce glass/dark theme feeling over the map on hover */}
                            <div className="absolute inset-0 bg-blue-500/10 pointer-events-none mix-blend-overlay group-hover:bg-transparent transition-colors duration-500"></div>
                        </div>
                    </motion.div>
                </div>
            </section>

        </div>
    );
};

export default Contact;