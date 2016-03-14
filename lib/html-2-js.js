'use babel'

export default (input, settings) => {
  let output = ''

  let sandbox = document.createElement('div')
  sandbox.innerHTML = input

  for (let i = 0; i < sandbox.children.length; i++) {
    const node = sandbox.children[i]
    const tagName = node.tagName.toLowerCase()
    const varName = tagName + '_' + i

    let html = [`const ${varName} = document.createElement('${tagName}')`]

    let attributesHtml = []
    let classListHtml = ''
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

    if (classListHtml) html.push(classListHtml)
    if (attributesHtml.length > 0) html = html.concat(attributesHtml)
    if (datasetsHtml.length > 0) html = html.concat(datasetsHtml)

    output += html.join('\n')
  }

  return output
}
