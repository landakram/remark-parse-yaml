const assert = require('assert');
const unified = require('unified')
const markdown = require('remark-parse')
const visit = require('unist-util-visit');

const yamlPlugin = require('../lib/index.js');

let processor = unified()
    .use(markdown, { gfm: true, footnotes: true, yaml: true })
    .use(yamlPlugin)

var input = `
---
Metadata: this is metadata
Tags:
    - one
    - two
---

# Heading 
`;

describe("remark-parse-yaml", () => {
    var ast = processor.parse(input);
    ast = processor.runSync(ast);

    it("parses yaml into parsedValue", () => {
        visit(ast, 'yaml', (node) => {
            assert.deepEqual(node.data.parsedValue, {
                'Metadata': 'this is metadata',
                'Tags': ['one', 'two']
            });
        });
    });
});
