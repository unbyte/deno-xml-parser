# XML Parser for Deno

## Usage

```typescript
import { Parser } from 'https://deno.land/x/xmlparser@v0.1.1/mod.ts'

const xml = Deno.readTextFileSync('/path/to/some.xml')

const parser = new Parser({
  // options
})
const root = parser.parse(xml)

root.find(['parent-tag', 'child-tag'])
  .forEach(node => console.log(node.toString()))
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
