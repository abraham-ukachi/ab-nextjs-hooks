const humanizeKey = (key: string): string => {
  const words = key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')

  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

export { humanizeKey }