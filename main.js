import Element from './src/element.js'

var props = {
  style: 'width: 300px; height: 300px; background: red',
  class: 'hello world'
}
var h1 = new Element('h1', {}, ['world'])
var el = new Element('div', props, ['hello', h1])

var root = el.render()
var body = document.getElementsByTagName('body')[0]
body.appendChild(root)
