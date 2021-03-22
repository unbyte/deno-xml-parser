# XML Parser for Deno

## Usage

```typescript
import { Parser } from 'https://deno.land/x/xmlparser@v0.1.2/mod.ts'

const xml = Deno.readTextFileSync('/path/to/some.xml')

const parser = new Parser({
  // options
})
const root = parser.parse(xml)

// get children by route (only support finding by tag name)
root.find(['parent-tag', 'child-tag'])
  .forEach(node => console.log(node.toString()))

// get one child by tag name (the first one of this tag name)
root.getChild('tag')?.getValue<string>()

// get one child by index
root.getChild(0)?.getValue<number>()
```

## Options

```typescript
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
```
