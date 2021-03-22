import { matchAttrs, MatchedFragment, matchFragments } from './regexp.ts'
import { reflectValue, removeNamespace } from './utils.ts'
import { Node } from './xml.ts'

export interface Options {
  // skip parsing some tags, default to false (comparison of tag names is after removing namespace if ignoreNamespace)
  ignoreTags: false | string[]
  // skip parsing some attributes, default to false (true means skip all attributes)
  ignoreAttrs: boolean | string[]
  // skip namespace in tag names and attributes
  ignoreNamespace: boolean

  // parse node value to string | number | boolean
  reflectValues: boolean
  // parse node attributes to string | number | boolean
  reflectAttrs: boolean

  // trim string values of tags
  trimValues: boolean
  // trim string values of attributes
  trimAttrs: boolean
}

const defaultOptions: Options = {
  ignoreTags: false,
  ignoreAttrs: false,
  ignoreNamespace: true,

  reflectValues: true,
  reflectAttrs: true,

  trimValues: true,
  trimAttrs: true,
}

export class Parser {
  public options: Options

  constructor(options: Partial<Options>) {
    this.options = {
      ...defaultOptions,
      ...options,
    }
  }

  parse(raw: string): Node {
    const ctx: ParseContext = new ParseContext(this.options)
    const matched = matchFragments(raw)
    for (const item of matched) {
      const fragment = item.groups as MatchedFragment
      if (fragment.tagStart) {
        // ignore namespace?
        const tag = ctx.options.ignoreNamespace
          ? removeNamespace(fragment.tagStart)
          : fragment.tagStart

        if (ctx.options.ignoreTags) {
          // is ignored tag?
          if (ctx.options.ignoreTagsSet.has(tag)) {
            if (fragment.selfEnd) continue
            ctx.pushIgnoringTag(tag)
          }
          // is inside a ignored tag?
          if (ctx.isIgnoring) continue
        }

        ctx.newNode(tag)
        const rawAttrs = fragment.attrs?.trim() || ''
        if (rawAttrs) parseAttrs(rawAttrs, ctx)
        if (fragment.selfEnd) ctx.doneNode()
        if (fragment.content) setNodeValue(fragment.content, ctx)
      } else if (fragment.tagEnd) {
        // ignore namespace?
        const tag = ctx.options.ignoreNamespace
          ? removeNamespace(fragment.tagEnd)
          : fragment.tagEnd

        if (ctx.options.ignoreTags) {
          // is ignored tag?
          if (ctx.isIgnoring) {
            if (ctx.options.ignoreTagsSet.has(tag)) ctx.popIgnoringTag(tag)
            continue
          }
        }

        // try match tag
        if (ctx.node.tag !== tag) {
          throw new Error(
            `unmatched close-tag near '${raw.substr(item.index!, 8)}'`,
          )
        }

        ctx.doneNode()
      } else if (fragment.cdata) {
        if (ctx.options.ignoreTags && ctx.isIgnoring) continue
        setNodeValue(fragment.cdata, ctx)
      } else if (fragment.prolog) {
        parseAttrs(fragment.prolog, ctx, true)
      } else {
        // won't implement for other fragments
      }
    }
    if (ctx.node !== ctx.root) throw new Error('XML format error')
    return ctx.root
  }
}

export class ParseContext {
  #node: Node
  readonly #root: Node

  #ignoringStack: string[] = []

  options: Options & {
    ignoreAttrsSet: Set<string>
    ignoreTagsSet: Set<string>
  }

  constructor(options: Options, root: Node = new Node('ROOT')) {
    this.#node = root
    this.#root = root
    this.options = {
      ...options,
      ignoreAttrsSet: new Set(
        options.ignoreAttrs === true ? [] : (options.ignoreAttrs || []),
      ),
      ignoreTagsSet: new Set(options.ignoreTags || []),
    }
  }

  get root() {
    return this.#root
  }

  get node() {
    return this.#node
  }

  get isIgnoring() {
    return this.#ignoringStack.length > 0
  }

  pushIgnoringTag(tag: string) {
    return this.#ignoringStack.push(tag)
  }

  popIgnoringTag(tag: string) {
    if (this.#ignoringStack.pop() !== tag) throw new Error('XML format error')
  }

  doneNode() {
    this.#node = this.node.parent || this.#root
  }

  newNode(tag: string): Node {
    const node = new Node(tag)
    node.parent = this.#node
    this.#node.addChildren(node)
    return this.#node = node
  }
}

export function parseAttrs(
  rawAttrs: string,
  ctx: ParseContext,
  useRoot: boolean = false,
) {
  if (ctx.options.ignoreAttrs === true) return
  const node = useRoot ? ctx.root : ctx.node
  const matched = matchAttrs(rawAttrs.trim())
  // [1] key [2] ?value
  for (const item of matched) {
    // is ignored
    if (ctx.options.ignoreAttrsSet.has(item[1])) return

    const key = ctx.options.ignoreNamespace ? removeNamespace(item[1]) : item[1]

    if (!key) return // only when key is `xmlns:`

    if (!item[2]) {
      // value is empty => a boolean attr
      node.setAttr(key, true)
      return
    }
    const value = ctx.options.reflectAttrs
      ? reflectValue(item[2])
      : ctx.options.trimAttrs
      ? item[2].trim()
      : item[2]
    node.setAttr(key, value)
  }
}

export function setNodeValue(value: string, ctx: ParseContext) {
  ctx.node.value = ctx.options.reflectValues
    ? reflectValue(value)
    : ctx.options.trimValues
    ? value.trim()
    : value
}
