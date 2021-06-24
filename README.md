# parallax-bg
Highly fantastic Parallax backgrounds

## Features
- fast!
- easy, declarative API
- works for dynamic added elements
- reduced background-container to the reachable area!
- light weight

## Demos 
- different speeds  
https://raw.githack.com/nuxodin/parallax-bg/master/tests/speed.html
- reachable area [bg-parax-visible]  
https://raw.githack.com/nuxodin/parallax-bg/master/tests/visible.html
- demo  
https://raw.githack.com/nuxodin/parallax-bg/master/tests/demo.html



## Ussage

Create a element "u1-parallax-bg". It will be the parallax background of the closest element with the class `u1-parallax-bg-stage` or the closest positioned element (offsetParent).

```js
import 'https://cdn.jsdelivr.net/gh/u1ui/parallax-bg.el@3.0.0/parallax-bg.min.js';
```

```html
<link rel=stylesheet href="https://cdn.jsdelivr.net/gh/u1ui/parallax-bg.el@3.0.0/parallax-bg.min.css">

<div class=u1-parallax-bg-stage>

    <h1> Content </h1>

    <u1-parallax-bg style="background-image:url(bg.jpg)" style="--parallax-bg-speed:.7">
        <img src="myCat.jpg" style="position:absolute; inset:0">
    </div>
    
</div>
```

The stylesheet and the class `parallax-bg-stage` on the parent element are optional, but are highly recommended to add the styles before the script is loaded or when Javascript is disabled or the browser is not supported (IE11).


# Also interesting
Parallax scrolling Elements (not Backgrounds)
https://github.com/u1ui/parallax.attr

