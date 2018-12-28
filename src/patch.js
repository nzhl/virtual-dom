
export default function patch (node, patches) {
  dfsWalk(node, { index: 0 }, patches)
}

function dfsWalk (node, index, patches) {
  var currentPatches = patches[index.index]

  for (var i = 0; i < node.childNodes.length; ++i) {
    index.index++
    dfsWalk(node.childNodes[i], index, patches)
  }

  if (currentPatches) {
    applyPatches(node, currentPatches)
  }
}

function applyPatches (node, currentPatches) {
  for (var i in currentPatches) {
    switch (currentPatches[i].type) {
      case 'TEXT_CHANGE':
        node.textContent = currentPatches[i].text
        break
      case 'PROPS_CHANGE':
        var props = currentPatches[i].props
        for (var propName in props) {
          if (props[propName] === undefined) {
            node.removeAttribute(propName)
          } else {
            setAttribute(node, propName, props[propName])
          }
        }
        break
      case 'NODE_REPLACE':
        var newNode = (typeof currentPatches[i].node === 'string')
          ? document.createTextNode(currentPatches[i].node)
          : currentPatches[i].node.render()
        node.parentNode.replaceChild(newNode, node)
        break
      case 'NODE_REORDER':
        reorderChildren(node, currentPatches[i].moves)
        break
      default:
        throw new Error('Unknown patch type ' + currentPatches[i].type)
    }
  }
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

function reorderChildren (node, moves) {
  var realNodeList = []
  for (var i = 0; i < node.childNodes.length; ++i) {
    realNodeList.push(node.childNodes[i])
  }

  var keyNodeMap = {}
  for (i in realNodeList) {
    // https://blog.csdn.net/kkkkkxiaofei/article/details/52608394
    // nodeType === 1 => ELEMENT_NODE
    if (realNodeList[i].nodeType === 1) {
      var key = realNodeList[i].getAttribute('key')
      if (key !== undefined) {
        keyNodeMap[key] = realNodeList[i]
      }
    }
  }
  for (i in moves) {
    var move = moves[i]
    var index = move.index
    if (move.type === 'INSERT') {
      var insertNode = keyNodeMap[move.item.key]
        // reuse node, the node has been updated since dfs
        ? keyNodeMap[move.item.key].cloneNode(true)
        : (typeof move.item === 'object')
          ? move.item.render()
          : document.createTextNode(move.item)
      // https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
      // when insert the node is alreday existing
      // the node will be deleted in the original position
      // and be inserted to the new position
      node.insertBefore(insertNode, node.childNodes[index] || null)

      realNodeList.splice(index, 0, insertNode)
    } else if (move.type === 'REMOVE') {
      // only when `insertBefore` operations actually deletes node
      // will `realNodeList` and `node.childNodes` be inconsistent
      // if this is the case, do not need to delete element
      if (realNodeList[index] === node.childNodes[index]) {
        node.removeChild(node.childNodes[index])
      }
    }
  }
}
