import React from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiCode, FiUser, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            About Engineer House
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400">
            A dedicated platform for makers, tinkerers, and developers to learn, build, and innovate.
          </p>
        </motion.div>

        <div className="space-y-16">
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800/50 p-8 md:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-2xl flex items-center justify-center">
                <FiTarget size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              At Engineer House, our mission is to simplify complex concepts in electronics, IoT, and software development. We believe that hands-on learning through step-by-step practical guides is the best way to master modern technology. Whether you're building your first Arduino project or deploying a full-stack application, we are here to help you every step of the way.
            </p>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 gap-8"
          >
            <div className="bg-slate-50 dark:bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <FiCode size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">What You'll Find Here</h3>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li>• Detailed IoT Project Tutorials</li>
                <li>• Electronics Circuit Diagrams</li>
                <li>• Easy-to-follow Code Snippets</li>
                <li>• DIY Hardware Guides</li>
              </ul>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <FiUser size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">About the Creator</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                <strong>Vinit Kumar</strong> is a passionate engineer, developer, and technical writer. He created Engineer House to share his knowledge and document his journey of building innovative hardware and software solutions.
              </p>
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="inline-flex flex-col items-center p-8 bg-primary-50 dark:bg-primary-900/10 rounded-3xl border border-primary-100 dark:border-primary-900/30">
              <FiMail className="text-primary-600 mb-4" size={32} />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Have a question?</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">We'd love to hear from you. Feel free to reach out!</p>
              <Link to="/contact" className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-colors">
                Contact Us
              </Link>
            </div>
          </motion.section>
        </div>

      </div>
    </div>
  );
};

export default About;
