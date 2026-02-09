import { Link } from "react-router-dom";

// ... existing imports

const LandingPage = () => {
  return (
    <div className="min-h-screen text-gray-900 overflow-x-hidden relative bg-gray-50">
      <Header />

      {/* ===== HERO SECTION (UPDATED) ===== */}
      <section className="relative flex flex-col md:flex-row items-center justify-center min-h-screen py-28 md:py-32 w-full overflow-hidden bg-gray-50">

        {/* ... (background orbs code unchanged) ... */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-400 opacity-20 blur-3xl animate-blob-pulse-1 pointer-events-none"></div>
        <div className="absolute top-1/4 right-1/4 w-80 h-80 translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-400 opacity-20 blur-3xl animate-blob-pulse-2 pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 -translate-x-1/2 translate-y-1/2 rounded-full bg-emerald-400 opacity-20 blur-3xl animate-blob-pulse-3 pointer-events-none"></div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl mx-auto px-4 md:px-8 space-y-20 md:space-y-0 md:space-x-16">

          {/* Left Side - Hero Text */}
          <div className="md:w-1/2 text-center md:text-left space-y-8 flex flex-col items-center md:items-start">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-3xl lg:text-7xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-500 via-emerald-500 to-rose-400 drop-shadow-lg"
            >
              Career Compass
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl md:text-3xl font-light text-gray-800"
            >
              Your GPS to Career Success
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl leading-relaxed max-w-lg text-gray-700"
            >
              Discover your strengths, plan your learning journey, and grow into your dream career with **AI-driven guidance, gamified tasks, and actionable insights.**
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row lg:space-x-6 gap-4 md:gap-6 max-w-lg justify-center md:justify-start"
            >
              <div className="flex items-center space-x-2 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                <span className="text-emerald-400 text-3xl">🎯</span>
                <span className="text-gray-700 text-base font-medium">Personalized Roadmaps</span>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                <span className="text-rose-400 text-3xl">📈</span>
                <span className="text-gray-700 text-base font-medium">Track Progress</span>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                <span className="text-cyan-400 text-3xl">🤝</span>
                <span className="text-gray-700 text-base font-medium">Mentorship & Guidance</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-emerald-400 to-rose-400 text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-center">
                Get Started
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 rounded-full border border-gray-300 text-gray-700 font-semibold text-lg hover:bg-gray-100 transition-all duration-300">
                Learn More
              </button>
            </motion.div>
          </div>

          {/* Right Side - Framer Motion Animation */}
          <div className="relative md:w-1/2 flex justify-center items-center h-96 w-full max-w-md md:max-w-none">
            <motion.svg
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="w-full h-full max-w-lg md:max-w-xl opacity-80"
              viewBox="0 0 512 512"
            >
              {/* Main Spinning Rings */}
              <motion.circle
                cx="256"
                cy="256"
                r="250"
                stroke="#00a896"
                strokeWidth="4"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
              <motion.circle
                cx="256"
                cy="256"
                r="200"
                stroke="#f08080"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3.5, ease: "easeInOut" }}
              />
              <motion.circle
                cx="256"
                cy="256"
                r="150"
                stroke="#9370db"
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 4, ease: "easeInOut" }}
              />

              {/* Outer Pulsing Effect */}
              <motion.path
                d="M256 10 L256 502"
                stroke="#fff"
                strokeWidth="6"
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.svg>

            {/* Central Pulsing Compass */}
            <motion.div
              className="absolute z-10 w-full max-w-md flex justify-center items-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="gradient-path-fm" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00a896" />
                    <stop offset="100%" stopColor="#f08080" />
                  </linearGradient>
                </defs>
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#gradient-path-fm)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="15"
                  stroke="url(#gradient-path-fm)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.8, ease: "easeInOut" }}
                />
                <circle cx="50" cy="50" r="5" fill="#00a896" />
              </svg>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="w-full text-center py-24 bg-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-teal-700 tracking-wide md:tracking-widest">HOW IT WORKS</h2>
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 px-4 md:px-12">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.6, type: "spring" }}
              className="flex flex-col items-center flex-1 min-w-[250px] max-w-[300px] p-8 rounded-3xl border border-gray-200 bg-white shadow-sm hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-24 h-24 flex items-center justify-center rounded-full text-4xl mb-6 bg-teal-50 bg-opacity-80">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">{step.title}</h3>
              <p className="text-base text-gray-600 leading-relaxed max-w-xs">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="w-full py-24 bg-gray-100">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-teal-700 tracking-wide md:tracking-widest text-center">WHAT OUR USERS SAY</h2>
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 px-4 md:px-12">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.6, type: "spring" }}
              className="flex flex-col items-center flex-1 min-w-[250px] max-w-[300px] p-6 md:p-8 rounded-3xl border border-gray-200 bg-white shadow-sm hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              <img src={t.avatar} alt={t.name} className="w-20 h-20 rounded-full mb-4 shadow-md border-2 border-white" />
              <p className="text-gray-700 text-base italic mb-4 text-center leading-relaxed">"{t.feedback}"</p>
              <div className="text-center mt-auto">
                <h4 className="text-teal-700 font-bold text-lg">{t.name}</h4>
                <span className="text-gray-500 text-sm font-medium">{t.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FUTURE SCOPE ===== */}
      <section className="w-full text-center py-24 bg-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-teal-700 tracking-wide md:tracking-widest">FUTURE SCOPE</h2>
        <div className="w-full px-4 sm:px-8 md:px-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-items-center">
          {futureScopes.map((scope, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: idx * 0.1, duration: 0.6, type: "spring" }}
              className="flex flex-col items-center max-w-[220px] p-6 rounded-3xl border border-gray-200 bg-white shadow-sm hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-20 h-20 flex items-center justify-center rounded-2xl text-4xl mb-4 bg-rose-50 bg-opacity-80">
                {scope.icon}
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 text-lg md:text-xl">{scope.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed text-center">{scope.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <Footer />
    </div>
  );
};

export default LandingPage;