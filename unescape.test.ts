import { unescapeEntity } from './unescape.ts'
import { assert } from './utils.ts'

Deno.test('unescape', () => {
  const testCases = [
    {
      input: `
    &lt;h4 id=&#34;TOC_1.&#34;&gt;Thank you for the amazing response!&lt;/h4&gt;&#xA;  &lt;p&gt;In 2020, we had another great turnout with 9,648 responses, about &lt;a href=&#34;https://blog.golang.org/survey2020-results&#34; target=&#34;_blank&#34; rel=&#34;noopener&#34;&gt;as many as 2019&lt;/a&gt;
    `.trim(),
      expected: `
      <h4 id="TOC_1.">Thank you for the amazing response!</h4>
  <p>In 2020, we had another great turnout with 9,648 responses, about <a href="https://blog.golang.org/survey2020-results" target="_blank" rel="noopener">as many as 2019</a>
  `.trim(),
    },
  ]
  testCases.forEach(t => assert(unescapeEntity(t.input) === t.expected))
})
