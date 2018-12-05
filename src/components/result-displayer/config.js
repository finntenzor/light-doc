import { typeConfig } from '@/consts'

function generateTypeTextMap(config) {
  const map = {}
  for (const item of config) {
    map[item.name] = item.text
  }
  return map
}

function generateTypeClassNameMap(config) {
  const map = {}
  for (const item of config) {
    map[item.name] = item.className
  }
  return map
}

const toTextMap = generateTypeTextMap(typeConfig)

const toClassNameMap = generateTypeClassNameMap(typeConfig)

export function toText(name) {
  return toTextMap[name] || '未知结果'
}

export function toClassName(name) {
  return toClassNameMap[name] || 'unknown'
}
