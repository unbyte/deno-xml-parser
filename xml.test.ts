import { Parser } from './parser.ts'
import { assert } from './utils.ts'

Deno.test('find children', () => {
  const xml = Deno.readTextFileSync('./testdata/mozilla.feed.xml')

  const parser = new Parser({})
  const root = parser.parse(xml)
  assert(root.find(['rss', 'channel', 'item', 'title']).length === 10)
})

Deno.test('get child', () => {
  const xml = Deno.readTextFileSync('./testdata/mozilla.feed.xml')

  const parser = new Parser({})
  const root = parser.parse(xml)
  const s =
    root.getChild('rss')?.getChild('channel')?.getChild('item')?.getChild(
      'title',
    )?.getValue<string>() ||
    ''
  assert(s === 'Reinstating net neutrality in the US')
})
