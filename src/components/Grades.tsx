import React from 'react';
import { Lock, Info } from 'lucide-react';

export const Grades: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto text-slate-50">
      <h1 className="text-3xl font-bold mb-8">Grades</h1>

      {/* Notification Banner */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-8 flex items-start gap-3">
        <div className="bg-yellow-500 rounded-full p-1 mt-0.5 flex-shrink-0">
            <span className="text-xs font-bold text-slate-900 block w-4 h-4 text-center leading-4">2</span>
        </div>
        <p className="text-yellow-200 text-sm font-medium pt-0.5">
          You have 2 assessments coming up. Be sure to submit them before the deadline.
        </p>
      </div>

      {/* Grades Table */}
      <div className="bg-slate-900 rounded-lg shadow-sm border border-slate-800 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-6 border-b border-slate-800 bg-slate-950 text-sm font-semibold text-slate-400">
          <div className="col-span-5">Item</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3">Due</div>
          <div className="col-span-1">Weight</div>
          <div className="col-span-1 text-right">Grade</div>
        </div>

        {/* Row 1 */}
        <div className="grid grid-cols-12 gap-4 p-6 border-b border-slate-800 hover:bg-slate-800/50 transition-colors items-center">
          <div className="col-span-5">
            <div className="flex items-start gap-3">
              <div className="mt-1 text-slate-500">
                <Lock size={16} />
              </div>
              <div>
                <h3 className="text-indigo-400 font-medium hover:underline cursor-pointer">Knowledge check: React Fundamentals</h3>
                <p className="text-slate-400 text-xs mt-0.5">Graded Assignment</p>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex items-center gap-2 text-slate-300 text-sm">
              <Info size={16} className="text-slate-400" />
              <span>Locked</span>
            </div>
          </div>
          <div className="col-span-3 text-sm text-slate-300">
            <div>Dec 11</div>
            <div className="text-xs text-slate-500">11:59 PM +07</div>
          </div>
          <div className="col-span-1 text-sm text-slate-300">30%</div>
          <div className="col-span-1 text-right text-sm text-slate-300">100%</div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-12 gap-4 p-6 border-b border-slate-800 hover:bg-slate-800/50 transition-colors items-center">
          <div className="col-span-5">
            <div className="flex items-start gap-3">
              <div className="mt-1 text-slate-500">
                <Lock size={16} />
              </div>
              <div>
                <h3 className="text-indigo-400 font-medium hover:underline cursor-pointer">Module quiz: React Hooks</h3>
                <p className="text-slate-400 text-xs mt-0.5">Graded Assignment</p>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex items-center gap-2 text-slate-300 text-sm">
              <Info size={16} className="text-slate-400" />
              <span>Locked</span>
            </div>
          </div>
          <div className="col-span-3 text-sm text-slate-300">
            <div>Dec 18</div>
            <div className="text-xs text-slate-500">11:59 PM +07</div>
          </div>
          <div className="col-span-1 text-sm text-slate-300">30%</div>
          <div className="col-span-1 text-right text-sm text-slate-300">90%</div>
        </div>

        {/* Row 3 - Portfolio Project */}
        <div className="p-6 border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
          <div className="grid grid-cols-12 gap-4 items-start mb-4">
            <div className="col-span-5">
              <div className="flex items-start gap-3">
                <div className="mt-1 text-slate-500">
                  <Lock size={16} />
                </div>
                <div>
                  <h3 className="text-slate-200 font-medium">Submit your React Portfolio Project</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Submit your assignment and review 2 peers' assignments to get your grade.</p>
                </div>
              </div>
            </div>
            <div className="col-span-2"></div>
            <div className="col-span-3"></div>
            <div className="col-span-1 text-sm text-slate-300">40%</div>
            <div className="col-span-1 text-right text-sm text-slate-300">--</div>
          </div>

          {/* Sub-row 1 */}
          <div className="grid grid-cols-12 gap-4 py-3 pl-8 items-center">
            <div className="col-span-5">
              <div className="flex items-start gap-3">
                <div className="mt-1 text-slate-500">
                  <Lock size={16} />
                </div>
                <div>
                  <h3 className="text-indigo-400 font-medium hover:underline cursor-pointer text-sm">Submit your assignment</h3>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <Info size={16} className="text-slate-400" />
                <span>Locked</span>
              </div>
            </div>
            <div className="col-span-3 text-sm text-slate-300">
              <div>Dec 19</div>
              <div className="text-xs text-slate-500">11:59 PM +07</div>
            </div>
            <div className="col-span-2"></div>
          </div>

          {/* Sub-row 2 */}
          <div className="grid grid-cols-12 gap-4 py-3 pl-8 items-center">
            <div className="col-span-5">
              <div className="flex items-start gap-3">
                <div className="mt-1 text-slate-500">
                  <Lock size={16} />
                </div>
                <div>
                  <h3 className="text-indigo-400 font-medium hover:underline cursor-pointer text-sm">Review 2 peers' assignments.</h3>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <Info size={16} className="text-slate-400" />
                <span>Locked</span>
              </div>
            </div>
            <div className="col-span-3 text-sm text-slate-300">
              <div>Dec 22</div>
              <div className="text-xs text-slate-500">11:59 PM +07</div>
            </div>
            <div className="col-span-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
