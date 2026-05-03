import React from 'react';

const SkeletonLoader = ({ type = 'card' }) => {
  if (type === 'hero') {
    return (
      <div className="w-full h-[400px] bg-slate-200 dark:bg-slate-800 animate-pulse rounded-3xl mb-12"></div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm h-full animate-pulse">
      <div className="h-48 bg-slate-200 dark:bg-slate-700"></div>
      <div className="p-6 space-y-4">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
        </div>
        <div className="pt-4 flex justify-between">
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
