export const validateNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value)
}

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== ''
}