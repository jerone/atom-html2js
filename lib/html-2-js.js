'use babel'

export default (input, settings) => {
  let output = []

  let sandbox = document.createElement('div')
  sandbox.innerHTML = input

  output = output.concat(elementsToStrings(sandbox, 0, 0))

  return output.join('\n\n')
}

function elementsToStrings (parent, level, parentIndex) {
  let output = []

  const parentVarName = level === 0 ? 'document.body' : uniqueVarName(parent, level - 1, parentIndex)

  for (let index = 0; index < parent.children.length; index++) {
    const node = parent.children[index]
    output.push(elementToStrings(node, level, index, parentVarName).join('\n'))

    if (node.children.length > 0) {
      output = output.concat(elementsToStrings(node, level + 1, index))
    }
  }

  return output
}

function elementToStrings (node, level, index, parentVarName) {
  let output = []

  const varName = uniqueVarName(node, level, index)
  const tagName = node.tagName.toLowerCase()

  output.push(`const ${varName} = document.createElement('${tagName}')`)

  output = output.concat(attributesToStrings(node, varName))

  output.push(`${parentVarName}.appendChild(${varName})`)

  return output
}

function uniqueVarName (node, level, index) {
  const tagName = node.tagName.toLowerCase()
  const id = node.id
  const prefix = (id || tagName).replace(/[^a-zA-Z0-9$_]/g, '_')
  return prefix + '$' + level + '$' + index
}

function attributesToStrings (node, varName) {
  let output = []

  let classListHtml = ''
  let attributesHtml = []
  let datasetsHtml = []

  Array.prototype.slice.call(node.attributes).sort().forEach(function (attribute) {
    switch (attribute.name) {
      case 'class': {
        const classes = []
        for (let c of node.classList) {
          classes.push(`'${c}'`)
        }
        classListHtml = `${varName}.classList.add(${classes.join(', ')})`
        break
      }
      default: {
        if (attribute.value) {  // Only add attribute when it has an actual value
          if (attribute.name.startsWith('data-')) {
            datasetsHtml.push(`${varName}.dataset.add('${attribute.name.replace(/^data-/, '')}', '${attribute.value}')`)
          } else {
            attributesHtml.push(`${varName}.setAttribute('${attribute.name}', '${attribute.value}')`)
          }
        }
      }
    }
  })

  if (classListHtml) output.push(classListHtml)
  if (attributesHtml.length > 0) output = output.concat(attributesHtml)
  if (datasetsHtml.length > 0) output = output.concat(datasetsHtml)

  return output
}
