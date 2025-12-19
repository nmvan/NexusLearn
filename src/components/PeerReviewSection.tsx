import { useState } from 'react';
import { Flag, AlertTriangle, User } from 'lucide-react';

interface Review {
  id: number;
  reviewerName: string;
  reputationScore: number;
  content: string;
  isFlagged: boolean;
}

export function PeerReviewSection() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      reviewerName: "Reviewer A",
      reputationScore: 95,
      content: "Great explanation of the concept. The examples were very clear.",
      isFlagged: false
    },
    {
      id: 2,
      reviewerName: "Reviewer B",
      reputationScore: 88,
      content: "Good effort, but I think you missed a key point about process scheduling.",
      isFlagged: false
    },
    {
      id: 3,
      reviewerName: "Reviewer C",
      reputationScore: 12,
      content: "lol bad.",
      isFlagged: false
    }
  ]);

  const [showRegradeConfirm, setShowRegradeConfirm] = useState(false);

  const handleFlagReview = (id: number) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, isFlagged: true } : r));
    // In a real app, this would send a report to the backend
    // alert(`Review ${id} has been flagged for moderation.`);
  };

  const handleRequestRegrade = () => {
    setShowRegradeConfirm(true);
  };

  const confirmRegrade = () => {
    // Logic to send to senior reviewer
    // alert("Request sent to Senior Reviewer (Reputation > 80).");
    setShowRegradeConfirm(false);
  };

  return (
    <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6 space-y-6 mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-100">Peer Reviews</h2>
        <button 
          onClick={handleRequestRegrade}
          className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-sm font-medium transition-colors"
        >
          Request Re-grade
        </button>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className={`p-4 rounded-lg border ${review.isFlagged ? 'bg-red-900/10 border-red-900/30' : 'bg-slate-800/50 border-slate-700'}`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center">
                  <User size={14} className="text-slate-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-200">{review.reviewerName}</div>
                  <div className={`text-xs ${review.reputationScore < 50 ? 'text-red-400' : 'text-green-400'}`}>
                    Reputation: {review.reputationScore}
                  </div>
                </div>
              </div>
              
              {!review.isFlagged && (
                <button 
                  onClick={() => handleFlagReview(review.id)}
                  className="text-slate-500 hover:text-red-400 transition-colors p-1"
                  title="Report low quality review"
                >
                  <Flag size={16} />
                </button>
              )}
              {review.isFlagged && (
                <span className="text-xs text-red-400 flex items-center gap-1">
                  <AlertTriangle size={12} /> Flagged
                </span>
              )}
            </div>
            <p className="text-slate-300 text-sm">{review.content}</p>
          </div>
        ))}
      </div>

      {showRegradeConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">Request Re-grade?</h3>
            <p className="text-slate-300 mb-6">
              This will send your work to a <span className="text-indigo-400 font-semibold">Senior Reviewer (Reputation &gt; 80)</span>. 
              This ensures fairness and quality in the learning process.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowRegradeConfirm(false)}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmRegrade}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium"
              >
                Confirm Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
