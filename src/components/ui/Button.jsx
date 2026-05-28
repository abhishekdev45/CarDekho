const variantClasses = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white',
  secondary: 'bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200',
  ghost: 'hover:bg-neutral-100 text-neutral-700',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-lg',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium rounded-xl
        transition-colors duration-200 focus:outline-none focus:ring-2
        focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50
        disabled:cursor-not-allowed cursor-pointer
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
