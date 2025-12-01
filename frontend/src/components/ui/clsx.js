// lightweight clsx helper to avoid bringing an extra dependency
export default function clsx(...args) {
  return args
    .flatMap((a) => (Array.isArray(a) ? a : [a]))
    .filter(Boolean)
    .join(' ');
}
