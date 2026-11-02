import type { ToastState } from '@/hooks/useToast';
import styles from './Toast.module.css';

// The live region is always rendered so screen readers announce messages as they appear.
export default function Toast({ toast }: { toast: ToastState | null }) {
  return (
    <div role="status" className={styles.region}>
      {toast && (
        <div className={`${styles.toast} ${toast.fading ? styles.fading : styles.visible}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
