# node-imagemagick

[Imagemagick](http://www.imagemagick.org/) module for [Node](http://nodejs.org/).

> Note: This code has been unmaintained for a long time. Please consider using the [gm module](https://github.com/aheckmann/gm) instead.

You can install this module using [npm](http://github.com/isaacs/npm):

    npm install zyn-imagemagick

Requires imagemagick CLI tools to be installed. There are numerous ways to install them. For instance, if you're on OS X you can use [Homebrew](http://mxcl.github.com/homebrew/): `brew install zyn-imagemagick`.

## Example

```javascript
var im = require('zyn-imagemagick');
im.readMetadata('kittens.jpg', function(err, metadata){
  if (err) throw err;
  console.log('Shot at '+metadata.exif.dateTimeOriginal);
})
// -> Shot at Tue, 06 Feb 2007 21:13:54 GMT
```

## API

### convert.path

Path to the `convert` program. Defaults to `"convert"`.

### identify.path

Path to the `identify` program. Defaults to `"identify"`.

### identify(path, callback(err, features))

Identify file at `path` and return an object `features`.

Example:

```javascript
im.identify('kittens.jpg', function(err, features){
  if (err) throw err;
  console.log(features);
  // { format: 'JPEG', width: 3904, height: 2622, depth: 8 }
});
```

### identify(args, callback(err, output))

Custom identification where `args` is an array of arguments. The result is returned as a raw string to `output`.

Example:

```javascript
im.identify(['-format', '%wx%h', 'kittens.jpg'], function(err, output){
  if (err) throw err;
  console.log('dimension: '+output);
  // dimension: 3904x2622
});
```

### readMetadata(path, callback(err, metadata))

Read metadata (i.e. exif) in `path` and return an object `metadata`. Modelled on top of `identify`.

Example:

```javascript
im.readMetadata('kittens.jpg', function(err, metadata){
  if (err) throw err;
  console.log('Shot at '+metadata.exif.dateTimeOriginal);
  // -> Shot at Tue, 06 Feb 2007 21:13:54 GMT
});
```

### convert(args, callback(err, stdout, stderr))

Raw interface to `convert` passing arguments in the array `args`.

Example:

```javascript
im.convert(['kittens.jpg', '-resize', '25x120', 'kittens-small.jpg'], 
function(err, stdout){
  if (err) throw err;
  console.log('stdout:', stdout);
});
```

### resize(options, callback(err, stdout, stderr))

Convenience function for resizing an image, modelled on top of `convert`.

The `options` argument have the following default values:

```javascript
{
    srcPath: null,
    srcData: null,
    srcFormat: null,
    dstPath: null,
    quality: 0.8,
    format: 'jpg',
    progressive: false,
    colorspace: null,
    width: 0,
    height: 0,
    percent: 0, 
    area_total_pixels: 0, 
    resize_operation: 0,
    strip: true,
    filter: 'Lagrange',
    sharpening: 0.2,
    customArgs: [],
    timeout: 0
}
```
`resize_operation` have the below operations. Please see this for detail: 
**http://www.imagemagick.org/Usage/resize/#liquid-rescale**

Serial No. | operation | documentation
--- | --- | ---
0 | standard operation | `convert dragon.gif -resize 64x64 resize_dragon.gif`
1 | Ignore Aspect Ratio | `convert dragon.gif -resize 64x64\! exact_dragon.gif`
2 | Only Shrink Larger Images ('>' flag) | `convert dragon.gif -resize 64x64\> shrink_dragon.gif`
3 | Only Enlarge Smaller Images ('<' flag) | The most notable use is with a argument such as '1x1<'. This resize argument will never actually resize any image. In other words it's a no-op, which will allow you to short circuit a resize operation in programs and scripts which always uses "-resize". Other than that you probably do not actually want to use this feature.
4 | Fill Area Flag ('^' flag) | `convert dragon.gif -resize 64x64^ fill_dragon.gif`
5 | Percentage Resize ('%' flag) |  `convert dragon.gif -resize 50% half_dragon.gif`. You will have to use param `percent` from the options in between 0 and 100
6 | Resize using a Pixel Area Count Limit ('@' flag) | `convert dragon.gif -resize 4096@ pixel_dragon.gif`
7 | Resize During Image Read | `convert dragon.gif'[64x64]' read_dragon.gif` You will have to use param `area_total_pixels` from the options in between 0 and the max value that 


srcPath, dstPath and (at least one of) width and height are required. The rest is optional. The size is normally set to be `resize_aspect_ratio` as true for make the proportional resize operation.

Example:

```javascript
im.resize({
  srcPath: 'kittens.jpg',
  dstPath: 'kittens-small.jpg',
  width:   256
}, function(err, stdout, stderr){
  if (err) throw err;
  console.log('resized kittens.jpg to fit within 256x256px');
});
```

Example with stdin/stdout:

```javascript
var fs = require('fs');
im.resize({
  srcData: fs.readFileSync('kittens.jpg', 'binary'),
  width:   256
}, function(err, stdout, stderr){
  if (err) throw err
  fs.writeFileSync('kittens-resized.jpg', stdout, 'binary');
  console.log('resized kittens.jpg to fit within 256x256px')
});
```

### crop(options, callback) ###
Convenience function for resizing and cropping an image. _crop_ uses the resize method, so _options_ and _callback_ are the same. _crop_ uses _options.srcPath_, so make sure you set it :) Using only _options.width_ or _options.height_ will create a square dimensioned image.  Gravity can also be specified, it defaults to Center.   Available gravity options are [NorthWest, North, NorthEast, West, Center, East, SouthWest, South, SouthEast]

Example:

```javascript
im.crop({
  srcPath: path,
  dstPath: 'cropped.jpg',
  width: 800,
  height: 600,
  quality: 1,
  gravity: "North"
}, function(err, stdout, stderr){
  // foo
});
```

### GIF support ###
just add `gif` as the format option in `options`

```
options = {format: "gif"}
```

### SVG spport ###

Fixed (identify) parse could resolve multiline value
```svg
  
Clipping path: 
<?xml version="1.0" encoding="iso-8859-1"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1565" height="2319">
<g>
<path fill-rule="evenodd" style="fill:#00000000;stroke:#00000000;stroke-width:0;stroke-antialiasing:false" d="
M 0.218931 0.248387
L 1564.75 0.248387
L 1564.75 2319
L 0.218931 2319
L 0.218931 0.248387 Z
"/>
</g>
</svg>

```

Further tweaks that is worth to check out for memory management.

** http://stackoverflow.com/questions/27917851/broken-results-on-batch-convert-with-imagemagick-command-line-on-linux **

## License (MIT)

Copyright (c) 2010-2016 Zyntauri <https://zyntauri.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
