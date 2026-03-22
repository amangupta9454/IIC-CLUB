import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  AnimatePresence,
} from 'framer-motion';
import {
  X, Users, Mail, Code2, Lightbulb, Rocket,
  Shield, Terminal, Globe, Cpu, Layers, Zap, GitBranch, Star,
  ChevronRight,
} from 'lucide-react';
import { FaLinkedinIn } from 'react-icons/fa';

/* ──────────────────────────────────────────
   CURSOR GLOW  (GPU: opacity + background)
─────────────────────────────────────────── */
const CursorGlow = () => {
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  useEffect(() => {
    const h = (e) => { mx.set(e.clientX); my.set(e.clientY); };
    window.addEventListener('mousemove', h, { passive: true });
    return () => window.removeEventListener('mousemove', h);
  }, [mx, my]);
  const bg = useMotionTemplate`radial-gradient(550px circle at ${mx}px ${my}px, rgba(34,211,238,0.06), transparent 40%)`;
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[99] mix-blend-screen"
      style={{ background: bg, willChange: 'background' }}
    />
  );
};

/* ──────────────────────────────────────────
   PARTICLES  (fewer, GPU-only)
─────────────────────────────────────────── */
const PARTICLE_DATA = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  w: Math.random() * 2.5 + 1,
  x: Math.random() * 1400,
  y: Math.random() * 900 + 600,
  dx: Math.random() * 160 - 80,
  dur: Math.random() * 18 + 14,
  delay: Math.random() * 6,
  color: i % 3 === 0 ? '#22d3ee' : i % 3 === 1 ? '#a855f7' : '#10b981',
}));

const Particles = () => (
  <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden opacity-20">
    {PARTICLE_DATA.map((p) => (
      <motion.div
        key={p.id}
        className="absolute rounded-full"
        style={{
          width: p.w,
          height: p.w,
          backgroundColor: p.color,
          boxShadow: `0 0 6px ${p.color}`,
          willChange: 'transform, opacity',
        }}
        initial={{ x: p.x, y: p.y, opacity: 0 }}
        animate={{ y: -80, x: p.x + p.dx, opacity: [0, 0.8, 0] }}
        transition={{ duration: p.dur, repeat: Infinity, ease: 'linear', delay: p.delay }}
      />
    ))}
  </div>
);

/* ──────────────────────────────────────────
   3-D TILT CARD  (GPU: rotateX/rotateY)
─────────────────────────────────────────── */
const TiltCard = ({ children, className = '' }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xS = useSpring(x, { stiffness: 180, damping: 22, mass: 0.6 });
  const yS = useSpring(y, { stiffness: 180, damping: 22, mass: 0.6 });
  const rotX = useTransform(yS, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotY = useTransform(xS, [-0.5, 0.5], ['-8deg', '8deg']);

  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', willChange: 'transform' }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
};

/* ──────────────────────────────────────────
   TEAM DATA
─────────────────────────────────────────── */
const TEAM = [
  {
    id: 1, name: 'Aarav Sharma', designation: 'President',
    color: 'from-cyan-500 to-blue-600', glow: 'rgba(34,211,238,0.35)',
    borderGlow: '#22d3ee', icon: Star, badge: 'LEAD',
    linkedin: '#', email: 'aarav@iic.edu',
    skills: ['Leadership', 'Full-Stack', 'AI Research'],
    description: `Aarav is the visionary President of IIC, driving a culture of radical innovation and entrepreneurship across the institution. With a background in full-stack development and AI research, he has spearheaded 3 national-level hackathon campaigns and personally mentored over 20 student-led startups.

His leadership philosophy centers around "build fast, learn faster" — encouraging every member to prototype their ideas within IIC's dedicated lab spaces. Under his tenure, IIC achieved a record-breaking rating of 4.7 by DST, Ministry of Education.

He holds a B.Tech in Computer Science and is an alumnus of IIT Bombay's innovation program. Off campus, Aarav is a TEDx speaker and open-source contributor with 1,200+ GitHub stars on his research projects.`,
  },
  {
    id: 2, name: 'Priya Nair', designation: 'Vice President',
    color: 'from-purple-500 to-pink-600', glow: 'rgba(168,85,247,0.35)',
    borderGlow: '#a855f7', icon: Layers, badge: 'VP',
    linkedin: '#', email: 'priya@iic.edu',
    skills: ['Product Management', 'UX Design', 'Design Thinking'],
    description: `Priya serves as Vice President, orchestrating cross-functional teams and ensuring IIC's programs are executed with precision and creativity. Her expertise in product management and UI/UX design has redefined how the club communicates its events and initiatives.

She pioneered the IIC Design Sprints — weekly ideation sessions that have produced 12 student-design patents in under two years. Priya is also a certified Google UX Designer and leads workshops on human-centered design thinking.

An avid speaker, Priya has represented IIC at Smart India Hackathon, NASSCOM FutureSkills, and multiple state-level innovation summits. She advocates strongly for diversity in STEM and co-leads IIC's WomenInTech initiative.`,
  },
  {
    id: 3, name: 'Rohan Mehta', designation: 'Tech Lead',
    color: 'from-green-500 to-emerald-600', glow: 'rgba(16,185,129,0.35)',
    borderGlow: '#10b981', icon: Code2, badge: 'DEV',
    linkedin: '#', email: 'rohan@iic.edu',
    skills: ['Backend', 'Cloud (AWS/GCP)', 'ML Pipelines'],
    description: `Rohan is IIC's Tech Lead, the engineering backbone behind every platform, tool, and technical initiative the club runs. His expertise spans backend architecture, cloud infrastructure (AWS, GCP), and machine learning pipelines.

He architected IIC's internal project management portal used by 150+ members and integrated it with an AI recommendation engine that matches students to relevant innovation challenges. Rohan has 3+ years of open-source experience.

Beyond code, Rohan mentors junior developers in IIC's TechBridge program, transforming first-year students into production-ready engineers through guided sprints and code reviews.`,
  },
  {
    id: 4, name: 'Sneha Iyer', designation: 'Research Head',
    color: 'from-amber-500 to-orange-500', glow: 'rgba(245,158,11,0.35)',
    borderGlow: '#f59e0b', icon: Lightbulb, badge: 'R&D',
    linkedin: '#', email: 'sneha@iic.edu',
    skills: ['Biomedical Eng.', 'IoT Systems', 'IEEE Publications'],
    description: `Sneha spearheads IIC's research vertical, bridging the gap between academic theory and real-world application. Her domain expertise lies in biomedical engineering and IoT systems, with published research in IEEE Xplore and Springer's innovation journals.

She has guided 5 research groups to national recognition, including a project on low-cost water purification using smart sensors that won the MHRD Innovation Challenge 2024. Sneha also maintains strong collaborations with faculty advisors and industry research labs.

A recipient of the DST Women in Science fellowship, Sneha is passionate about making research accessible and publishing-friendly for undergraduate students who are new to the academic ecosystem.`,
  },
  {
    id: 5, name: 'Karan Verma', designation: 'Event Manager',
    color: 'from-rose-500 to-red-600', glow: 'rgba(244,63,94,0.35)',
    borderGlow: '#f43f5e', icon: Rocket, badge: 'OPS',
    linkedin: '#', email: 'karan@iic.edu',
    skills: ['Operations', 'Sponsorships', 'Project Management'],
    description: `Karan is the engine behind IIC's events — from intimate tech talks with 50 attendees to large-scale hackathons with 1,500+ participants. His operational excellence ensures every event runs like a well-oiled machine, from logistics and sponsorships to participant coordination and media coverage.

In the past year alone, he has orchestrated 8 major events, securing partnerships with Microsoft, Google Developer Groups (GDG), and three leading EdTech firms. Karan's negotiation skills have brought in ₹18 lakhs in total sponsorship funding for IIC initiatives.

He holds a PMP certification and is currently building a systematic event management SOP that will serve as the gold standard for student clubs across the university.`,
  },
  {
    id: 6, name: 'Ananya Krishnan', designation: 'Creative Director',
    color: 'from-fuchsia-500 to-violet-600', glow: 'rgba(217,70,239,0.35)',
    borderGlow: '#d946ef', icon: Globe, badge: 'DESIGN',
    linkedin: '#', email: 'ananya@iic.edu',
    skills: ['Motion Design', 'Brand Identity', 'Figma / Blender'],
    description: `Ananya brings IIC's brand to life through stunning visual communication, motion design, and digital storytelling. As Creative Director, she oversees all marketing collateral, social media presence, and the club's visual identity system.

Under her leadership, IIC's Instagram grew from 400 to 8,000 followers in 18 months, with post engagement rates 5× higher than the industry average for student organizations. She has built a team of 10 designers who operate under a comprehensive brand guideline she authored from scratch.

Ananya is a self-taught motion designer with expertise in Adobe After Effects, Figma, and Blender 3D. She dreams of merging generative AI with creative design to build automated, personalized brand experiences.`,
  },
  {
    id: 7, name: 'Dev Patel', designation: 'Startup Mentor',
    color: 'from-sky-500 to-indigo-600', glow: 'rgba(14,165,233,0.35)',
    borderGlow: '#0ea5e9', icon: Cpu, badge: 'MENTOR',
    linkedin: '#', email: 'dev@iic.edu',
    skills: ['Startup Strategy', 'MVPs', 'Angel Networks'],
    description: `Dev is IIC's resident Startup Mentor, having founded and exited two ventures before returning to guide the next wave of student entrepreneurs. His SaaS startup in 2021 was acquired within 14 months, and his EdTech venture onboarded 3,000 users in its pilot semester.

Within IIC, Dev runs fortnightly "Founder's Fireside" sessions where student teams present their MVPs and receive structured, actionable feedback. He has mentored 15 teams to successfully pitch in front of angel investors and IIC's internal seed fund panel.

He is deeply embedded in the startup ecosystem, maintaining active connections with 40+ VCs, angel networks, and accelerator programs like Y Combinator's SAFE network and Sequoia Spark.`,
  },
  {
    id: 8, name: 'Meera Joshi', designation: 'Community Lead',
    color: 'from-teal-500 to-cyan-600', glow: 'rgba(20,184,166,0.35)',
    borderGlow: '#14b8a6', icon: Users, badge: 'COMM',
    linkedin: '#', email: 'meera@iic.edu',
    skills: ['Community Building', 'Alumni Relations', 'Onboarding'],
    description: `Meera is the heartbeat of IIC's community — fostering a culture of belonging, learning, and mutual growth among 150+ active members. As Community Lead, she manages member onboarding, peer programs, alumni mentoring pipelines, and internal communications.

She launched the "IIC Buddy System," a pairing program for first-year students that has improved retention rates by 60%. Meera also maintains IIC's alumni network of 200+ graduates, regularly organizing reunion panels and career guidance sessions.

A natural connector, Meera has a gift for identifying talent and aligning individuals to opportunities that maximize their potential. She volunteers with 2 NGOs focused on digital literacy in rural Maharashtra.`,
  },
  {
    id: 9, name: 'Arjun Das', designation: 'Hardware Lead',
    color: 'from-orange-500 to-yellow-500', glow: 'rgba(249,115,22,0.35)',
    borderGlow: '#f97316', icon: Zap, badge: 'HW',
    linkedin: '#', email: 'arjun@iic.edu',
    skills: ['Arduino / FPGA', 'PCB Design', '3D Printing'],
    description: `Arjun leads IIC's hardware and embedded systems division, turning digital concepts into tangible prototypes. His background spans Arduino, Raspberry Pi, FPGA design, and PCB fabrication. He manages IIC's hardware lab — a 1,200 sq. ft. maker space equipped with 3D printers, laser cutters, and oscilloscopes.

His flagship project, a smart campus energy monitoring system using LoRa and edge ML, was adopted by the college administration and reduced building energy waste by 23%. Arjun has filed 2 utility patents for IoT-based environmental monitoring devices.

He regularly conducts "Solder Sundays" — open lab days where any student can walk in and learn hardware prototyping from scratch under expert guidance.`,
  },
  {
    id: 10, name: 'Ishaan Gupta', designation: 'AI / ML Lead',
    color: 'from-violet-500 to-purple-700', glow: 'rgba(139,92,246,0.35)',
    borderGlow: '#8b5cf6', icon: Terminal, badge: 'AI',
    linkedin: '#', email: 'ishaan@iic.edu',
    skills: ['Deep Learning', 'Computer Vision', 'NLP'],
    description: `Ishaan drives IIC's artificial intelligence and machine learning projects, leading a team of 12 developers who build cutting-edge solutions for student-innovation challenges. His expertise spans deep learning, computer vision, NLP, and reinforcement learning.

He developed an automated plagiarism-checker for student project submissions that achieved 96.8% F1-score, now used institution-wide. Ishaan has also co-authored two conference papers accepted at ICML and ACL workshops.

Beyond projects, Ishaan runs monthly ML reading groups where members dissect recent papers from NeurIPS, CVPR, and ICLR. He is a Kaggle Grandmaster and maintains an open-source ML toolkit with 2,800+ stars.`,
  },
  {
    id: 11, name: 'Tanvi Saxena', designation: 'Finance & Grants',
    color: 'from-lime-500 to-green-600', glow: 'rgba(132,204,22,0.35)',
    borderGlow: '#84cc16', icon: Shield, badge: 'FIN',
    linkedin: '#', email: 'tanvi@iic.edu',
    skills: ['Grant Applications', 'Budget Planning', 'CFA L1'],
    description: `Tanvi manages IIC's financial health, grant applications, and budget allocation with the precision of a seasoned CFO. She has successfully secured 7 government grants totaling ₹24 lakhs, including funding from DST NIMAT, AICTE IDEA Lab, and state innovation councils.

Her meticulous financial planning ensures IIC events never run over budget, and surplus funds are channeled into new member resources and lab equipment. Tanvi also teaches a popular workshop on "Innovation Funding 101" that demystifies government grants for students.

A Chartered Financial Analyst (CFA) Level 1 candidate, Tanvi brings professional-grade rigor to every rupee IIC manages, making the club one of the best-funded student organizations in the university system.`,
  },
  {
    id: 12, name: 'Vikram Singh', designation: 'Outreach & PR',
    color: 'from-blue-500 to-sky-400', glow: 'rgba(59,130,246,0.35)',
    borderGlow: '#3b82f6', icon: GitBranch, badge: 'PR',
    linkedin: '#', email: 'vikram@iic.edu',
    skills: ['Partnerships', 'Media Relations', 'Digital Marketing'],
    description: `Vikram spearheads IIC's external partnerships, media relations, and institutional outreach. He has forged MOUs with 15 companies including IBM, Infosys, and three funded startups, bringing real-world project opportunities directly to IIC members.

His PR campaigns have earned IIC coverage in The Times of India, YourStory, and multiple regional tech blogs, putting the club on the national innovation map. He also manages IIC's official newsletter with 2,000+ subscribers and an average 42% open rate.

Vikram is a certified Digital Marketing professional (Google & HubSpot) and leverages data-driven strategies to continuously grow IIC's brand authority. He believes strong storytelling is the most underrated tool in any innovator's arsenal.`,
  },
];

/* ──────────────────────────────────────────
   TEAM CARD
─────────────────────────────────────────── */
const TeamCard = ({ member, index, onClick }) => {
  const Icon = member.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 48, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.09, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <TiltCard className="h-full">
        <div
          className="group relative h-full flex flex-col items-center text-center cursor-pointer rounded-[1.75rem] overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(15,23,42,0.92) 0%, rgba(9,14,31,0.96) 100%)',
            border: `1px solid rgba(255,255,255,0.08)`,
            boxShadow: hovered
              ? `0 0 0 1px ${member.borderGlow}55, 0 20px 60px -12px ${member.glow}, 0 4px 24px rgba(0,0,0,0.6)`
              : '0 4px 24px rgba(0,0,0,0.5)',
            transition: 'box-shadow 0.4s ease',
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => onClick(member)}
        >
          {/* Shine sweep on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)',
              backgroundSize: '200% 100%',
              willChange: 'background-position',
            }}
            animate={{ backgroundPosition: hovered ? ['200% 0', '-10% 0'] : '200% 0' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          />

          {/* Top gradient strip */}
          <div
            className="absolute top-0 inset-x-0 h-1 rounded-t-[1.75rem]"
            style={{
              background: `linear-gradient(90deg, transparent, ${member.borderGlow}, transparent)`,
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.35s ease',
            }}
          />

          {/* Top ambient glow */}
          <div
            className="absolute inset-x-0 top-0 h-40 pointer-events-none rounded-t-[1.75rem]"
            style={{
              background: `radial-gradient(ellipse at 50% -10%, ${member.glow}, transparent 65%)`,
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.45s ease',
            }}
          />

          {/* Badge */}
          <span
            className="absolute top-4 right-4 text-[9px] font-black font-mono px-2.5 py-1 rounded-full text-white tracking-widest z-20"
            style={{ background: `linear-gradient(135deg, ${member.borderGlow}cc, ${member.borderGlow}66)`, letterSpacing: '0.12em' }}
          >
            {member.badge}
          </span>

          {/* Avatar area */}
          <div className="relative mt-9 mb-4">
            {/* Pulsing outer ring */}
            <motion.div
              className="absolute inset-[-8px] rounded-full"
              style={{
                border: `1px solid ${member.borderGlow}`,
                willChange: 'transform, opacity',
              }}
              animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Spinning dashed ring */}
            <motion.div
              className="absolute inset-[-3px] rounded-full"
              style={{
                border: `1.5px dashed ${member.borderGlow}55`,
                willChange: 'transform',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />
            {/* Avatar circle */}
            <div
              className="w-[108px] h-[108px] rounded-full flex items-center justify-center relative z-10"
              style={{
                background: `linear-gradient(135deg, ${member.borderGlow}33 0%, rgba(9,14,31,0.95) 60%)`,
                border: `2px solid ${member.borderGlow}66`,
                boxShadow: `inset 0 0 24px ${member.glow}`,
              }}
            >
              {/* Scanline shimmer inside avatar */}
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
                style={{ opacity: 0.15 }}
              >
                <motion.div
                  className="w-full h-[2px] bg-white"
                  style={{ willChange: 'transform' }}
                  animate={{ y: [-10, 116, -10] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                />
              </motion.div>
              <Icon size={38} className="text-white relative z-10" style={{ filter: `drop-shadow(0 0 8px ${member.borderGlow})` }} />
            </div>
          </div>

          {/* Name & designation */}
          <h3
            className="text-[1.05rem] font-extrabold text-white px-4 leading-tight mb-1"
            style={{ textShadow: hovered ? `0 0 20px ${member.borderGlow}88` : 'none', transition: 'text-shadow 0.4s' }}
          >
            {member.name}
          </h3>
          <span
            className="text-xs font-semibold mb-3 px-3 py-0.5 rounded-full"
            style={{
              background: `${member.borderGlow}18`,
              color: member.borderGlow,
              border: `1px solid ${member.borderGlow}44`,
            }}
          >
            {member.designation}
          </span>

          {/* Skills chips */}
          <div className="flex flex-wrap justify-center gap-1.5 px-4 mb-5">
            {member.skills.slice(0, 2).map((s) => (
              <span key={s} className="text-[10px] font-medium text-slate-400 bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5">
                {s}
              </span>
            ))}
          </div>

          {/* LinkedIn */}
          <div className="flex gap-2 mt-auto mb-4" onClick={(e) => e.stopPropagation()}>
            <a
              href={member.linkedin}
              className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full text-blue-300 border border-blue-500/25 bg-blue-500/10 hover:bg-blue-500/25 transition-colors"
            >
              <FaLinkedinIn size={11} /> LinkedIn
            </a>
          </div>

          {/* View Details button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            className="relative mx-4 mb-5 w-[calc(100%-2rem)] py-2.5 rounded-full text-sm font-bold text-white overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${member.borderGlow}cc, ${member.borderGlow}66)`,
              boxShadow: hovered ? `0 0 18px ${member.glow}` : 'none',
              transition: 'box-shadow 0.35s',
              willChange: 'transform',
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              View Details <ChevronRight size={14} />
            </span>
          </motion.button>

          {/* Bottom glow line */}
          <div
            className="absolute bottom-0 inset-x-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${member.borderGlow}, transparent)`,
              opacity: hovered ? 0.9 : 0,
              transition: 'opacity 0.4s',
            }}
          />
        </div>
      </TiltCard>
    </motion.div>
  );
};

/* ──────────────────────────────────────────
   DETAIL MODAL
─────────────────────────────────────────── */
const DetailModal = ({ member, onClose }) => {
  const Icon = member.icon;
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', h);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const paragraphs = member.description.trim().split(/\n\n+/);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/75 backdrop-blur-lg"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Panel */}
      <motion.div
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] p-8 md:p-10"
        style={{
          background: 'linear-gradient(160deg, rgba(11,17,33,0.98) 0%, rgba(9,14,28,0.99) 100%)',
          border: `1px solid ${member.borderGlow}44`,
          boxShadow: `0 0 0 1px ${member.borderGlow}22, 0 40px 100px -20px rgba(0,0,0,0.9), 0 0 60px -10px ${member.glow}`,
          willChange: 'transform, opacity',
        }}
        initial={{ scale: 0.88, opacity: 0, y: 32 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 32 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
      >
        {/* Top ambient glow */}
        <div
          className="absolute inset-x-0 top-0 h-48 rounded-t-[2rem] pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% -15%, ${member.glow}, transparent 65%)` }}
        />
        {/* Top border highlight */}
        <div
          className="absolute top-0 inset-x-8 h-[1px] rounded-full pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent, ${member.borderGlow}, transparent)` }}
        />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors z-30"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-7 relative z-10">
          <div
            className="w-[88px] h-[88px] rounded-full flex-shrink-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${member.borderGlow}44, rgba(9,14,31,0.9) 60%)`,
              border: `2px solid ${member.borderGlow}88`,
              boxShadow: `0 0 30px ${member.glow}`,
            }}
          >
            <Icon size={32} className="text-white" style={{ filter: `drop-shadow(0 0 10px ${member.borderGlow})` }} />
          </div>
          <div className="text-center sm:text-left">
            <span
              className="text-[10px] font-black font-mono px-3 py-1 rounded-full text-white mb-2 inline-block tracking-widest"
              style={{ background: `linear-gradient(135deg, ${member.borderGlow}cc, ${member.borderGlow}55)` }}
            >
              {member.badge}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">{member.name}</h2>
            <p className="text-sm font-semibold mt-0.5" style={{ color: member.borderGlow }}>{member.designation}</p>
          </div>
        </div>

        {/* Skills row */}
        <div className="flex flex-wrap gap-2 mb-6 relative z-10">
          {member.skills.map((s) => (
            <span
              key={s}
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{
                background: `${member.borderGlow}18`,
                color: member.borderGlow,
                border: `1px solid ${member.borderGlow}44`,
              }}
            >
              {s}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div
          className="h-px rounded-full mb-6 relative z-10"
          style={{ background: `linear-gradient(90deg, transparent, ${member.borderGlow}66, transparent)` }}
        />

        {/* Bio paragraphs */}
        <div className="relative z-10 space-y-4">
          {paragraphs.map((para, i) => (
            <p key={i} className="text-slate-300 leading-relaxed text-[14.5px]">
              {para.trim()}
            </p>
          ))}
        </div>

        {/* Contact footer */}
        <div
          className="mt-8 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Mail size={14} style={{ color: member.borderGlow }} />
            <span className="font-mono text-[13px]">{member.email}</span>
          </div>
          <a
            href={member.linkedin}
            className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold text-white transition-all"
            style={{
              background: `linear-gradient(135deg, ${member.borderGlow}cc, ${member.borderGlow}66)`,
              boxShadow: `0 0 14px ${member.glow}`,
            }}
          >
            <FaLinkedinIn size={13} /> Connect on LinkedIn
          </a>
        </div>

        {/* Footer mono tag */}
        <p className="mt-5 text-center font-mono text-[11px] text-slate-600 relative z-10">
          {'// member.profile.load() → 200 OK'}
        </p>
      </motion.div>
    </motion.div>
  );
};

/* ──────────────────────────────────────────
   MAIN PAGE
─────────────────────────────────────────── */
const Teams = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="bg-[#020617] min-h-screen text-slate-200 font-sans overflow-x-hidden selection:bg-cyan-500/30">
      <CursorGlow />
      <Particles />

      {/* Subtle dot-grid */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(34,211,238,0.18) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          opacity: 0.035,
        }}
      />

      {/* Static ambient orbs (no animation = zero repaint) */}
      <div className="pointer-events-none fixed top-[-80px] left-[10%] w-[500px] h-[500px] bg-purple-700 rounded-full blur-[180px] opacity-[0.07]" />
      <div className="pointer-events-none fixed top-[20%] right-[5%] w-[380px] h-[380px] bg-cyan-600 rounded-full blur-[160px] opacity-[0.06]" />
      <div className="pointer-events-none fixed bottom-[5%] left-[30%] w-[450px] h-[250px] bg-blue-700 rounded-full blur-[150px] opacity-[0.06]" />

      {/* ── HERO ── */}
      <section className="relative z-10 pt-36 pb-16 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: -24, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Pill badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 mb-7 rounded-full text-sm font-mono text-blue-300"
            style={{ border: '1px solid rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.08)' }}
            animate={{ boxShadow: ['0 0 0px rgba(59,130,246,0)', '0 0 28px rgba(59,130,246,0.4)', '0 0 0px rgba(59,130,246,0)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Users size={14} className="animate-pulse" />
            <span>team.json — 12 records</span>
          </motion.div>

          <h1 className="text-5xl md:text-[5.5rem] font-black tracking-tight leading-[1.05] mb-6">
            <span className="text-white">Meet The </span>
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #22d3ee 0%, #60a5fa 50%, #a78bfa 100%)' }}
            >
              Innovators
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The passionate minds behind IIC — builders, researchers, designers, and dreamers shaping the future of technology.
          </p>

          {/* Stats strip */}
          <div className="mt-10 inline-flex items-center gap-6 sm:gap-10 px-8 py-4 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {[['12', 'Core Members'], ['5+', 'Domains'], ['50+', 'Projects']].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-black text-white">{num}</div>
                <div className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── CARDS GRID ── */}
      <section className="relative z-10 pb-28 px-5 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {TEAM.map((member, i) => (
            <TeamCard key={member.id} member={member} index={i} onClick={setSelected} />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 pb-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto text-center p-12 md:p-16 rounded-[2.5rem]"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 0 60px rgba(124,58,237,0.12)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Decorative top line */}
          <div className="absolute top-0 inset-x-20 h-px rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.7), transparent)' }} />

          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full text-green-300 text-sm font-mono"
            style={{ border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.08)' }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <Terminal size={13} /> npm run join-iic
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Want to join the team?
          </h2>
          <p className="text-slate-400 mb-9 text-lg max-w-xl mx-auto">
            We're always looking for passionate innovators. Apply to be part of IIC and help shape the next wave of technology.
          </p>
          <motion.a
            href="/contact"
            whileHover={{ scale: 1.04, boxShadow: '0 0 50px rgba(34,211,238,0.5)' }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-white text-base"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              boxShadow: '0 0 24px rgba(34,211,238,0.3)',
              willChange: 'transform',
            }}
          >
            <Rocket size={18} /> Apply Now <ChevronRight size={16} />
          </motion.a>
        </motion.div>
      </section>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {selected && <DetailModal member={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default Teams;