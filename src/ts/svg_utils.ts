export function $(expr, con) {
    return typeof expr === 'string' ? (con || document).querySelector(expr) : expr || null;
}

export function createSVG(tag: string, attrs): SVGElement {
    const svgElement: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (let attr in attrs) {
        if (attr === 'append_to') {
            const parent = attrs.append_to;
            parent.appendChild(svgElement);
        } else if (attr === 'innerHTML') {
            svgElement.innerHTML = attrs.innerHTML;
        } else {
            svgElement.setAttribute(attr, attrs[attr]);
        }
    }
    return svgElement;
}

export function animateSVG(svgElement: SVGElement, attr: string, from: number, to: number) {
    const animatedSvgElement = getAnimationElement(svgElement, attr, from, to);

    if (animatedSvgElement === svgElement) {
        // triggered 2nd time programmatically
        // trigger artificial click event
        const event = new Event('click', {
            bubbles: true, cancelable: true,
        });

        animatedSvgElement.dispatchEvent(event);
    }
}

export function getX(element: SVGElement): number {
    return parseInt(element.getAttribute('x'));
}

export function getY(element: SVGElement): number {
    return parseInt(element.getAttribute('y'));
}

export function getWidth(element: SVGElement): number {
    return parseInt(element.getAttribute('width'));
}

export function getHeight(element: SVGElement): number {
    return parseInt(element.getAttribute('height'));
}

export function getEndX(element: SVGElement): number {
    return getX(element) + getWidth(element);
}

function getAnimationElement(svgElement: SVGElement, attr: string, from: string | number, to: string | number, dur = '0.4s', begin = '0.1s') {
    const animEl: SVGAnimateElement = svgElement.querySelector('animate');
    if (animEl) {
        $.attr(animEl, null, {
            attributeName: attr, from, to, dur, begin: 'click + ' + begin, // artificial click
        });
        return svgElement;
    }

    const animateElement = createSVG('animate', {
        attributeName: attr, from, to, dur, begin, calcMode: 'spline', values: from + ';' + to, keyTimes: '0; 1', keySplines: cubic_bezier('ease-out'),
    });
    svgElement.appendChild(animateElement);

    return svgElement;
}

function cubic_bezier(name) {
    return {
        ease: '.25 .1 .25 1', linear: '0 0 1 1', 'ease-in': '.42 0 1 1', 'ease-out': '0 0 .58 1', 'ease-in-out': '.42 0 .58 1',
    }[name];
}

export function on(type: string, element: any, listener: (this: EventSource, event: EventSourceEventMap) => any, selector?: string): void;
export function on<K extends keyof GlobalEventHandlersEventMap>(type: K, element: any, listener: (this: EventSource, ev: GlobalEventHandlersEventMap[K]) => any, selector?: string): void;

export function on<K extends keyof GlobalEventHandlersEventMap>(event: GlobalEventHandlersEventMap[K], element: any, callback: (this: EventSource, ev: GlobalEventHandlersEventMap[K]) => any, selector?: string) {
    if (!selector) {
        element.addEventListener(event,callback);
    } else {
        $.delegate(element, event, selector, callback);
    }
}

$.on = (element, event, selector, callback) => {
    if (!callback) {
        callback = selector;
        element.addEventListener(event,callback);
    } else {
        $.delegate(element, event, selector, callback);
    }
};

$.delegate = (element, event, selector, callback) => {
    element.addEventListener(event, function (e) {
        const delegatedTarget = e.target.closest(selector);
        if (delegatedTarget) {
            e.delegatedTarget = delegatedTarget;
            callback.call(this, e, delegatedTarget);
        }
    });
};

$.attr = (element, attr, value) => {
    if (!value && typeof attr === 'string') {
        return element.getAttribute(attr);
    }

    if (typeof attr === 'object') {
        for (let key in attr) {
            $.attr(element, key, attr[key]);
        }
        return;
    }

    element.setAttribute(attr, value);
};
