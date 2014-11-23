var through = require('through')
  , streamline = require('streamline/lib/callbacks/transform')
  , SourceMapConsumer = require('source-map').SourceMapConsumer
  , SourceMapGenerator = require('source-map').SourceMapGenerator
  , path = require('path')

var re = /\._js$/

module.exports = function (file, options) {
  if (!re.test(file)) return through()

  options = options || {}

  var transformOptions =
    { 'callback': options.cb || options.callback
    , 'oldStyleFutures': options['old-style-futures'] || options.oldStyleFutures
    , 'promise': options.promise
    , 'sourceName': file
    , 'lines': 'sourcemap'
    }

  var buf = []
    , stream = through(write, end)

  return stream

  function write(chunk) {
    buf.push(chunk)
  }

  function end() {
    var source = buf.join('')
      , transformed = streamline.transform(source, transformOptions)
      , compiled = transformed.toStringWithSourceMap()
      , consumer = new SourceMapConsumer(compiled.map.toString())
      , generator = new SourceMapGenerator()

    generator.setSourceContent(file, source)

    consumer.eachMapping(function (mapping) {
      mapping.source = path.normalize(mapping.source || '')

      // Ignore mappings that are not from our source file
      if (!mapping.source || file !== mapping.source) return

      generator.addMapping(
        { original:
          { column: mapping.originalColumn
          , line: mapping.originalLine
          }
        , generated:
          { column: mapping.generatedColumn
          , line: mapping.generatedLine
          }
        , source: file
        , name: mapping.name
        }
      )
    })

    stream.queue(compiled.code)
    stream.queue('\n//@ sourceMappingURL=data:application/json;base64,')
    stream.queue(new Buffer(generator.toString()).toString('base64'))
    stream.queue(null)
  }
}
