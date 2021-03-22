import { Parser } from './parser.ts'
import { assert } from './utils.ts'

Deno.test('benchmark', async () => {
  const xml = Deno.readTextFileSync('./testdata/mozilla.feed.xml')

  const parser = new Parser({})
  console.time('parse for 1,000 times')
  for (let i = 0; i < 1_000; i++) parser.parse(xml)
  console.timeEnd('parse for 1,000 times')
})

Deno.test('find children', async () => {
  const xml = Deno.readTextFileSync('./testdata/mozilla.feed.xml')

  const parser = new Parser({})
  const root = parser.parse(xml)
  assert(root.find(['rss', 'channel', 'item', 'title']).length === 10)
})

Deno.test('ignore tags', async () => {
  const xml = Deno.readTextFileSync('./testdata/mozilla.feed.xml')

  const parser = new Parser({
    ignoreTags: ['item'],
  })
  const root = parser.parse(xml)
  assert(root.find(['rss', 'channel', 'item']).length === 0)
})
