import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { postService, messageService } from '../services/api';
import { FiEdit2, FiTrash2, FiEye, FiEyeOff, FiPlus, FiLogOut, FiMessageSquare, FiFileText, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('articles'); // 'articles' or 'messages'
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'articles') {
        const response = await postService.getAdminPosts();
        setPosts(response.data);
      } else {
        const response = await messageService.getMessages();
        setMessages(response.data);
      }
    } catch (err) {
      setError(`Failed to fetch ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  // Post Actions
  const handleTogglePublish = async (id) => {
    try {
      await postService.togglePublish(id);
      fetchData();
    } catch (error) {
      console.error('Failed to toggle publish status', error);
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postService.deletePost(id);
        setPosts(posts.filter(p => p._id !== id));
      } catch (err) {
        setError('Failed to delete post');
      }
    }
  };

  // Message Actions
  const handleToggleReadStatus = async (id) => {
    try {
      await messageService.toggleReadStatus(id);
      setMessages(messages.map(m => m._id === id ? { ...m, isRead: !m.isRead } : m));
    } catch (error) {
      console.error('Failed to toggle message read status', error);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await messageService.deleteMessage(id);
        setMessages(messages.filter(m => m._id !== id));
      } catch (err) {
        setError('Failed to delete message');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your publications and user messages.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/create')}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold shadow-lg shadow-primary-600/20 transition-all"
          >
            <FiPlus /> New Article
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-red-600 rounded-2xl font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('articles')}
          className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all border-b-2 ${
            activeTab === 'articles'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <FiFileText size={18} /> Articles
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all border-b-2 ${
            activeTab === 'messages'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <FiMessageSquare size={18} /> Messages
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-2xl mb-8 border border-red-500/20 font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl w-full"></div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden">
          
          {/* ARTICLES TAB */}
          {activeTab === 'articles' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="px-8 py-5">Article Title</th>
                    <th className="px-6 py-5">Category</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5">Date</th>
                    <th className="px-8 py-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {posts.map((post) => (
                    <tr key={post._id} className="group hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
                      <td className="px-8 py-6 font-bold text-slate-900 dark:text-white">{post.title}</td>
                      <td className="px-6 py-6">
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${
                          post.isPublished 
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${post.isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                          {post.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-sm text-slate-500 dark:text-slate-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleTogglePublish(post._id)}
                            className={`p-2 rounded-xl transition-all ${
                              post.isPublished 
                                ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 hover:bg-amber-100' 
                                : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-100'
                            }`}
                            title={post.isPublished ? 'Move to Draft' : 'Publish Article'}
                          >
                            {post.isPublished ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                          </button>
                          <button
                            onClick={() => navigate(`/admin/edit/${post._id}`)}
                            className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl hover:bg-blue-100 transition-all"
                            title="Edit Article"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                            title="Delete Article"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {posts.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-slate-500">No articles found. Start by creating one!</p>
                </div>
              )}
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="px-8 py-5">Sender</th>
                    <th className="px-6 py-5">Message</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5">Date</th>
                    <th className="px-8 py-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {messages.map((msg) => (
                    <tr key={msg._id} className={`group hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors ${!msg.isRead ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''}`}>
                      <td className="px-8 py-6">
                        <div className={`font-bold ${!msg.isRead ? 'text-primary-600 dark:text-primary-400' : 'text-slate-900 dark:text-white'}`}>
                          {msg.name}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{msg.email}</div>
                      </td>
                      <td className="px-6 py-6 text-sm text-slate-600 dark:text-slate-300 max-w-md">
                        <p className={`line-clamp-2 ${!msg.isRead ? 'font-medium' : ''}`}>{msg.message}</p>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${
                          msg.isRead 
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' 
                            : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                        }`}>
                          {!msg.isRead && <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>}
                          {msg.isRead ? 'Read' : 'New'}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-sm text-slate-500 dark:text-slate-400">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleToggleReadStatus(msg._id)}
                            className={`p-2 rounded-xl transition-all ${
                              msg.isRead 
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200' 
                                : 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 hover:bg-primary-100'
                            }`}
                            title={msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                          >
                            {msg.isRead ? <FiEyeOff size={18} /> : <FiCheckCircle size={18} />}
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(msg._id)}
                            className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                            title="Delete Message"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {messages.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-slate-500">No messages found. Inbox is clean!</p>
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

