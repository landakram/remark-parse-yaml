const map = require('unist-util-map');
const yaml = require('js-yaml');

const yamlPlugin = function(options) {
    options = options || {};

    function transformer(ast) {
        return map(ast, (node) => {
            if (node.type == "yaml") {
                var parsedValue = yaml.safeLoad(node.value, 'utf8');
                var newNode = Object.assign({}, node, { data: { parsedValue }});
                return newNode;
            } else {
                return node;
            }
        });
    }

    // Stringify for yaml
    const Compiler = this.Compiler

    if (Compiler != null) {
        const visitors = Compiler.prototype.visitors
        if (visitors) {
            visitors.yaml = function (node) {
                if (node.data && node.data.parsedValue) {
                    var yml = yaml.safeDump(node.data.parsedValue)
                    return `---\n${yml}---`
                }
            }
        }
    }

    return transformer;
}

module.exports = yamlPlugin
