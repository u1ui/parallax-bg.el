// todo resizeObserver?

const pool = new Set();

const paraxBg = {
    add(element){
        pool.add(element)
        pool.size === 1 && addListeners();
        //element.connect();
    },
    remove(element){
        pool.delete(element);
        //pool.size === 0 && removeListeners(); // todo
    },
    positionize(){
        //requestAnimationFrame(()=>{
            pool.forEach(item=>item.positionize());
        //});
    },
    layout(){
        pool.forEach(item=>item.layout());
    }
}

// cache dimensions. Is it worth it?
let pageY;
let winHeight;
let scrollHeight;
function setVPDimensions(){
    pageY = pageYOffset;
    winHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0); // was innerHeight, better this?: https://stackoverflow.com/questions/1248081/how-to-get-the-browser-viewport-dimensions
    scrollHeight = document.documentElement.scrollHeight;
}
setVPDimensions();

function addListeners(){
	addEventListener('DOMContentLoaded', paraxBg.layout);
	addEventListener('load', ()=>{
        paraxBg.layout();
        paraxBg.positionize();
    });
	document.addEventListener('scroll', ()=>{
        pageY = pageYOffset;
        requestAnimationFrame(()=>paraxBg.positionize()) // better!
    });
	addEventListener('wheel', ()=>{ // for firefox
        pageY = pageYOffset;
        requestAnimationFrame(()=>paraxBg.positionize())
    });

	addEventListener('resize', ()=>{
        setVPDimensions();
        paraxBg.layout();
        paraxBg.positionize();
    });
    const rs = new ResizeObserver(entries => {
        setVPDimensions();
        paraxBg.layout();
        paraxBg.positionize();
    })
    rs.observe(document.documentElement);
}

const style = document.createElement('style');
style.innerHTML =
    '.u1-parallax-bg-stage   { position:relative; } '+
    'parallax-bg         { position:absolute; top:0; bottom:0; left:0; right:0; z-index:-1; will-change:transform; background-size:cover; } '+
document.head.prepend(style);


class ParallaxBg extends HTMLElement {
    constructor() {
        super();
        let shadowRoot = this.attachShadow({mode:'open'});

        shadowRoot.innerHTML = `
        <style>
        :host {
            position:absolute;
            overflow:hidden;
            top:0; left:0; right:0; // todo if safari: inset
            bottom:-.2px;
            xz-index:-1;
            xwill-change:transform;
            xbackground-size:cover;
        }
        .mover {
            position:absolute;
            top:0; bottom:0; left:0; right:0;
            z-index:-1;
            xwill-change:transform;
            background: inherit;
        }
        .visible {
            display:flex;
            flex-direction:row;
            align-items:stretch;
            justify-content:center;
            position:absolute;
            top:0; bottom:0; left:0; right:0;
        }
        </style>
        <div class=mover part=_mover>
            <slot class=visible></slot>
        </div>
        `;

        this.mover   = this.shadowRoot.querySelector('.mover');
        this.visible = this.shadowRoot.querySelector('.visible');

        const style = getComputedStyle(this);
        const speed = style.getPropertyValue('--parallax-bg-speed');
        this.speed = speed === '' ? .5 : parseFloat(speed);
    }
	connectedCallback() {
        /*
        let stage = this.closest('.u1-parallax-bg-stage');
        if (!stage) {
            stage = this.parentNode;
            stage.setAttribute('parallax-bg-stage','');
        }
        */
        this.stage = this.offsetParent;
        if (this.stage.tagName === 'BODY') this.stage.style.position = 'relative'; // what can go wrong?

        scrollHeight = document.documentElement.scrollHeight; // todo: little slow

        this.layout();
        this.positionize();

        paraxBg.add(this);
    }
    disconnectedCallback(){
        paraxBg.remove(this);
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

        this.mover.style.top    = -offset + 'px';
        this.mover.style.bottom = -offset + 'px';

        // if the element cannot go further down or up
        // the [parallax-bg-visible] element
        // the most complicated part of the lib, seems to work well, but it was born by trial and error
        if (this.speed < 0) {
            console.warn('parallax-bg: parallax-bg-visible attribute is not implemented for speed < 0');
            return;
        }
        //const visibleEl = this.querySelector('[parallax-bg-visible]');
        const visibleEl = this.visible;
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
        this.mover.style.transform = 'translate3d(0, '+ this.offsetAtPageY(pageY) +'px, 0)';
    }
}

customElements.define('u1-parallax-bg', ParallaxBg)
