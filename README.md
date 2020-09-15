# parax-bg
Parallax backgrounds

## features
- fast!
- easy API
- works for dynamic added elements
- very lightweight

## demo 
https://rawcdn.githack.com/nuxodin/parax-bg/67f879d647467e6a65b08f0e7f8552aa17b740db/tests/demo.html


## ussage:

Add the attribute "parax-bg" to the element that should be the background of its parent. It will be absolute positionized

```js
import 'https://cdn.jsdelivr.net/gh/nuxodin/parax-bg@1.0.0/parax.min.js';
```

```html
<link rel=stylesheet href="https://cdn.jsdelivr.net/gh/nuxodin/parax-bg@1.0.0/parax-bg.min.js">

<div class="parax-bg-vp" style="--parax-speed:2">

    <h1> Content </h1>

    <div parax-bg style="background-image:url(bg.jpg)"></div>
    
</div>
```

The stylesheet and the class "parax-bg-vp" on the parent element (the viewport) are optional, but are highly recommended to add the styles before the script is loaded or when Javascript is disabled or the browser is not supported (IE11).
