const Button = ({ 
  children, 
  onClick, 
  variant = 'default', 
  size = 'md', 
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseClasses = "font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
    default: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500"
  }
  
  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  }
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
  
  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={classes}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button;