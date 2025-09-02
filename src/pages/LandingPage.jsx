import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FileSpreadsheet, BarChart3, Shield, Menu, X, Rocket, Zap, Cloud, Mail, User, Linkedin, Github } from "lucide-react";

export default function LandingPage() {
  const [showContact, setShowContact] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-black dark:via-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 flex flex-col overflow-hidden">

      {/* Animated Background Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-400/20 rounded-full filter blur-3xl animate-blob-slow"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-400/20 rounded-full filter blur-3xl animate-blob-slow animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-400/10 rounded-full filter blur-2xl animate-blob-slow animation-delay-4000"></div>

      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/30 dark:bg-gray-900/30 border-b border-gray-200 dark:border-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white grid place-items-center shadow-lg transform hover:scale-110 transition">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold truncate">Excellytics</h1>
          </div>

          {/*desktop-nav*/}
          <nav className="hidden sm:flex items-center gap-8 text-sm text-gray-300">
            <a href="#features" className="hover:text-purple-400 transition cursor-pointer">Features</a>
         
            <button
              onClick={() => setShowContact(true)}
              className="hover:text-purple-400 transition cursor-pointer"
            >
              Contact
            </button>
           
          </nav>

          {/* Mobile hamburger */}
          <div className="sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-md">
            <div className="flex flex-col px-4 py-2 gap-2">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-indigo-500 transition cursor-pointer"
              >
                Features
              </a>
              <button
                onClick={() => {
                  setShowContact(true);
                  setMobileMenuOpen(false);
                }}
                className="hover:text-indigo-500 transition cursor-pointer text-left"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-between max-w-7xl w-full mx-auto px-6 pt-36 md:pt-40 pb-20 gap-12 overflow-hidden">
        <div className="max-w-xl space-y-6 relative z-10">
          <h2 className="text-5xl sm:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 animate-text-glow">
            Upload • Explore • Visualize
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Transform your spreadsheets into beautiful interactive dashboards.
            With <span className="font-semibold text-indigo-600 dark:text-indigo-400">Excellytics</span>, your data tells the story.
          </p>
          <div className="flex gap-4 mt-6 flex-wrap">
            <Link
              to="/signup"
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white shadow-lg hover:shadow-2xl hover:bg-purple-800 transition transform hover:-translate-y-1 cursor-pointer"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="relative z-10 flex justify-center w-full md:w-auto">
          <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl p-10 shadow-2xl transform hover:scale-105 transition">
            <BarChart3 className="w-40 h-40 text-indigo-600 dark:text-indigo-400 mx-auto animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[{
            icon: <FileSpreadsheet size={32} className="text-indigo-600" />,
            title: "Excel Uploads",
            desc: "Easily upload your spreadsheets and start analyzing instantly.",
          },{
            icon: <BarChart3 size={32} className="text-indigo-600" />,
            title: "Interactive Charts",
            desc: "Visualize your data with dynamic charts and graphs.",
          },{
            icon: <Shield size={32} className="text-indigo-600" />,
            title: "Secure & Reliable",
            desc: "Your data stays safe with robust privacy protection.",
          },{
            icon: <BarChart3 size={32} className="text-purple-600" />,
            title: "AI-Powered Insights",
            desc: "Let AI highlight patterns, anomalies, and key trends in your data.",
          },{
            icon: <FileSpreadsheet size={32} className="text-green-600" />,
            title: "Collaboration Tools",
            desc: "Share analytics and dashboards with your team in one click.",
          },{
            icon: <FileSpreadsheet size={32} className="text-pink-600" />,
            title: "Export & Reporting",
            desc: "Export insights as PDF, Excel, or CSV for presentations and records.",
          }].map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 backdrop-blur p-6 shadow-md text-center transform hover:scale-105 transition cursor-pointer"
            >
              <div className="flex justify-center mb-4">{f.icon}</div>
              <h4 className="text-lg font-semibold mb-2">{f.title}</h4>
              <p className="text-gray-600 dark:text-gray-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-sm text-gray-500 dark:text-gray-400 mt-auto relative z-10">
        © {new Date().getFullYear()} Excellytics · Built with React · Tailwind · Recharts
      </footer>

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 sm:px-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
            <button
              onClick={() => setShowContact(false)}
              className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-500 cursor-pointer"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-2 text-center text-indigo-600 dark:text-indigo-400">
              📬 Contact Me
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
              Let’s connect for projects, collaborations, or opportunities!
            </p>

             <div className="space-y-4">
  <div className="flex items-center gap-4 bg-gray-800/50 rounded-xl p-4 transition-all duration-300 hover:ring-2 hover:ring-purple-500/50">
    <User className="w-6 h-6 text-purple-400" />
    <div className="flex flex-col">
      <span className="text-gray-300 font-medium">Rehan Maniyar</span>
      <span className="text-xs text-gray-500">Creator</span>
    </div>
  </div>

  <div className="flex items-center gap-4 bg-gray-800/50 rounded-xl p-4 transition-all duration-300 hover:ring-2 hover:ring-purple-500/50">
    <Mail className="w-6 h-6 text-pink-400" />
    <a href="mailto:rehanmaniyar0205@gmail.com" className="text-gray-400 hover:text-purple-400 transition underline-offset-4 hover:underline">
      rehanmaniyar0205@gmail.com
    </a>
  </div>

  <div className="flex items-center gap-4 bg-gray-800/50 rounded-xl p-4 transition-all duration-300 hover:ring-2 hover:ring-purple-500/50">
    <Linkedin className="w-6 h-6 text-blue-400" />
    <a href="https://linkedin.com/in/rehan-maniyar" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition underline-offset-4 hover:underline">
      rehan-maniyar
    </a>
  </div>

  <div className="flex items-center gap-4 bg-gray-800/50 rounded-xl p-4 transition-all duration-300 hover:ring-2 hover:ring-purple-500/50">
    <Github className="w-6 h-6 text-gray-400" />
    <a href="https://github.com/rehan5723" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition underline-offset-4 hover:underline">
      rehan5723
    </a>
  </div>
</div>
            </div>
          </div>
        
      )}
      

      {/* Animations */}
      <style>{`
        @keyframes gradient-x {
          0%,100% {background-position:0% 50%;}
          50% {background-position:100% 50%;}
        }
        .animate-gradient-x {animation: gradient-x 8s ease infinite;}
        @keyframes text-glow {
          0%,100% {text-shadow: 0 0 10px rgba(99,102,241,0.2);}
          50% {text-shadow: 0 0 25px rgba(99,102,241,0.4);}
        }
        .animate-text-glow {animation: text-glow 3s ease-in-out infinite;}
        @keyframes blob-slow {
          0%,100% {transform: translate(0px, 0px) scale(1);}
          33% {transform: translate(30px, -50px) scale(1.1);}
          66% {transform: translate(-20px, 40px) scale(0.9);}
        }
        .animate-blob-slow {animation: blob-slow 20s ease-in-out infinite;}
        .animation-delay-2000 {animation-delay: 2s;}
        .animation-delay-4000 {animation-delay: 4s;}
      `}</style>
    </div>
  );
}
