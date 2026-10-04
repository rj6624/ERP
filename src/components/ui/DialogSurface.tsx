import { useEffect, useRef, type ComponentPropsWithoutRef } from 'react';

const dialogStack: HTMLElement[] = [];
type DialogSurfaceProps = ComponentPropsWithoutRef<'div'> & {
  onClose: () => void;
  presentation?: 'dialog' | 'drawer';
};

/** Shared focus and dismissal behavior for modals, previews and slide-over panels. */
export function DialogSurface({ onClose, presentation = 'dialog', className = '', children, ...props }: DialogSurfaceProps) {
  const surface = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  useEffect(() => { close.current = onClose; }, [onClose]);

  useEffect(() => {
    const element = surface.current;
    if (!element) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = () => Array.from(element.querySelectorAll<HTMLElement>(
      'button:not(:disabled), a[href], input:not(:disabled):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
    )).filter(node => node.getClientRects().length && !node.closest('[inert]'));
    dialogStack.push(element);
    if (!element.contains(document.activeElement)) (focusable()[0] || element).focus();

    const handleKey = (event: KeyboardEvent) => {
      if (dialogStack.at(-1) !== element) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        close.current();
      }
      if (event.key === 'Tab') {
        const nodes = focusable();
        const first = nodes[0], last = nodes.at(-1);
        if (!first) { event.preventDefault(); element.focus(); }
        else if (event.shiftKey && (document.activeElement === first || !nodes.includes(document.activeElement as HTMLElement))) {
          event.preventDefault(); last?.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !nodes.includes(document.activeElement as HTMLElement))) {
          event.preventDefault(); first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKey, true);
    return () => {
      document.removeEventListener('keydown', handleKey, true);
      const index = dialogStack.indexOf(element);
      if (index !== -1) dialogStack.splice(index, 1);
      if (previous?.isConnected) previous.focus();
    };
  }, []);

  return <div ref={surface} role="dialog" aria-modal="true" tabIndex={-1} className={`ds-${presentation} ${className}`} {...props}>{children}</div>;
}
