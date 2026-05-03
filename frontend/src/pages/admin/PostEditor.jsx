import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css';
import { postService, uploadService } from '../../services/api';
import { FiSave, FiArrowLeft, FiImage, FiTag, FiLayout, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Configure highlight.js for Quill
hljs.configure({
  languages: ['javascript', 'python', 'c', 'cpp', 'java', 'html', 'css'],
});

const modules = {
  syntax: {
    highlight: text => hljs.highlightAuto(text).value,
  },
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    ['link', 'image', 'code-block'],
    ['clean']
  ],
};

const PostEditor = ({ isEditing = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    category: 'IoT Projects',
    tags: '',
    content: '',
    image: '',
    isPublished: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);

  const categories = ['IoT Projects', 'Electronics Circuits', 'DIY Projects'];

  useEffect(() => {
    if (isEditing && id) {
      const fetchPost = async () => {
        try {
          const response = await postService.getAdminPosts();
          const post = response.data.find(p => p._id === id);
          if (post) {
            setFormData({
              title: post.title,
              summary: post.summary || '',
              category: post.category,
              tags: post.tags ? post.tags.join(', ') : '',
              content: post.content,
              image: post.image || '',
              isPublished: post.isPublished
            });
            if (post.image) {
               setPreviewUrl(post.image.startsWith('http') ? post.image : post.image);
            }
          }
        } catch (error) {
          console.error('Failed to fetch post', error);
        } finally {
          setFetching(false);
        }
      };
      fetchPost();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContentChange = (content) => {
    setFormData({ ...formData, content });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image;
      if (imageFile) {
        const uploadRes = await uploadService.uploadImage(imageFile);
        imageUrl = uploadRes.data.filePath;
      }

      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        image: imageUrl
      };

      if (isEditing) {
        await postService.updatePost(id, postData);
      } else {
        await postService.createPost(postData);
      }
      navigate('/admin');
    } catch (error) {
      console.error('Failed to save post', error);
      alert('Error saving post: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="max-w-4xl mx-auto p-8 text-center">
      <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-slate-500 font-medium tracking-wide">Initializing Editor...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div className="flex-grow">
          <Link to="/admin" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-2 transition-colors group text-sm font-medium">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isEditing ? 'Edit Article' : 'Draft New Article'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {isEditing ? 'Refine your thoughts and update your publication.' : 'Share your knowledge with the engineering community.'}
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Details */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Article Title</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
                placeholder="Enter a compelling title..."
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none text-xl font-bold transition-all dark:text-white placeholder:text-slate-400"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Short Summary</label>
              <textarea 
                name="summary" 
                value={formData.summary} 
                onChange={handleChange} 
                rows="3"
                placeholder="Write a brief overview for the blog card..."
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none text-sm transition-all dark:text-white resize-none placeholder:text-slate-400"
              />
              <p className="mt-2 text-[10px] text-slate-400 ml-1 italic">Summaries appear on the home page and help readers understand the topic quickly.</p>
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Content Body</label>
              <div className="dark:bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <ReactQuill 
                  theme="snow" 
                  value={formData.content} 
                  onChange={handleContentChange} 
                  modules={modules}
                  className="bg-transparent dark:text-white" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
          {/* Publish Controls */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <FiCheckCircle className="text-primary-600" />
              Publishing
            </h4>
            
            <div className="space-y-4 mb-8">
              <label className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 cursor-pointer hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                <input 
                  type="checkbox" 
                  checked={formData.isPublished} 
                  onChange={() => setFormData(prev => ({ ...prev, isPublished: !prev.isPublished }))} 
                  className="w-5 h-5 accent-primary-600" 
                />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Publish Immediately</span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <FiSave />}
              {isEditing ? 'Update Publication' : 'Save & Continue'}
            </button>
          </div>

          {/* Meta Information */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <FiLayout className="text-primary-600" />
              Metadata
            </h4>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Category</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/50 transition-all dark:text-white"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1 flex items-center gap-1.5">
                  <FiTag size={12} /> Tags
                </label>
                <input 
                  type="text" 
                  name="tags" 
                  value={formData.tags} 
                  onChange={handleChange} 
                  placeholder="e.g. iot, coding, rust"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/50 transition-all dark:text-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <FiImage className="text-primary-600" />
              Cover Image
            </h4>
            
            <div className="space-y-4">
              <div className="relative aspect-video rounded-2xl bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center overflow-hidden group">
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <p className="text-white text-xs font-bold">Change Image</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <FiImage className="mx-auto text-slate-300 mb-2" size={32} />
                    <p className="text-xs text-slate-400">Click to upload image</p>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
              </div>
              <p className="text-[10px] text-slate-400 text-center italic">Recommended size: 1200x630px</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostEditor;