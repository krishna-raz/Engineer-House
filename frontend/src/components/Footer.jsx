import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin, FiMail, FiHeart } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          <div className="lg:max-w-md">
            <Link to="/" className="group mb-8 inline-block">
              <img
                src="/logo.png"
                alt="Engineer's House"
                className="w-64 h-16 md:w-80 md:h-20 object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Engineer House is a dedicated platform for engineers and developers to share knowledge about coding, electronics, and modern technology. Learn, build, and explore with our step-by-step practical guides.
            </p>
            <div className="flex gap-4">
              {[FiGithub, FiTwitter, FiLinkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary-600 hover:text-white transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col">
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-xs">
              Contact Us
            </h4>
            <a href="mailto:hello@engineerhouse.com" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <FiMail size={18} />
              hello@engineerhouse.com
            </a>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            © {currentYear} Engineer House. Made with <FiHeart className="text-red-500 fill-red-500" /> for the community.
          </p>
          <div className="flex gap-8">
            <p className="text-xs font-mono text-slate-400 dark:text-slate-500">v1.0.4-stable</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
