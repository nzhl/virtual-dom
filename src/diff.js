function diff (oldTree, newTree) {
  // using index to tag each node in the oldTree
  // then in patch phrase we dfs the oldTree to
  // do necessary patch for each node according to
  // the index based patches.
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

function diffChildren (oldChildren, newChildren, index, patches, currentPatches) {
  var diffs = listDiff(oldChildren, newChildren, 'key')

  // should be the same as the oldChildren
  // except those children should be deleted
  // will become null.
  newChildren = diffs.children

  if (diffs.moves.length !== 0) {
    // diffs.moves indicates the steps to
    // convert oldChildren to the new One
    // children's reorder still belongs to parent's patches
    currentPatches.push({ type: 'NODE_REORDER', moves: diffs.moves })
  }

  // check the change inside each children
  var previousNode = null
  var currentNodeIndex = index
  for (var pos in oldChildren) {
    var oldChild = oldChildren[pos]
    var newChild = newChildren[pos]

    // calculate current index by sum up all the nodes
    // that have been visited
    currentNodeIndex = (previousNode && previousNode.count)
      ? currentNodeIndex + previousNode.count + 1
      : currentNodeIndex + 1
    dfsWalk(oldChild, newChild, currentNodeIndex, patches)

    previousNode = oldChild
  }
}

function listDiff () {

}
