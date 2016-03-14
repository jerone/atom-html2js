'use babel'

export default (input, settings) => {
  let output = []

  let sandbox = document.createElement('div')
  sandbox.innerHTML = input

  output = output.concat(elementsToStrings(sandbox.children, 0))

  return output.join('\n\n')
}

function elementsToStrings (nodes, level) {
  let output = []

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    output.push(elementToStrings(node, level, i).join('\n'))

    if (node.children.length > 0) {
      output = output.concat(elementsToStrings(node.children, level + 1))
    }
  }

  return output
}

function elementToStrings (node, level, index) {
  let output = []

  const varName = uniqueVarName(node, index)
  const tagName = node.tagName.toLowerCase()

  output.push(`const ${varName} = document.createElement('${tagName}')`)

  output = output.concat(attributesToStrings(node, varName))

  return output
}

function uniqueVarName (node, index) {
  const tagName = node.tagName.toLowerCase()
  const id = node.id
  const prefix = (id || tagName).replace(/[^a-zA-Z0-9$_]/g, '_')
  return prefix + '$' + index
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
