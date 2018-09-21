const { parse, stringify } = JSON

export function deepClone (object) {
  return parse(stringify(object))
}

export default function (Vue) {
  Vue.prototype.deepClone = deepClone
}
