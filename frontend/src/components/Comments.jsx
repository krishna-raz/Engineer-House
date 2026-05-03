import React, { useState } from 'react';
import { FiMessageSquare, FiSend, FiUser } from 'react-icons/fi';

const Comments = () => {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [commentsList, setCommentsList] = useState([
    {
      id: 1,
      name: 'Rohan Sharma',
      text: 'This is a fantastic tutorial! The circuit diagram was really helpful. I built this over the weekend and it works perfectly.',
      date: '2 days ago',
    },
    {
      id: 2,
      name: 'Aisha Khan',
      text: 'Could you explain more about how the relay module connects to the ESP8266? I am a bit confused by the wiring.',
      date: '5 hours ago',
    }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && comment.trim()) {
      setCommentsList([
        {
          id: Date.now(),
          name: name.trim(),
          text: comment.trim(),
          date: 'Just now'
        },
        ...commentsList
      ]);
      setName('');
      setComment('');
    }
  };

  return (
    <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
        <FiMessageSquare className="text-primary-600" />
        Comments ({commentsList.length})
      </h3>

      <form onSubmit={handleSubmit} className="mb-12 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
        <h4 className="font-bold text-slate-900 dark:text-white mb-4">Leave a Comment</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1">Name</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500/50 outline-none text-sm dark:text-white"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 ml-1">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts or ask a question..."
              rows="4"
              className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500/50 outline-none text-sm dark:text-white resize-none"
              required
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-colors"
          >
            <FiSend /> Post Comment
          </button>
        </div>
      </form>

      <div className="space-y-8">
        {commentsList.map((c) => (
          <div key={c.id} className="flex gap-4">
            <div className="w-10 h-10 shrink-0 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
              {c.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <h5 className="font-bold text-slate-900 dark:text-white text-sm">{c.name}</h5>
                <span className="text-xs text-slate-500">{c.date}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {c.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
