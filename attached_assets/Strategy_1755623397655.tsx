import React, { useState } from 'react';
import { Target, FileText, TrendingUp, Users, Sparkles, Plus } from 'lucide-react';
import ContentPillarsStrategy from '../components/strategy/ContentPillarsStrategy';
import ContentBriefs from '../components/strategy/ContentBriefs';
import StrategicGoals from '../components/strategy/StrategicGoals';
import AIContentGenerator from '../components/content/AIContentGenerator';

const Strategy = () => {
  const [activeView, setActiveView] = useState('pillars');
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Content Strategy</h1>
          <p className="text-neutral-600">Define your strategic approach and create comprehensive content plans</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={activeView}
            onChange={(e) => setActiveView(e.target.value)}
            className="px-4 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-700 focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all duration-200"
          >
            <option value="pillars">Content Pillars</option>
            <option value="goals">Strategic Goals</option>
            <option value="briefs">Content Briefs</option>
          </select>

          <button 
            onClick={() => setShowAIGenerator(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-200 flex items-center space-x-2 shadow-soft"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Generator</span>
          </button>

          <button className="bg-sage text-white px-4 py-2 rounded-xl font-medium hover:bg-sage/90 transition-colors duration-200 flex items-center space-x-2 shadow-soft">
            <Plus className="w-4 h-4" />
            <span>New Strategy</span>
          </button>
        </div>
      </div>

      {/* Strategy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-100 text-center">
          <div className="w-12 h-12 bg-sage/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-sage" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 mb-1">4</div>
          <div className="text-sm text-neutral-600">Content Pillars</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-100 text-center">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6 text-warm-blue" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 mb-1">12</div>
          <div className="text-sm text-neutral-600">Active Briefs</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-100 text-center">
          <div className="w-12 h-12 bg-dusty-purple/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-dusty-purple" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 mb-1">89%</div>
          <div className="text-sm text-neutral-600">Goal Progress</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-soft border border-neutral-100 text-center">
          <div className="w-12 h-12 bg-warm-amber/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-warm-amber" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 mb-1">5</div>
          <div className="text-sm text-neutral-600">Team Members</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeView === 'pillars' && <ContentPillarsStrategy />}
          {activeView === 'goals' && <StrategicGoals />}
          {activeView === 'briefs' && <ContentBriefs />}
        </div>

        <div>
          <StrategicGoals />
        </div>
      </div>

      {showAIGenerator && (
        <AIContentGenerator
          onClose={() => setShowAIGenerator(false)}
          onGenerate={(content) => {
            console.log('Generated content:', content);
            // Handle the generated content here
          }}
        />
      )}
    </div>
  );
};

export default Strategy;
