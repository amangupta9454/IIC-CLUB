import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight,
  Sparkles,
  Send
} from 'lucide-react';
import { 
  FaLinkedinIn, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube, 
  FaGithub 
} from 'react-icons/fa';

const MagneticSocialIcon = ({ Icon, href }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        setPosition({ 
            x: (clientX - centerX) * 0.3, 
            y: (clientY - centerY) * 0.3 
        });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.a
            href={href}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-10 h-10 rounded-full bg-[#0f172a] border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-colors duration-300 relative z-20"
        >
            <Icon className="w-4 h-4" />
        </motion.a>
    );
};

const FloatingParticles = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                    initial={{
                        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                        y: Math.random() * 500 + 500,
                        opacity: Math.random() * 0.5 + 0.1,
                        scale: Math.random() * 1.5 + 0.5
                    }}
                    animate={{
                        y: [null, Math.random() * -500 - 100],
                        opacity: [null, 0],
                        x: [null, `+=${Math.random() * 100 - 50}`]
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    );
};

const Footer = () => {
    const { scrollYProgress } = useScroll();
    const yTransform = useTransform(scrollYProgress, [0, 1], [0, -150]);
    const springY = useSpring(yTransform, { stiffness: 60, damping: 20 });

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if(email) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    const socialLinks = [
        { icon: FaLinkedinIn, href: '#' },
        { icon: FaInstagram, href: '#' },
        { icon: FaTwitter, href: '#' },
        { icon: FaYoutube, href: '#' },
        { icon: FaGithub, href: '#' }
    ];

    const quickLinks = ['Home', 'About', 'What We Do', 'Events', 'Team', 'Contact'];
    const resources = ['Innovation Projects', 'Startup Ideas', 'Workshops', 'Hackathons', 'Gallery'];

    return (
        <footer className="relative bg-[#020617] text-white overflow-hidden pt-36 pb-8 border-t-2 border-[#1e293b] shadow-[0_-20px_50px_rgba(2,6,23,0.8)]">
            
            <FloatingParticles />

            {/* Parallax Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                    style={{ y: springY }}
                    className="absolute top-[5%] left-[5%] w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px]"
                />
                <motion.div 
                    style={{ y: springY }}
                    className="absolute top-[30%] right-[5%] w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[150px]"
                />
                <motion.div 
                    style={{ y: springY }}
                    className="absolute bottom-[10%] left-[20%] w-[350px] h-[350px] bg-blue-600/15 rounded-full blur-[100px]"
                />
                 <motion.div 
                    style={{ y: springY, x: springY }}
                    className="absolute top-[50%] left-[50%] w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[90px] -translate-x-1/2 -translate-y-1/2"
                />
            </div>

            {/* Glowing Cursor Follower */}
            <div 
                className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(34, 211, 238, 0.04), transparent 40%)`,
                    opacity: 1
                }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
                
                {/* 1. Top CTA Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                    className="relative rounded-[2rem] p-[2px] bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 mb-20 group overflow-hidden shadow-[0_0_40px_rgba(34,211,238,0.2)] hover:shadow-[0_0_80px_rgba(124,58,237,0.4)] transition-shadow duration-700"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 blur-2xl opacity-40 group-hover:opacity-80 transition-opacity duration-700"></div>
                    
                    <div className="relative bg-[#050b1a]/95 backdrop-blur-3xl rounded-[2rem] p-10 md:p-16 text-center md:flex md:items-center md:justify-between space-y-8 md:space-y-0 shadow-2xl overflow-hidden border border-white/5">
                        
                        {/* Interactive floating particles inside CTA */}
                        <motion.div 
                            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-12 left-12 text-cyan-400 opacity-60 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                        >
                            <Sparkles size={28} />
                        </motion.div>
                        <motion.div 
                            animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute bottom-12 right-12 text-purple-400 opacity-60 drop-shadow-[0_0_15px_rgba(124,58,237,0.8)]"
                        >
                            <Sparkles size={36} />
                        </motion.div>

                        <div className="text-left md:w-3/5 z-10">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                                Join the Innovation Movement
                            </h2>
                            <p className="text-gray-400 text-lg">
                                Be a part of the Institution’s Innovation Council and turn your ideas into impactful solutions.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-end md:w-2/5 z-10">
                            <motion.button 
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-full shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] transition-all duration-300 transform hover:-translate-y-1"
                            >
                                Join IIC
                            </motion.button>
                            <motion.button 
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-transparent border border-gray-600 hover:border-cyan-400 text-white font-semibold rounded-full hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:text-cyan-400 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                Submit Idea
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* 2. Main Grid Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 relative z-20">
                    
                    {/* Column 1: About */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            IIC
                        </h3>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            The Institution’s Innovation Council promotes innovation, entrepreneurship, and creative problem-solving among students through events, hackathons, and collaborative projects.
                        </p>
                    </motion.div>

                    {/* Column 2: Quick Links */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            {quickLinks.map((link, idx) => (
                                <li key={idx}>
                                    <a href="#" className="group flex items-center text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                                        <span className="relative overflow-hidden">
                                            {link}
                                            <span className="absolute left-0 bottom-0 w-full h-[1px] bg-cyan-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Column 3: Resources */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h4 className="text-lg font-semibold text-white mb-6">Resources</h4>
                        <ul className="space-y-4">
                            {resources.map((resource, idx) => (
                                <li key={idx}>
                                    <a href="#" className="group flex items-center text-gray-400 hover:text-purple-400 transition-colors duration-300">
                                        <ArrowRight className="w-4 h-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-purple-400" />
                                        <span className="transform group-hover:translate-x-1 transition-transform duration-300">{resource}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Column 4: Contact & Newsletter */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <h4 className="text-lg font-semibold text-white mb-6">Contact Us</h4>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start text-gray-400 group">
                                <Mail className="w-5 h-5 mr-3 mt-0.5 text-gray-500 group-hover:text-cyan-400 transition-colors duration-300" />
                                <span className="group-hover:text-gray-200 transition-colors">iic@college.edu</span>
                            </li>
                            <li className="flex items-start text-gray-400 group">
                                <Phone className="w-5 h-5 mr-3 mt-0.5 text-gray-500 group-hover:text-cyan-400 transition-colors duration-300" />
                                <span className="group-hover:text-gray-200 transition-colors">+91 XXXXX XXXXX</span>
                            </li>
                            <li className="flex items-start text-gray-400 group">
                                <MapPin className="w-5 h-5 mr-3 mt-0.5 text-gray-500 group-hover:text-cyan-400 transition-colors duration-300" />
                                <span className="group-hover:text-gray-200 transition-colors">HIET Ghaziabad<br/>Uttar Pradesh, India</span>
                            </li>
                        </ul>

                        {/* 4. Newsletter */}
                        <form onSubmit={handleSubscribe} className="relative mt-6 group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
                            <div className="relative flex rounded-lg overflow-hidden bg-[#0f172a] border border-gray-700 focus-within:border-cyan-400 transition-colors duration-300">
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email" 
                                    className="w-full bg-transparent text-white px-4 py-3 outline-none placeholder-gray-500"
                                    required
                                />
                                <motion.button 
                                    whileTap={{ scale: 0.95 }}
                                    type="submit" 
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 text-white flex items-center justify-center hover:from-purple-500 hover:to-blue-500 transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </motion.button>
                            </div>
                            {subscribed && (
                                <motion.p 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-cyan-400 mt-2 text-sm absolute"
                                >
                                    Successfully subscribed!
                                </motion.p>
                            )}
                        </form>
                    </motion.div>
                </div>

                {/* 5. Footer Bottom Section */}
                <div className="pt-8 border-t border-[#1e293b] flex flex-col md:flex-row justify-between items-center gap-6 relative z-20">
                    
                    {/* Socials */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: false }}
                        className="flex space-x-4"
                    >
                        {socialLinks.map((social, idx) => (
                            <MagneticSocialIcon key={idx} Icon={social.icon} href={social.href} />
                        ))}
                    </motion.div>

                    {/* Copyright */}
                    <div className="text-gray-500 text-sm md:text-right text-center">
                        <p>© {new Date().getFullYear()} Institution’s Innovation Council | All Rights Reserved</p>
                        <p className="mt-1">
                            Designed & Developed by <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-medium cursor-pointer hover:opacity-80 transition-opacity">IIC Tech Team</span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;