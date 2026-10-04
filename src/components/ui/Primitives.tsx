import { forwardRef, type ComponentPropsWithoutRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'warning' | 'ghost' | 'surface';
type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'icon';
};

// Native attributes, refs, form submission and event handlers are passed through unchanged.
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', size = 'md', className = '', ...props }, ref,
) {
  return <button ref={ref} className={`ds-button ds-button--${variant} ds-button--${size} ${className}`} {...props} />;
});

export const Input = forwardRef<HTMLInputElement, ComponentPropsWithoutRef<'input'>>(function Input(
  { className = '', type = 'text', ...props }, ref,
) {
  const kind = type === 'checkbox' || type === 'radio' ? 'ds-choice' : type === 'file' || type === 'hidden' ? 'ds-file' : 'ds-control';
  return <input ref={ref} type={type} className={`${kind} ${className}`} {...props} />;
});

export const Select = forwardRef<HTMLSelectElement, ComponentPropsWithoutRef<'select'>>(function Select(
  { className = '', ...props }, ref,
) {
  return <select ref={ref} className={`ds-control ds-select ${className}`} {...props} />;
});

export const Textarea = forwardRef<HTMLTextAreaElement, ComponentPropsWithoutRef<'textarea'>>(function Textarea(
  { className = '', ...props }, ref,
) {
  return <textarea ref={ref} className={`ds-control ds-textarea ${className}`} {...props} />;
});

type CardProps = ComponentPropsWithoutRef<'div'> & { padding?: 'none' | 'sm' | 'md' };
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { padding = 'md', className = '', ...props }, ref,
) {
  return <div ref={ref} className={`ds-card ds-card--${padding} ${className}`} {...props} />;
});

export const TabButton = forwardRef<HTMLButtonElement, ButtonProps & { active: boolean }>(function TabButton(
  { active, className = '', type = 'button', ...props }, ref,
) {
  return <Button ref={ref} type={type} variant="surface" className={`ds-tab ${className}`} aria-pressed={active} {...props} />;
});

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'violet';
type BadgeProps = ComponentPropsWithoutRef<'span'> & { tone?: BadgeTone; size?: 'sm' | 'md' };
export function Badge({ tone = 'neutral', size = 'sm', className = '', ...props }: BadgeProps) {
  return <span className={`ds-badge ds-badge--${tone} ds-badge--${size} ${className}`} {...props} />;
}
