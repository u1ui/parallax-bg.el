# parallax-bg
Highly fantastic Parallax backgrounds

## Features
- fast!
- easy, declarative API
- works for dynamic added elements
- optional element [bg-parax-visible], with only the reachable area
- light weight ~4KB

## Demos 
- different speeds  
https://raw.githack.com/nuxodin/parallax-bg/master/tests/speed.html
- reachable area [bg-parax-visible]  
https://raw.githack.com/nuxodin/parallax-bg/master/tests/visible.html
- demo  
https://raw.githack.com/nuxodin/parallax-bg/master/tests/demo.html



## Ussage

Add the attribute "parallax-bg" to the element that should be the background of its parent. It will be absolute positionized and its parent relative.

```js
import 'https://cdn.jsdelivr.net/gh/nuxodin/parallax-bg@2.0.0/parallax-bg.min.js';
```

```html
<link rel=stylesheet href="https://cdn.jsdelivr.net/gh/nuxodin/parallax-bg@2.0.0/parallax-bg.min.css">

<div class=u1-parallax-bg-stage>

    <h1> Content </h1>

    <u1-parallax-bg style="background-image:url(bg.jpg)" style="--parallax-bg-speed:.7">
        I am the reachable part
    </div>
    
</div>
```

The stylesheet and the attribute "parallax-bg-stage" on the parent element are optional, but are highly recommended to add the styles before the script is loaded or when Javascript is disabled or the browser is not supported (IE11).


# Also interesting
Parallax scrolling Elements (not Backgrounds)
https://github.com/nuxodin/parax
