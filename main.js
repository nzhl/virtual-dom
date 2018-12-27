import Element from './src/element.js'
import diff from './src/diff.js'

var oldTree = new Element('div', { 'id': 'container' }, [
  new Element('h1', { style: 'color: blue' }, ['simple virtal dom']),
  new Element('p', {}, ['Hello, virtual-dom']),
  new Element('ul', {}, [new Element('li', { key: '1' })])
])

var newTree = new Element('div', { 'id': 'container' }, [
  new Element('h1', { style: 'color: red' }, ['simple virtal dom']),
  new Element('p', {}, ['Hello, virtual-dom']),
  new Element('ul', {}, [new Element('li'), new Element('li', { key: '1' })])
])

var patches = diff(oldTree, newTree)
console.log(patches)

// var root = el.render()
// var body = document.getElementsByTagName('body')[0]
// body.appendChild(root)
