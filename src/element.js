export default Element

/**
 * Virtual-dom Element.
 * @param {String} tagName
 * @param {Object} props - Element's properties,
 *                       - using object to store key-value pair
 * @param {Array<Element|String>} - This element's children elements.
 *                                - Can be Element instance or just a piece plain text.
 */
function Element (tagName, props, children) {
  this.tagName = tagName
  this.props = props || {}
  this.children = children || []
  this.key = this.props.key

  // the number of current node's children
  // excluding current node itself

  // could be useful when doing diff
  var count = 0
  for (var i in children) {
    var child = children[i]
    if (child instanceof Element) {
      count += child.count
    }
    count++
  }
  this.count = count
}

Element.prototype.render = function () {
  var el = document.createElement(this.tagName)
  var props = this.props
  for (var propName in props) {
    var propValue = props[propName]
    setAttribute(el, propName, propValue)
  }

  var children = this.children
  for (var index in children) {
    var childEl = (children[index] instanceof Element)
      ? children[index].render()
      : document.createTextNode(children[index])
    el.appendChild(childEl)
  }
  return el
}

function setAttribute (node, key, value) {
  // no need to using node.style.cssText
  // just use setAttribute is the same
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style
  if (key === 'value' &&
    (node.tagName === 'input' || node.tagName === 'textarea')) {
    // https://stackoverflow.com/a/36581696/5817139
    node.value = value
  } else {
    node.setAttribute(key, value)
  }
}
