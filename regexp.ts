const nameStartChar =
  ':A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD'
const nameChar = nameStartChar + '\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040'
const nameRegexp = `[${nameStartChar}][${nameChar}]*`

const fragmentsRegexp = [
  // Tag Start, Tag Start with Content, Tag Self-Closed
  `(?<tagStart>(?:NAME)(?::NAME)?)(?<attrs>[^>]*?)(?:(?<selfEnd>\\/>)|(?:>\\s*(?<content>[^<]+)?))`
    .replace(/NAME/g, nameRegexp),
  // Tag End
  `(?:\\/(?<tagEnd>NAME)\\s*>)(?:[^<]*)`
    .replace(/NAME/g, nameRegexp),
  // CDATA
  `(?:!\\[CDATA\\[(?<cdata>[\\s\\S]*?)\\]\\]>)`,
  // Doc Type
  `(?:!DOCTYPE\\s+(?<doctype>[^\\[>]*(?:\\[[^\\]]*?\\])?)\\s*>)`,
  // Conditional-Sections
  `(?:!\\[(?<cond>[\\s\\S]+?\\])\\]>)`,
  // Other Declaration: ELEMENT ATTLIST ENTITY
  `(?:!(?<decl>[^>]+)>)`,
  // Prolog or Doc Type Decl
  `(?:\\?xml\\s*(?<prolog>[\\s\\S]*?)\\?>)`,
  // PI
  `(?:\\?\\s*(?<pi>[\\s\\S]*?)\\?>)`,
  // Comment
  `(?<comment>!--[\\s\\S]*?-->)`,
]

const fragmentRegexp = new RegExp(`<(?:${fragmentsRegexp.join('|')})`, 'g')

export function matchFragments(raw: string) {
  return raw.replace(/\r\n?/g, '\n').matchAll(fragmentRegexp)
}

export interface MatchedFragment {
  tagStart?: string
  tagEnd?: string
  selfEnd?: string
  attrs?: string
  content?: string
  cdata?: string
  docType?: string
  cond?: string
  decl?: string
  prolog?: string
  pi?: string
  comment?: string
}

const attrsRegexp = /([^\s=]+)\s*(?:=\s*(?:['"])(.*?)(?:['"]))?/g

export function matchAttrs(raw: string) {
  return raw.replace(/\r?\n/g, ' ').matchAll(attrsRegexp)
}
