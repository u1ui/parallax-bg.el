import 'https://unpkg.com/wicked-elements@3.1.1/min.js';

// todo resizeObserver?

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
        requestAnimationFrame(()=>{
            pool.forEach(item=>item.positionize());
        });
    },
    layout(){
        pool.forEach(item=>item.layout());
    }
}

// cache dimensions. Is it worth it?
let pageY = pageYOffset;
let winHeight = innerHeight;
let scrollHeight = document.documentElement.scrollHeight;

function addListeners(){
	addEventListener('DOMContentLoaded', paraxBg.layout);
	addEventListener('load', ()=>{
        paraxBg.layout();
        paraxBg.positionize();
    });
	document.addEventListener('scroll', ()=>{
        pageY = pageYOffset;
        paraxBg.positionize();
    });
	addEventListener('resize', ()=>{
        pageY = pageYOffset;
        winHeight = innerHeight;
        scrollHeight = document.documentElement.scrollHeight;
        paraxBg.layout();
        paraxBg.positionize();
    });
}

const style = document.createElement('style');
style.innerHTML =
    '[parax-bg-stage]   { position:relative; overflow:hidden; z-index:0; transform:translate3d(0,0,0); } '+
    '[parax-bg]         { position:absolute; top:0; bottom:0; left:0; right:0; z-index:-1; will-change:transform; background-size:cover; } '+
    '[parax-bg-visible] { position:absolute; top:0; bottom:0; left:0; right:0; background-size:cover; } '
document.head.prepend(style);

class Item {
    constructor(element){
        this.bg = element;
        const style = getComputedStyle(element);
        const speed = style.getPropertyValue('--parax-bg-speed');
        this.speed = speed === '' ? .5 : parseFloat(speed);
    }
    connect(){
        let stage = this.bg.closest('[parax-bg-stage]');
        if (!stage) {
            stage = this.bg.parentNode;
            stage.setAttribute('parax-bg-stage','');
        }
        this.stage = stage;
        this.layout();
        this.positionize();
    }
    layout(){
        const rect = this.stage.getBoundingClientRect();
        this.stageRect = { // todo: add border-width
            top:    pageY + rect.top,
            bottom: pageY + rect.bottom,
            height: rect.height,
            yCenter: (rect.top + pageY) + rect.height/2,
        };

        // calculate offset if stage is on top
        let relevantTop = this.stageRect.top;

        // if its faster then normal, calculate offset on bottom of stage
        if (this.speed > 1) relevantTop += this.stageRect.height;

        let offset = this.offsetAtPageY(relevantTop);
        offset = Math.abs(offset);

        // if it moves the opposite, add the stage height to the offset
        if (this.speed < 0) offset += (-this.speed * this.stageRect.height);

        this.bg.style.top    = -offset + 'px';
        this.bg.style.bottom = -offset + 'px';

        // if the element cannot go further down or up
        // the [parax-bg-visible] element
        // the most complicated part of the lib, seems to work well, but it was born by trial and error
        if (this.speed < 0) {
            console.warn('parax-bg: parax-bg-visible attribute is not implemented for speed < 0');
            return;
        }
        const visibleEl = this.bg.querySelector('[parax-bg-visible]');
        if (visibleEl) {
            let top = 0;
            let bottom = 0;
            const offsetAtElTop    = this.offsetAtPageY(this.stageRect.top);
            const offsetAtTop      = this.offsetAtPageY(0);
            const offsetAtElBottom = this.offsetAtPageY(this.stageRect.bottom - winHeight);
            const offsetAtBottom   = this.offsetAtPageY(scrollHeight - winHeight);
            if (this.speed < 1) {
                top    = Math.min(offsetAtElTop, offsetAtBottom);
                bottom = Math.max(offsetAtTop, offsetAtElBottom);
            }
            if (this.speed > 1) {
                top    = Math.max(offsetAtTop, -offsetAtElBottom);
                bottom = Math.min(-offsetAtElTop, offsetAtBottom);
            }
            visibleEl.style.top    = offset - top  + 'px';
            visibleEl.style.bottom = offset + bottom + 'px';
        }
    }
    offsetAtPageY(pageY){
        const moved = this.stageRect.yCenter - (pageY + winHeight/2);
        return moved*(this.speed-1);
    }
    positionize(){
        this.bg.style.transform = 'translate3d(0, '+ this.offsetAtPageY(pageY) +'px, 0)';
    }
}

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
    }
);
