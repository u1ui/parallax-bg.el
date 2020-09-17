import 'https://unpkg.com/wicked-elements@3.1.1/min.js';


const pool = new Map();

const paraxBg = {
    add(element, item){
        pool.set(element, item)
        pool.size === 1 && addListeners();
        item.connect();
    },
    remove(element){
        pool.delete(element);
        //pool.size === 0 && removeListeners(); // todo
    },
    positionize(){
        requestAnimationFrame(function(){
            pool.forEach(function(item){
                item.positionize();
            })
        });
    },
    calcViewportRect(){
        pool.forEach(function(item){
            item.calcViewportRect();
        })
    }
}

let pageY = pageYOffset;

function addListeners(){
	addEventListener('resize',paraxBg.calcViewportRect);
	addEventListener('DOMContentLoaded',paraxBg.calcViewportRect);
	addEventListener('load',paraxBg.calcViewportRect);
	addEventListener('resize', paraxBg.positionize);
	addEventListener('load', paraxBg.positionize);
	document.addEventListener('scroll', function(e){
        pageY = pageYOffset;
        paraxBg.positionize();
    });
}

const style = document.createElement('style');
style.innerHTML =
'[parax-bg] { position:absolute; top:0; bottom:0; left:0; right:0; z-index:-1; will-change:transform; background-size:cover; } '+
'.parax-bg-vp { position:relative; overflow:hidden; z-index:0; transform:translate3d(0,0,0); } '+
document.head.prepend(style);

class Item {
    constructor(element){
        let offset = getComputedStyle(element).getPropertyValue('--parax-bg-offset');
        if (offset === '') offset = 100;
        else offset = parseInt(offset);
        this.bg = element;
        this.offset = offset;
        this.bg.style.top    = - offset + 'px';
        this.bg.style.bottom = - offset + 'px';
    }
    connect(){
        this.viewport = this.bg.parentNode;
        this.viewport.classList.add('parax-bg-vp');
	this.calcViewportRect();
    }
    calcViewportRect(){
        var rect = this.viewport.getBoundingClientRect();
        this.cachedViewportRect = {
            top: rect.top + pageY,
            height: rect.height,
        };
    }
    positionize(){
	var part = this.partVisible();
	//if (part < -0.1 || part > 1.1) return;
        var faktor = (part - .5)*2; // -1 bis 1;
        var value = faktor*(this.offset);
        this.bg.style.transform = 'translate3d(0, '+value+'px, 0)';
    }
    partVisible(){
	var rect = this.cachedViewportRect;
	var totalPixels = winHeight - rect.height;
	var activePixel = winHeight - (rect.top + rect.height - pageY);
	return activePixel / totalPixels; // 0 = element at the bottom, 1 = element at the top
    }
}


// cache innerHeight, bringt das was?
var winHeight = innerHeight;
addEventListener('resize',function(){
    winHeight = innerHeight;
})


wickedElements.define(
    '[parax-bg]', {
        init() {
            this.paraxBg = new Item(this.element);
		},
        connected() {
            paraxBg.add(this.element, this.paraxBg);
        },
        disconnected() {
            paraxBg.remove(this.element);
        },
        //observedAttributes: ['parax-bg'],
        //attributeChanged(name, oldValue, newValue) {},
    }
);
