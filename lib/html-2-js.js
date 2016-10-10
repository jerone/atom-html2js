'use babel'

export default (input, settings) => {
  if (typeof input !== 'string') return ''

  let output = []

  let sandbox = document.createElement('div')
  sandbox.innerHTML = input

  output = output.concat(elementsToStrings(sandbox, 0, 0))

  return output.join('\n\n')
}

function elementsToStrings (parent, level, parentIndex) {
  let output = []

  let parentVarName = 'document.body'
  if (level > 0) {
    parentVarName = uniqueVarName(parent, level - 1, parentIndex)
  }

  let index = 0
  Array.from(parent.childNodes).forEach(node => {
    let isNode = false

    switch (node.nodeType) {
      case window.Node.ELEMENT_NODE: {
        output.push(elementToStrings(node, level, index, parentVarName).join('\n'))
        isNode = true
        break
      }
      case window.Node.TEXT_NODE: {
        if (node.textContent.trim()) {
          output.push(textToStrings(node, level, index, parentVarName).join('\n'))
          isNode = true
        }
        break
      }
    }

    if (node.childNodes.length > 0) {
      output = output.concat(elementsToStrings(node, level + 1, index))
    }

    if (isNode) index++
  })

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

function textToStrings (node, level, index, parentVarName) {
  return [`${parentVarName}.appendChild(document.createTextNode('${node.textContent}'))`]
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
  let eventsHtml = []

  Array.from(node.attributes).sort().forEach(attribute => {
    const attr = attribute.name
    if (attr === 'class') {
      const classes = []
      for (const c of node.classList) {
        classes.push(`'${c}'`)
      }
      classListHtml = `${varName}.classList.add(${classes.join(', ')})`
    } else if (attr.startsWith('data-')) {
      const value = attributeValueToDataType(attribute.value)
      datasetsHtml.push(`${varName}.dataset.add('${attr.replace(/^data-/, '')}', ${value})`)
    } else if (attr.startsWith('on')) {
      eventsHtml.push(`${varName}.addEventListener('${attr.replace(/^on/, '')}', e => ${attribute.value})`)
    } else if (attr === 'checked') {
      attributesHtml.push(`${varName}.setAttribute('${attr}', true)`)
    } else {
      const value = attributeValueToDataType(attribute.value)
      attributesHtml.push(`${varName}.setAttribute('${attr}', ${value})`)
    }
  })

  if (classListHtml) output.push(classListHtml)
  if (attributesHtml.length > 0) output = output.concat(attributesHtml)
  if (datasetsHtml.length > 0) output = output.concat(datasetsHtml)
  if (eventsHtml.length > 0) output = output.concat(eventsHtml)

  return output
}

function attributeValueToDataType (value) {
  if (/^-?\d+$/.test(value.trim())) {
    return parseInt(value)
  }
  return `'${value}'`
}
