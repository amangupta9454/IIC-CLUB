import React, { useState, useEffect, useCallback } from 'react'
import { Menu, X, LogIn, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  // Throttled scroll handler for 60fps
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), [])
  const closeMenu = useCallback(() => setIsOpen(false), [])

  const logos = [
    { src: '/iic.png', alt: 'IIC' },
    { src: '/hiet.png', alt: 'HIET' },
    { src: '/sunstone.jpg', alt: 'Sunstone' },
    { src: '/aktu.png', alt: 'AKTU' },
    { src: '/ccs.png', alt: 'CSS' },
    { src: '/bte.png', alt: 'BTE' },
  ]

  const navLinks = ['Home', 'About', 'Team', 'Contact']
  const routes = {
    'Home': '/home',
    'About': '/about',
    'Team': '/teams',
    'Contact': '/contact',

  }

  const handleLinkClick = useCallback((e, link) => {
    e.preventDefault()
    setActiveLink(link.toLowerCase())
    closeMenu()
    if (routes[link]) {
      navigate(routes[link])
    } else {
      window.location.hash = link.toLowerCase()
    }
  }, [navigate, closeMenu])

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    closeMenu()
    navigate('/')
  }, [navigate, closeMenu])

  const handleDashboardClick = useCallback(() => {
    closeMenu()
    let user = {}
    try {
      const userStr = localStorage.getItem('user')
      if (userStr && userStr !== 'undefined') user = JSON.parse(userStr)
    } catch (e) {}
    if (user.role === 'admin') navigate('/admin/dashboard')
    else navigate('/dashboard')
  }, [navigate, closeMenu])

  const handleLoginClick = useCallback((role) => {
    closeMenu()
    if (role === 'admin') navigate('/admin/login')
    else navigate('/login')
  }, [navigate, closeMenu])

  const token = localStorage.getItem('token')
  let userRole;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== 'undefined') userRole = JSON.parse(userStr)?.role;
  } catch (e) {}

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 will-change-transform transition-[background,box-shadow] duration-500 backdrop-blur-xl border-b border-white/8 ${scrolled
            ? 'bg-[#020617]/80 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
            : 'bg-[#020617]/40'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* Logo Section */}
            <div className="flex gap-3 sm:gap-4 lg:gap-5 items-center">
              {logos.map((logo, index) => (
                <div
                  key={logo.alt}
                  className="relative rounded-xl shadow-lg"
                  style={{
                    animation: `fadeInScaleSmooth 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.08}s both`,
                    willChange: 'transform',
                  }}
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    loading="lazy"
                    className="h-11 w-11 sm:h-13 sm:w-13 lg:h-14 lg:w-14 object-contain bg-white rounded-xl p-1.5 transition-transform duration-300 hover:scale-110 hover:shadow-[0_0_18px_rgba(255,255,255,0.5)] cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* Hamburger Button */}
            <button
              onClick={toggleMenu}
              className="relative p-3 rounded-xl bg-gradient-to-br from-blue-500/70 to-purple-600/70 hover:from-blue-400/90 hover:to-purple-500/90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-95 border border-white/15"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <Menu
                  size={22}
                  className={`absolute text-white transition-all duration-500 ${isOpen ? 'rotate-90 opacity-0 scale-0' : 'rotate-0 opacity-100 scale-100'
                    }`}
                />
                <X
                  size={22}
                  className={`absolute text-white transition-all duration-500 ${isOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-0'
                    }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
        style={{ background: 'rgba(2,6,23,0.65)', backdropFilter: 'blur(4px)' }}
        onClick={closeMenu}
      />

      {/* Slide-Out Menu */}
      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-[340px] z-50 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        style={{ willChange: 'transform' }}
      >
        {/* Glass panel */}
        <div className="h-full flex flex-col bg-[#0a0f1e]/95 backdrop-blur-3xl border-l border-white/8 shadow-[-20px_0_60px_rgba(0,0,0,0.5)]">

          {/* Panel Header */}
          <div className="flex items-center justify-between px-7 py-5 border-b border-white/6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <Zap size={15} className="text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-bold leading-none">IIC Innovate</p>
                <p className="text-gray-500 text-[10px] mt-0.5">HIET Ghaziabad</p>
              </div>
            </div>
            <button
              onClick={closeMenu}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/8 transition-all duration-200 active:scale-90"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav Links */}
          <div className="flex-1 overflow-y-auto py-6 px-6">
            <p className="text-gray-600 text-[10px] font-semibold uppercase tracking-widest mb-3 ml-1">Navigation</p>
            <div className="space-y-1.5">
              {navLinks.map((link, index) => {
                const isActive = activeLink === link.toLowerCase()
                return (
                  <a
                    key={link}
                    href={routes[link] || `#${link.toLowerCase()}`}
                    onClick={e => handleLinkClick(e, link)}
                    className={`group relative flex items-center justify-between py-3.5 px-4 rounded-2xl text-base font-semibold transition-all duration-300 border overflow-hidden ${isActive
                        ? 'bg-gradient-to-r from-blue-500/25 to-purple-500/20 text-white border-blue-400/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                        : 'text-gray-300 hover:text-white hover:bg-white/6 border-white/6 hover:border-purple-400/20'
                      }`}
                    style={{
                      animation: isOpen
                        ? `slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.07}s both`
                        : 'none',
                      willChange: isOpen ? 'transform, opacity' : 'auto',
                    }}
                  >
                    {/* Active glow bg */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none" />
                    )}
                    {/* Active left bar */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full" />
                    )}
                    <span className="relative z-10">{link}</span>
                    <span className={`relative z-10 text-lg transition-all duration-300 ${isActive ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-60'
                      }`}>
                      →
                    </span>
                  </a>
                )
              })}

              {/* Divider */}
              <div className="flex items-center gap-3 py-3">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="text-gray-700 text-[10px] font-medium">PORTAL</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>

              {token ? (
                <>
                  {/* Dashboard Button */}
                  <button
                    onClick={handleDashboardClick}
                    className="group w-full relative flex items-center justify-between py-3.5 px-4 rounded-2xl font-semibold transition-all duration-300 overflow-hidden border border-blue-500/40 hover:border-blue-400/70 mb-2"
                    style={{
                      background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(124,58,237,0.1))',
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/20 group-hover:to-purple-600/15 transition-all duration-400 pointer-events-none" />
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-[inset_0_0_20px_rgba(59,130,246,0.15)]" />

                    <div className="relative z-10 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-[0_0_14px_rgba(59,130,246,0.5)] transition-shadow duration-300">
                        <Zap size={15} className="text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-white text-sm font-bold leading-none">{userRole === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}</p>
                      </div>
                    </div>
                    <span className="relative z-10 text-blue-400 group-hover:text-blue-300 transition-all duration-300 group-hover:translate-x-1">→</span>
                  </button>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="group w-full relative flex items-center justify-between py-3.5 px-4 rounded-2xl font-semibold transition-all duration-300 overflow-hidden border border-red-500/40 hover:border-red-400/70"
                    style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(185,28,28,0.1))' }}
                  >
                    <div className="relative z-10 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                        <X size={15} className="text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-white text-sm font-bold leading-none">Logout</p>
                      </div>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  {/* Student Login */}
                  <button
                    onClick={() => handleLoginClick('student')}
                    className="group w-full relative flex items-center justify-between py-3.5 px-4 rounded-2xl font-semibold transition-all duration-300 overflow-hidden border border-purple-500/40 hover:border-purple-400/70 mb-2"
                    style={{
                      animation: isOpen ? `slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${navLinks.length * 0.07 + 0.08}s both` : 'none',
                      background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(59,130,246,0.1))',
                      willChange: isOpen ? 'transform, opacity' : 'auto',
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/20 group-hover:to-blue-600/15 transition-all duration-400 pointer-events-none" />
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-[inset_0_0_20px_rgba(124,58,237,0.15)]" />

                    <div className="relative z-10 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-[0_0_14px_rgba(124,58,237,0.5)] transition-shadow duration-300">
                        <LogIn size={15} className="text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-white text-sm font-bold leading-none">Student Login</p>
                        <p className="text-purple-400/80 text-[10px] mt-0.5">Access your dashboard</p>
                      </div>
                    </div>
                    <span className="relative z-10 text-purple-400 group-hover:text-purple-300 transition-all duration-300 group-hover:translate-x-1">→</span>
                  </button>

                  {/* Admin Login */}
                  <button
                    onClick={() => handleLoginClick('admin')}
                    className="group w-full relative flex items-center justify-between py-3.5 px-4 rounded-2xl font-semibold transition-all duration-300 overflow-hidden border border-slate-500/40 hover:border-slate-400/70"
                    style={{
                      animation: isOpen ? `slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${navLinks.length * 0.07 + 0.12}s both` : 'none',
                      background: 'linear-gradient(135deg, rgba(71,85,105,0.15), rgba(30,41,59,0.1))',
                      willChange: isOpen ? 'transform, opacity' : 'auto',
                    }}
                  >
                    <div className="relative z-10 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center shadow-md">
                        <LogIn size={15} className="text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-white text-sm font-bold leading-none">Admin Login</p>
                        <p className="text-slate-400/80 text-[10px] mt-0.5">Faculty dashboard</p>
                      </div>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-5 border-t border-white/6">
            <div className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-400/8 to-purple-400/8 rounded-xl border border-white/6">
              <span className="text-purple-400 text-xs">✦</span>
              <p className="text-gray-400 text-xs font-medium">Innovate • Create • Inspire</p>
              <span className="text-blue-400 text-xs">✦</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
                @keyframes fadeInScaleSmooth {
                    from { opacity: 0; transform: scale(0.85) translateY(-10px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(30px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
            `}</style>
    </>
  )
}

export default Navbar