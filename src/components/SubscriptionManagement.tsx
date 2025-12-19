import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CreditCard, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function SubscriptionManagement() {
  const navigate = useNavigate();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  // Mock data
  const currentPlan = {
    name: 'Nexus Pro',
    price: '$19.99/month',
    nextBillingDate: 'January 19, 2026',
    features: [
      'Unlimited Course Access',
      'Offline Downloads',
      'Certificate of Completion',
      'Priority Support'
    ]
  };

  const handleCancelClick = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    setIsCancelled(true);
    setShowCancelConfirm(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 flex justify-center">
      <div className="max-w-3xl w-full space-y-8">
        
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Subscription Management</h1>
          <button 
            onClick={() => navigate('/')}
            className="text-slate-400 hover:text-white transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Current Plan Card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CreditCard className="w-64 h-64 text-indigo-500" />
          </div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold mb-1">Current Plan</p>
                <h2 className="text-4xl font-bold text-white mb-2">{currentPlan.name}</h2>
                <p className="text-xl text-indigo-400">{currentPlan.price}</p>
              </div>
              
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-1">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <span className="text-slate-300 font-medium">Next Billing Date</span>
                </div>
                <p className="text-lg text-white font-mono pl-8">{currentPlan.nextBillingDate}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-white">Plan Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-8">
              {!isCancelled ? (
                <div className="flex flex-col gap-4">
                  <p className="text-slate-400 text-sm">
                    We'd hate to see you go, but we believe in your freedom to choose. 
                    Cancelling is simple and instant.
                  </p>
                  <button
                    onClick={handleCancelClick}
                    className="self-start px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 group"
                  >
                    <AlertTriangle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Cancel Subscription
                  </button>
                </div>
              ) : (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-yellow-500 font-semibold mb-1">Subscription Cancelled</h4>
                    <p className="text-yellow-200/80 text-sm">
                      Your subscription has been cancelled. You will retain access to all features until <span className="font-bold text-yellow-200">{currentPlan.nextBillingDate}</span>.
                    </p>
                    <button 
                      onClick={() => setIsCancelled(false)}
                      className="mt-3 text-sm text-yellow-500 hover:text-yellow-400 underline underline-offset-4"
                    >
                      Undo Cancellation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all scale-100">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Cancellation?</h3>
            <p className="text-slate-300 mb-6">
              You will lose access to premium features on <span className="font-bold text-white">{currentPlan.nextBillingDate}</span>.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Keep Subscription
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg shadow-red-900/20 transition-colors"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
