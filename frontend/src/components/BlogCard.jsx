import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiArrowRight } from 'react-icons/fi';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

const BlogCard = ({ post, index }) => {
  const getExcerpt = (htmlContent) => {
    if (!htmlContent) return '';
    const strippedText = htmlContent.replace(/<[^>]+>/g, '');
    return strippedText.substring(0, 120) + (strippedText.length > 120 ? '...' : '');
  };

  const getReadingTime = (htmlContent) => {
    if (!htmlContent) return 1;
    const text = htmlContent.replace(/<[^>]+>/g, '');
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  const imageUrl = post.image 
    ? (post.image.startsWith('http') ? post.image : `http://localhost:5000${post.image}`)
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-primary-500/10 dark:hover:shadow-primary-500/5 transition-all duration-300 transform hover:-translate-y-2"
    >
      <Link to={`/blog/${post._id}`} className="block relative overflow-hidden h-60">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center font-mono text-primary-300 dark:text-slate-500 text-sm">
            {`{ image: null }`}
          </div>
        )}
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 shadow-sm border border-white/20 dark:border-slate-700/50">
            {post.category}
          </span>
        </div>
      </Link>

      <div className="p-8 flex flex-col flex-grow relative z-20 bg-white dark:bg-slate-800">
        <div className="flex items-center gap-4 mb-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          <span className="flex items-center gap-1.5"><FiCalendar className="text-primary-500" /> {new Date(post.createdAt).toLocaleDateString()}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
          <span className="flex items-center gap-1.5"><FiClock className="text-primary-500" /> {getReadingTime(post.content)} min</span>
        </div>

        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-4 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
          <Link to={`/blog/${post._id}`}>{post.title}</Link>
        </h3>

        <p className="text-slate-500 dark:text-slate-400 mb-8 text-base leading-relaxed flex-grow line-clamp-3 font-medium">
          {post.summary || parse(DOMPurify.sanitize(getExcerpt(post.content)))}
        </p>

        <Link 
          to={`/blog/${post._id}`} 
          className="inline-flex items-center justify-between w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 text-sm font-bold text-slate-900 dark:text-white group-hover:bg-primary-600 group-hover:text-white transition-all duration-300"
        >
          Read Full Article 
          <FiArrowRight className="transform -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" size={18} />
        </Link>
      </div>
    </motion.article>
  );
};

export default BlogCard;
