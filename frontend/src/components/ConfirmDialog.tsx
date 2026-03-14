import { useEffect, useRef } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    cancelButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isLoading) onCancel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isLoading, isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={() => !isLoading && onCancel()}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className="dialog-panel max-w-md"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md border border-red-400/30 bg-red-400/10 text-red-300">
          <FiAlertTriangle size={21} />
        </div>
        <h2 id="confirm-dialog-title" className="font-display text-xl font-bold text-white">{title}</h2>
        <p id="confirm-dialog-message" className="mt-2 text-sm leading-6 text-[#aebed4]">{message}</p>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button ref={cancelButtonRef} type="button" onClick={onCancel} disabled={isLoading} className="secondary-button sm:min-w-24">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={isLoading} className="flex min-h-11 items-center justify-center rounded-md bg-red-500 px-5 text-sm font-bold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-32">
            {isLoading ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};