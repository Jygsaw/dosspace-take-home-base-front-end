export const validateBuildNumber = (value: string = '') => {
  const regex = /^[A-Z0-9]{5}-[0-9]{3}$/
  return regex.test(value)
}

export const validateOrderNumber = (value: string = '') => {
  const regex = /^[0-9]{3}-[0-9]{7}-[0-9]{7}$/
  return regex.test(value)
}

export const validateString = (value: string = '') => {
  return value.length > 0
}

export const validateCost = (value: number = 0) => {
  return value > 0
}
