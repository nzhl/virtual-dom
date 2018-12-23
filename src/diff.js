function diff (oldTree, newTree) {
  var index = 0
  var patches = {}
  dfsWalk(oldTree, newTree, index, patches)
  return patches
}

function dfsWalk (oldNode, newNode, index, patches) {
  var currentPatches = []

  if (newNode === null) {
    // node removed, nothing to do
  } else if (oldNode instanceof String && newNode instanceof String) {
    // text node changed
    if (newNode !== oldNode) {
      currentPatches.push({ type: 'TEXT_CHANGE', text: newNode })
    }
  } else if (oldNode.tagName === newNode.tagNode &&
    oldNode.key === newNode.key) {
    // same node. Only need to check
    // 1. props
    // 2. children
    var propsPatches = diffProps(oldNode, newNode)
    currentPatches.push({ type: 'PROPS_CHANGE', props: propsPatches })

    diffChildren(oldNode.children, newNode.children, index, patches, currentPatches)
  } else {
    // Nodes not the same, replace the old one with the new one
    currentPatches.push({ type: 'NODE_REPLACE', node: newNode })
  }

  if (currentPatches.length !== 0) {
    // all the patches for the node at current index
    patches[index] = currentPatches
  }
}

function diffProps (oldNode, newNode) {
  // only three kinds of changed
  // 1. changed
  // 2. removed
  // 3. added
  var oldProps = oldNode.props
  var newProps = newNode.props
  var propsPatches = {}
  var key, value

  // all the properties that has been changed or removed
  for (key in oldProps) {
    value = oldProps[key]
    if (newProps[key] !== value) {
      propsPatches[key] = newProps[key]
    }
  }

  // all the new added properties
  for (key in newProps) {
    value = newProps[key]
    if (!oldProps.hasOwnProperty(key)) {
      propsPatches[key] = newProps[value]
    }
  }

  return propsPatches
}

function diffChildren (oldNode, newNode) {

}
