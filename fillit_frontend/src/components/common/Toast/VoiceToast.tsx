import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from 'react-dom';

interface ToastProps {
  message: string;
  isVisible: boolean;
}

const VoiceToast = ({ message, isVisible }: ToastProps) => {
  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[200]"
        >
          <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
            <p className="text-[#4F4A85] text-sm font-medium">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById('modal-root') || document.body
  );
};

export default VoiceToast;
