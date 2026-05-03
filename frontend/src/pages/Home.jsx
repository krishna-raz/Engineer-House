import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../services/api';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import { FiSearch, FiClock, FiCalendar, FiArrowUpRight, FiGrid, FiCpu, FiActivity, FiTool } from 'react-icons/fi';
import { motion } from 'framer-motion';
import BlogCard from '../components/BlogCard';
import SkeletonLoader from '../components/SkeletonLoader';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [featuredPost, setFeaturedPost] = useState(null);

  const categories = [
    { name: 'All', icon: <FiGrid size={18} /> },
    { name: 'IoT Projects', icon: <FiCpu size={18} /> },
    { name: 'Electronics Circuits', icon: <FiActivity size={18} /> },
    { name: 'DIY Projects', icon: <FiTool size={18} /> }
  ];

  useEffect(() => {
    fetchPosts();
  }, [category, search]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await postService.getPosts(1, category, search);
      const fetchedPosts = response.data.posts;
      setPosts(fetchedPosts);
      
      if (fetchedPosts.length > 0 && category === 'All' && !search) {
        setFeaturedPost(fetchedPosts[0]);
      } else {
        setFeaturedPost(null);
      }
    } catch (err) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const getExcerpt = (htmlContent) => {
    if (!htmlContent) return '';
    const strippedText = htmlContent.replace(/<[^>]+>/g, '');
    return strippedText.substring(0, 200) + (strippedText.length > 200 ? '...' : '');
  };

  const getReadingTime = (htmlContent) => {
    if (!htmlContent) return 1;
    const text = htmlContent.replace(/<[^>]+>/g, '');
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Dynamic Hero Section */}
      {!search && category === 'All' && (
        <section className="relative pt-32 pb-24 overflow-hidden">
          {/* Animated Mesh/Tech Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary-500/20 dark:bg-primary-500/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
            <div className="absolute top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-500/20 dark:bg-blue-500/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-purple-500/20 dark:bg-purple-500/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000"></div>
            
            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-8 text-center relative z-10">
            <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-sm"
            >
               <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400">
                 Welcome to the Future of Electronics
               </span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-[1.1]"
            >
              Build <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600">Innovation</span><br className="hidden md:block" />
              With Every Circuit
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12 font-medium"
            >
              Master IoT, Arduino, and DIY electronics through professional, step-by-step practical guides engineered for creators.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <button 
                onClick={() => {
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative inline-flex items-center gap-3 px-8 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-black text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(37,99,235,0.3)] dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">Explore Projects <FiArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></span>
              </button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Featured Blog - Edge to Edge Layout */}
      {!search && category === 'All' && featuredPost && (
        <section id="projects" className="relative pb-24 px-4 md:px-8 max-w-[1400px] mx-auto z-20">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-[3rem] overflow-hidden shadow-2xl h-[600px] lg:h-[700px] group"
          >
            {/* Background Image */}
            {featuredPost.image ? (
              <img 
                src={featuredPost.image.startsWith('http') ? featuredPost.image : `http://localhost:5000${featuredPost.image}`}
                alt={featuredPost.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
              />
            ) : (
              <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                 <FiCpu size={120} className="text-slate-800" />
              </div>
            )}
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent"></div>

            {/* Content Box */}
            <div className="absolute bottom-0 left-0 w-full lg:w-2/3 p-8 md:p-16 flex flex-col justify-end h-full z-10">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="flex items-center gap-2 bg-red-500/20 backdrop-blur-md text-red-400 border border-red-500/30 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  Latest Publication
                </span>
                <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                  {featuredPost.category}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 leading-[1.1]">
                <Link to={`/blog/${featuredPost._id}`} className="hover:text-primary-400 transition-colors">
                  {featuredPost.title}
                </Link>
              </h1>
              <p className="text-slate-300 text-lg md:text-xl mb-10 line-clamp-2 md:line-clamp-3 leading-relaxed font-medium max-w-2xl">
                {featuredPost.summary || parse(DOMPurify.sanitize(getExcerpt(featuredPost.content)))}
              </p>
              
              <div className="flex flex-wrap items-center gap-8 mb-10 text-white/80 text-sm font-bold">
                <span className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"><FiCalendar className="text-primary-400" /> {new Date(featuredPost.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"><FiClock className="text-primary-400" /> {getReadingTime(featuredPost.content)} min read</span>
              </div>

              <Link 
                to={`/blog/${featuredPost._id}`}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full font-black hover:bg-primary-50 transition-all w-fit shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105"
              >
                Read Masterclass <FiArrowUpRight size={20} />
              </Link>
            </div>
          </motion.div>
        </section>
      )}

      {/* Main Content & Floating Categories */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pb-32 relative z-20">
        
        {/* Floating Glassmorphism Dock Filter */}
        <div className="sticky top-24 z-40 mb-16 flex justify-center">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-3 rounded-[2rem] border border-white/20 dark:border-slate-700/50 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 w-full md:w-auto">
            
            <div className="flex overflow-x-auto hide-scrollbar w-full md:w-auto gap-2 p-1">
              {categories.map(c => (
                <button 
                  key={c.name}
                  onClick={() => setCategory(c.name)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                    category === c.name 
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md transform scale-105' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {c.icon} {c.name}
                </button>
              ))}
            </div>

            <div className="w-full md:w-auto md:ml-4 flex-shrink-0">
              <div className="relative group w-full md:w-64">
                <input 
                  type="text" 
                  placeholder="Search projects..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 bg-slate-100 dark:bg-slate-800 border border-transparent rounded-full focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none text-sm font-medium transition-all dark:text-white shadow-inner"
                />
                <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
              </div>
            </div>

          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-600 dark:text-red-400 p-6 rounded-3xl mb-12 border border-red-500/20 text-center font-bold shadow-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonLoader key={i} />)}
          </div>
        ) : posts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32 bg-white dark:bg-slate-800/50 rounded-[3rem] border border-slate-100 dark:border-slate-700/50 shadow-xl"
          >
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-slate-100 dark:border-slate-700">
              <FiSearch size={40} className="text-slate-400" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">No results found</h3>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">Try adjusting your search or selecting a different category.</p>
          </motion.div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <BlogCard key={post._id} post={post} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
