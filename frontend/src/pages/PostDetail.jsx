import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postService } from '../services/api';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiCopy, FiCheck, FiArrowLeft, FiClock, FiCalendar, FiArrowUp, FiShare2, FiBookmark } from 'react-icons/fi';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import Comments from '../components/Comments';

const extractTextFromNode = (node) => {
  if (node.type === 'text') return node.data || '';
  if (node.children) return node.children.map(extractTextFromNode).join('');
  return '';
};

const CodeBlock = ({ value, className }) => {
  const [copied, setCopied] = useState(false);
  
  let language = 'javascript';
  if (className) {
    const match = className.match(/language-(\w+)/);
    if (match) language = match[1];
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-8 overflow-hidden rounded-2xl shadow-xl bg-[#1e1e1e] font-sans border border-slate-800">
      <div className="flex justify-between items-center bg-[#252526] px-5 py-3 text-xs font-mono text-slate-400 border-b border-slate-800">
        <div className="flex gap-1.5 items-center">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40"></div>
          <span className="ml-3 uppercase tracking-widest">{language}</span>
        </div>
        <button 
          onClick={handleCopy} 
          className="hover:text-white flex items-center gap-1.5 transition-colors bg-slate-800/50 px-3 py-1 rounded-md"
        >
          {copied ? <><FiCheck /> Copied!</> : <><FiCopy /> Copy</>}
        </button>
      </div>
      <div className="overflow-x-auto text-sm leading-relaxed scrollbar-hide">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent', fontSize: '14px', lineHeight: '1.6' }}
          wrapLines={true}
          showLineNumbers={true}
        >
          {value || ''}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toc, setToc] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const contentRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postService.getPost(id);
        const fetchedPost = response.data;
        setPost(fetchedPost);
        
        // Generate TOC from content
        const parser = new DOMParser();
        const doc = parser.parseFromString(fetchedPost.content, 'text/html');
        const headings = Array.from(doc.querySelectorAll('h2, h3'));
        const tocItems = headings.map((h, index) => {
          const id = `heading-${index}`;
          h.id = id;
          return { id, text: h.innerText, level: h.tagName.toLowerCase() };
        });
        setToc(tocItems);
        
      } catch (err) {
        setError('Failed to load the post. It might have been deleted or unpublished.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  const getReadingTime = (htmlContent) => {
    if (!htmlContent) return 1;
    const text = htmlContent.replace(/<[^>]+>/g, '');
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="h-10 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl w-3/4 mb-8"></div>
      <div className="h-64 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-3xl mb-12"></div>
      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-4 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg w-full"></div>)}
      </div>
    </div>
  );

  if (error || !post) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-3xl flex items-center justify-center mb-6">
        <FiArrowLeft size={32} />
      </div>
      <h2 className="text-2xl font-bold mb-4">{error || 'Post not found'}</h2>
      <Link to="/" className="text-primary-600 font-bold hover:underline">Return to Home</Link>
    </div>
  );

  return (
    <div className="relative">
      {/* Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 bg-primary-600 z-[110] origin-left" 
        style={{ scaleX }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 lg:py-20 flex flex-col lg:flex-row gap-16">
        {/* Main Content */}
        <article className="flex-grow lg:max-w-[800px]">
          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Link to="/" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors">
                <FiArrowLeft size={20} />
              </Link>
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-bold rounded-full uppercase tracking-wider">
                {post.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-8 leading-[1.1]">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-6 pb-12 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  {post.author?.name?.charAt(0) || 'V'}
                </div>
                <div>
                  <p className="text-slate-900 dark:text-white font-bold">{post.author?.name || 'Vinit Kumar'}</p>
                  <p className="text-slate-500 text-xs flex items-center gap-4">
                    <span className="flex items-center gap-1"><FiCalendar /> {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1"><FiClock /> {getReadingTime(post.content)} min read</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"><FiShare2 size={18} /></button>
                <button className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"><FiBookmark size={18} /></button>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.image && (
            <div className="mb-12 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <img
                src={post.image.startsWith('http') ? post.image : `http://localhost:5000${post.image}`}
                alt={post.title}
                className="w-full h-auto object-cover max-h-[500px]"
              />
            </div>
          )}

          {/* Article Body */}
          <div 
            ref={contentRef}
            className="prose prose-lg dark:prose-invert prose-slate prose-headings:font-heading prose-headings:font-bold prose-p:leading-relaxed prose-pre:bg-transparent prose-pre:p-0 prose-img:rounded-3xl prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-blockquote:border-primary-500 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-800/50 prose-blockquote:py-1 prose-blockquote:rounded-r-2xl"
          >
            {parse(DOMPurify.sanitize(post.content), {
              replace: (domNode) => {
                // Add IDs to headings for TOC
                if (domNode.name === 'h2' || domNode.name === 'h3') {
                   const text = extractTextFromNode(domNode);
                   const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                   domNode.attribs.id = id;
                }

                if (domNode.name === 'pre') {
                  const className = domNode.attribs?.class || '';
                  if (className.includes('ql-syntax')) {
                     const value = extractTextFromNode(domNode);
                     return <CodeBlock value={value} className={className} />;
                  } else {
                    const firstChild = domNode.children && domNode.children[0];
                    if (firstChild && firstChild.name === 'code') {
                      const value = extractTextFromNode(firstChild);
                      const codeClassName = firstChild.attribs?.class || className;
                      return <CodeBlock value={value} className={codeClassName} />;
                    }
                  }
                }
              }
            })}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-16 pt-10 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Article Tags</h4>
              <div className="flex flex-wrap gap-3">
                {post.tags.map((tag, index) => (
                  <span key={index} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <Comments />
        </article>

        {/* Sidebar */}
        <aside className="lg:w-80 shrink-0">
          <div className="sticky top-32 space-y-10">
            {/* TOC */}
            {toc.length > 0 && (
              <div className="p-8 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                   <div className="w-1.5 h-6 bg-primary-600 rounded-full"></div>
                   Table of Contents
                </h4>
                <ul className="space-y-4">
                  {toc.map((item) => (
                    <li key={item.id} className={item.level === 'h3' ? 'pl-4' : ''}>
                      <a 
                        href={`#${item.text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`} 
                        className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors block"
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Newsletter */}
            <div className="p-8 bg-primary-600 rounded-3xl text-white shadow-xl shadow-primary-600/20 relative overflow-hidden">
               <div className="relative z-10">
                  <h4 className="text-xl font-bold mb-3">Engineer's Digest</h4>
                  <p className="text-primary-100 text-sm mb-6">Get the latest tutorials and insights delivered to your inbox.</p>
                  <input 
                    type="email" 
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm placeholder:text-primary-200 outline-none focus:bg-white/20 mb-3"
                  />
                  <button className="w-full py-3 bg-white text-primary-600 rounded-xl text-sm font-bold hover:bg-primary-50 transition-colors">Subscribe</button>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-16 -translate-y-16"></div>
            </div>
          </div>
        </aside>
      </div>

      {/* Scroll Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 w-14 h-14 bg-primary-600 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:bg-primary-500 transition-all z-[100]"
          >
            <FiArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostDetail;