
import React, { useState } from 'react';
import { Target, CheckSquare, TrendingUp, Calendar } from 'lucide-react';
import TaskTracker from '../components/tracking/TaskTracker';
import ProgressTracker from '../components/tracking/ProgressTracker';

const Tracking = () => {
  const [activeView, setActiveView] = useState('tasks');

  const views = [
    { id: 'tasks', label: 'Task Tracking', icon: CheckSquare },
    { id: 'progress', label: 'Goal Progress', icon: Target },
    { id: 'timeline', label: 'Timeline View', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Project Tracking</h1>
          <p className="text-neutral-600">Monitor progress, track tasks, and achieve your goals</p>
        </div>
      </div>

      {/* View Navigation */}
      <div className="flex space-x-1 mb-8 bg-neutral-100 p-1 rounded-xl inline-flex">
        {views.map((view) => {
          const Icon = view.icon;
          return (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeView === view.id
                  ? 'bg-white text-sage shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{view.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="space-y-8">
        {activeView === 'tasks' && <TaskTracker />}
        {activeView === 'progress' && <ProgressTracker />}
        {activeView === 'timeline' && (
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Timeline View</h2>
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <div className="text-neutral-400 mb-2">Timeline view coming soon</div>
              <p className="text-sm text-neutral-500">Visual project timeline and milestone tracking</p>
            </div>
          </div>
        )}
        {activeView === 'analytics' && (
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Tracking Analytics</h2>
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <div className="text-neutral-400 mb-2">Analytics dashboard coming soon</div>
              <p className="text-sm text-neutral-500">Performance metrics and productivity insights</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracking;
