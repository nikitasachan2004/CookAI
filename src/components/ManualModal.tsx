import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, LeafyGreen, UtensilsCrossed, BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ManualModal.css';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualModal: React.FC<ManualModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="manual-modal-backdrop" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="manual-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="manual-modal-title"
          >
            {/* Header */}
            <div className="manual-modal-header">
              <div className="manual-modal-header-info">
                <div className="manual-modal-badge">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h2 id="manual-modal-title" className="manual-modal-title">
                    How CookAI Works
                  </h2>
                  <p className="manual-modal-subtitle">User Manual & Instructions</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="manual-modal-close-btn"
                aria-label="Close manual modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="manual-modal-body">
              <div className="manual-intro-quote">
                <p>
                  "I didn't want another app that gives me a recipe for a 5-course meal when all I have is pasta and cheese. Just tell the app what you have, and it handles the rest."
                </p>
              </div>

              <div className="manual-steps-list">
                {/* Step 1 */}
                <div className="manual-step-item">
                  <div className="manual-step-num">1</div>
                  <div className="manual-step-icon-box">
                    <User size={20} />
                  </div>
                  <div className="manual-step-content">
                    <h3 className="manual-step-title">Tell us your goal & gear</h3>
                    <p className="manual-step-desc">
                      Just want a quick high-protein meal? Only have a microwave and a pan? Let the app know so it stops suggesting 3-hour oven roasts.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="manual-step-item">
                  <div className="manual-step-num">2</div>
                  <div className="manual-step-icon-box">
                    <LeafyGreen size={20} />
                  </div>
                  <div className="manual-step-content">
                    <h3 className="manual-step-title">Dump your fridge contents</h3>
                    <p className="manual-step-desc">
                      Just tap or type whatever you've got. Got half an onion, two eggs, and some rice? Add it all in. Don't overthink it.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="manual-step-item">
                  <div className="manual-step-num">3</div>
                  <div className="manual-step-icon-box">
                    <UtensilsCrossed size={20} />
                  </div>
                  <div className="manual-step-content">
                    <h3 className="manual-step-title">Get a recipe you can actually cook</h3>
                    <p className="manual-step-desc">
                      The engine instantly scores recipes based on what you have. No "missing ingredient" surprises halfway through cooking.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="manual-modal-footer">
              <button
                type="button"
                className="manual-action-btn"
                onClick={() => {
                  onClose();
                  navigate('/app');
                }}
              >
                <span>Start Cooking</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
