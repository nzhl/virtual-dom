/**
 * Diff two list in O(N).
 * @param {Array} oldList - Original List
 * @param {Array} newList - List After certain insertions, removes, or moves
 * @param {String} keyName - The attribute name which represents the unique key
 * @return {Object} - {moves: <Array>}
 *                  - moves is a list of actions that telling how to remove and insert
 */
export default function listDiff (oldList, newList, keyName) {
  var oldMap = makeKeyIndexMap(oldList, keyName)
  var newMap = makeKeyIndexMap(newList, keyName)

  // step to convert oldList to newList
  var moves = []

  // replace all the deleted nodes in the old list with null
  // replace all the old nodes with updated new one
  var children = []
  var i = 0
  var j = 0
  while (i < oldList.length) {
    // current node and its key
    var node = oldList[i]
    var nodeKey = node[keyName]
    if (nodeKey) {
      if (newMap.keyIndexMap[nodeKey] === undefined) {
        // there is no such node in the new list
        // push null as a placeholder
        children.push(null)
      } else {
        // find its corresponding new node
        // push the new node to the same position
        // detailed diff of node will undertake in
        // the diff algorithm. For this algorithm,
        // we only check the position changes.
        var newPos = newMap.keyIndexMap[nodeKey]
        children.push(newList[newPos])
      }
    } else {
      // a node without key
      // just use a new node (also without key) as placeholder
      // hence it's hard to reuse the node without key
      // that's why in React you get a warnning without
      // specifying a key.
      children.push(newMap.others[j++] || null)
    }
    i++
  }

  // Since children need to be returned
  // children2 will be used to simulate how can
  // operations be taken to convert old list to
  // the new one.
  var children2 = children.slice(0)
  i = 0
  while (i < children2.length) {
    if (children2[i] === null) {
      moves.push({ type: 'REMOVE', index: i })
      children2.splice(i, 1)
    } else {
      i++
    }
  }

  // now your aim is to convert children2
  // i.e. the old list without nodes should be deleted)
  // to the new list
  // i is cursor pointing to new list
  // j is cursor pointing to children2
  i = j = 0
  while (i < newList.length) {
    node = newList[i]
    nodeKey = node ? node[keyName] : undefined

    var oldNode = children2[j]
    var oldNodeKey = oldNode ? oldNode[keyName] : undefined

    if (!oldNode) {
      // children2[j] does not have node
      // i.e. has reached the end of children2
      // Only need to insert all the elements left
      // into children2 then we have new list
      // hence here just insert the next one
      moves.push({ type: 'INSERT', index: i, item: node })
    } else {
      if (nodeKey === oldNodeKey) {
        // in fact there are two situations
        // 1. two node with the same keys
        // 2. two node without keys
        j++
      } else {
        if (oldMap.keyIndexMap[nodeKey] === undefined) {
          // a new node, just insert it
          // but no need to actually insert to children2
          // hence j still points to the unchecked node
          moves.push({ type: 'INSERT', index: i, item: node })
        } else {
          // a node in the old list
          // it can either in the next pos or further
          if (children2[j + 1][keyName] === nodeKey) {
            // it is in the next pos
            moves.push({ type: 'REMOVE', index: i })
            children2.splice(j, 1)
            j++
          } else {
            // it is at least pos j + 2
            // push it directly
            // but no need to actually insert to children2
            // hence j still points to the unchecked node
            moves.push({ type: 'INSERT', index: i, item: node })
          }
        }
      }
    }
    i++
  }

  // all the nodes >= j now is unnecessary
  while (j < children2.length) {
    moves.push({ type: 'REMOVE', index: i })
    j++
  }

  return { moves, children }
}

// input
// - list -> [{id: "c"}, {id: "a"}, {id: "b"}, {name: "no-index"}, {id: "d"}]
// - keyName -> id
// output
// {
//   keyIndexMap: {'a': 1, 'b': 2, 'c': 0, 'd': 4}
//   others: {name: "no-index"}
// }
function makeKeyIndexMap (list, keyName) {
  var keyIndexMap = {}
  var others = []

  for (var i = 0; i < list.length; ++i) {
    var node = list[i]
    if (node[keyName]) {
      keyIndexMap[node[keyName]] = i
    } else {
      others.push(node)
    }
  }

  return { keyIndexMap, others }
}
