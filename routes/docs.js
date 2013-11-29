var fs           = require('fs')
  , _            = require('lodash')
  , sectionNames = ["installation", "usage", "models", "instances", "associations", "migrations", "utils", "misc"]

exports.index = function(req, res) {
  var path     = 'docs/latest'
    , sections = []

  if (!req.param('version')) {
    res.redirect("/docs/latest", 301)
  } else if (!req.param('section')) {
    res.redirect("/docs/latest/" + sectionNames[0], 301)
  } else if (req.param('version') !== 'latest') {
    path = 'docs/.' + req.param('version') + '/views/' + path
  }

  sectionNames.forEach(function(sectionName) {
    var section = {
      permalink:   sectionName,
      title:       sectionName.charAt(0).toUpperCase() + sectionName.slice(1),
      subSections: readSubSections(path + '/' + sectionName),
    }

    section.url = "/docs/" + req.param('version') + "/" + section.permalink

    sections.push(section)
  })

  res.render(path + '/' + req.param('section'), {
    title:         'Documentation - ' + req.param('section').charAt(0).toUpperCase() + req.param('section').slice(1),
    version:       req.param('version'),
    permalink:     req.param('section'),
    sections:      sections,
    activeNavItem: 'docs',
    sidebarTitle:  'Documentation'
  })
}

// helpers


var readSubSections = function(path) {
  try {
    var content = fs.readFileSync(__dirname + '/../views/' + path + '.jade').toString()
      , result  = []

    content.split('\n').forEach(function(line) {
      if (_.contains(line, 'h3')) {
        var fragments = line.match(/h3#([^\s]+)\s(.+)/)
        result.push({
          anchor: fragments[1],
          text:   fragments[2]
        })
      }
    })

    return result
  } catch(e) {
    console.log('Unknown file: ', path)
    return []
  }
}
