import Element from './src/element.js'
import diff from './src/diff.js'
import patch from './src/patch.js'

var oldTree = new Element('div', { 'id': 'container' }, [
  new Element('h1', { style: 'color: blue' }, ['simple virtal dom']),
  new Element('p', {}, ['Hello, virtual-dom']),
  new Element('ul', {}, [new Element('li', { key: '1' }, ['key: 1'])])
])

var newTree = new Element('div', { 'id': 'container' }, [
  new Element('h1', { style: 'color: red' }, ['simple virtal dom']),
  new Element('p', {}, ['Hello, virtual-dom']),
  new Element('ul', {}, [new Element('li', {}, ['no key']), new Element('li', { key: '1' }, ['key: 1'])])
])

var root = oldTree.render()
var body = document.getElementsByTagName('body')[0]
body.appendChild(root)

var reverse = false
document.getElementById('btn').onclick = () => {
  var patches = reverse
    ? diff(newTree, oldTree)
    : diff(oldTree, newTree)
  console.log(patches)
  patch(root, patches)
  reverse = !reverse
}
