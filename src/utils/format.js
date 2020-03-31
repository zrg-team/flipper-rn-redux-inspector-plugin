export function convertToJson (value) {
  if (typeof value === 'string' && (
    value.startsWith('{') || value.startsWith('[')
  )) {
    try {
      return JSON.parse(value)
    } catch (e) { }
  }
  return value
}

export function formatTimestamp (timestamp) {
  const date = new Date(timestamp)
  return `${date.getHours().toString().padStart(2, '0')}:${
    date.getMinutes().toString().padStart(2, '0'
  )}:${date.getSeconds().toString().padStart(2, '0')}.${
    date.getMilliseconds().toString().padStart(3, '0'
  )}`
}
