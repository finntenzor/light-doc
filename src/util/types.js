export function generateTypeTextMap(config) {
  const map = {}
  for (const item of config) {
    map[item.name] = item.text
  }
  return map
}

export function generateTypeClassNameMap(config) {
  const map = {}
  for (const item of config) {
    map[item.name] = item.className
  }
  return map
}
