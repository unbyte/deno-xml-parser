# XML Parser for Deno

## Usage

```typescript
import { Parser, unescapeEntity } from 'https://deno.land/x/xmlparser@v0.2.0/mod.ts'

const xml = Deno.readTextFileSync('/path/to/some.xml')

const parser = new Parser({
  // options
})
const root = parser.parse(xml)

// get children by route (only support finding by tag name)
root.find(['parent-tag', 'child-tag'])
  .forEach(node => console.log(node.toString()))

// get one child by tag name (the first one of this tag name)
root.getChild('tag')?.getValue('')

// get one child by index
root.getChild(0)?.getValue(0)

// unescape html entities in strings
unescapeEntity(root.getChild('content')?.getValue('') || '')
```

## Options

```typescript
export interface Options {
  // skip parsing some tags, default to false (comparison of tag names is after removing namespace if ignoreNamespace)
  ignoreTags: false | string[]
  // skip parsing some attributes, default to false (true means skip all attributes)
  ignoreAttrs: boolean | string[]
  // skip namespace in tag names and attributes, default to true
  ignoreNamespace: boolean

  // parse node value to string | number | boolean, default to true
  reflectValues: boolean
  // parse node attributes to string | number | boolean, default to true
  reflectAttrs: boolean

  // trim string values of tags, default to true
  trimValues: boolean
  // trim string values of attributes, default to true
  trimAttrs: boolean
}
```
