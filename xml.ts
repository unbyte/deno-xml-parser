import { objToPairArray } from './utils.ts'

export type ReflectedTypes = string | number | boolean

export type NodeChildren = Node[]
export type NodeAttr = Record<string, ReflectedTypes>

export class Node {
  constructor(
    public readonly tag: string,
    public value?: ReflectedTypes,
    public parent: Node | null = null,
    public attr: NodeAttr = {},
    public children: NodeChildren = [],
  ) {
  }

  addChildren(node: Node) {
    this.children.push(node)
  }

  setAttr(key: string, value: ReflectedTypes) {
    this.attr[key] = value
  }

  getAttr(key: string): ReflectedTypes | undefined {
    return this.attr[key]
  }

  getValue<T extends ReflectedTypes>(): T {
    return this.value as T
  }

  getChild(idx: number): Node | null
  getChild(tag: string): Node | null
  getChild(arg: string | number): Node | null {
    if (typeof arg === 'string') {
      return this.children.find(n => n.tag === arg) || null
    }
    return this.children[arg] || null
  }

  getChildren(tag: string) {
    return this.children.filter(c => c.tag === tag)
  }

  find(route: string[]): Node[] {
    let layer: Node[] = [this]
    for (const tag of route) {
      layer = layer.map(l => l.getChildren(tag)).flat()
    }
    return layer
  }

  toString(padding: number = 0) {
    const attrPairs = objToPairArray(this.attr)
    console.log(
      '\t'.repeat(padding),
      `<${this.tag}${
        attrPairs.length
          ? ` ${attrPairs.map(p => `${p.key}="${p.value}"`).join(' ')}>`
          : '>'
      }`,
    )

    if (this.value !== undefined) {
      if (typeof this.value === 'string') {
        console.log(
          '\t'.repeat(padding + 1),
          this.value.substr(0, 40).replaceAll(/\s/g, ' '),
        )
      } else {
        console.log('\t'.repeat(padding + 1), this.value)
      }
    } else {
      this.children.forEach(c => c.toString(padding + 1))
    }
    console.log('\t'.repeat(padding), `</${this.tag}>`)
  }
}
