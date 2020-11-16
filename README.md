# parax-bg
Highly fantastic Parallax backgrounds

## Features
- fast!
- easy, declarative API
- works for dynamic added elements
- optional element [bg-parax-visible], with only the reachable area
- light weight ~4KB

## Demos 
- different speeds  
https://raw.githack.com/nuxodin/parax-bg/master/tests/speed.html
- reachable area [bg-parax-visible]  
https://raw.githack.com/nuxodin/parax-bg/master/tests/visible.html
- demo  
https://raw.githack.com/nuxodin/parax-bg/master/tests/demo.html



## Ussage

Add the attribute "parax-bg" to the element that should be the background of its parent. It will be absolute positionized and its parent relative.

```js
import 'https://cdn.jsdelivr.net/gh/nuxodin/parax-bg@2.0.0/parax-bg.min.js';
```

```html
<link rel=stylesheet href="https://cdn.jsdelivr.net/gh/nuxodin/parax-bg@2.0.0/parax-bg.min.css">

<div parax-bg-stage>

    <h1> Content </h1>

    <div parax-bg style="background-image:url(bg.jpg)" style="--parax-bg-speed:.7">
        <div parax-bg-visible>
            I am the reachable part
        </div>
    </div>
    
</div>
```

The stylesheet and the attribute "parax-bg-stage" on the parent element are optional, but are highly recommended to add the styles before the script is loaded or when Javascript is disabled or the browser is not supported (IE11).


# Also interesting
Parallax scrolling Elements (not Backgrounds)
https://github.com/nuxodin/parax
