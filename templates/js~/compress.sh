#!/bin/bash
cat wz_jsgraphics.js > comp.js
cat js.inheritance.js >> comp.js
cat jquery.simpleColor.mod.js >> comp.js
cat im.canvasClass.js >> comp.js
cat im.previewCanvasClass.js >> comp.js
cat im.areaClass.js >> comp.js
cat im.areaCircleClass.js >> comp.js
cat im.areaPolyClass.js >> comp.js
cat im.areaRectClass.js >> comp.js
java -jar ~/yuicompressor-2.4.2/build/yuicompressor-2.4.2.jar comp.js -o ../js/wizard.all.js.ycomp.js
rm comp.js