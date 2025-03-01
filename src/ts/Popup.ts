import PopupOptions from "./PopupOptions";

export default class Popup {
    // show
    opacity = '1';
    private parent: HTMLDivElement;
    private custom_html: any;
    private title: any;
    private subtitle: any;
    private pointer: any;

    constructor(parent: HTMLDivElement, custom_html: HTMLElement) {
        this.parent = parent;
        this.custom_html = custom_html;
        this.make();
    }

    make() {
        this.parent.innerHTML = `
            <div class="title"></div>
            <div class="subtitle"></div>
            <div class="pointer"></div>
        `;

        this.hide();

        this.title = this.parent.querySelector('.title');
        this.subtitle = this.parent.querySelector('.subtitle');
        this.pointer = this.parent.querySelector('.pointer');
    }

    show(options: PopupOptions, gantt_height: number) {
        if (!options.target_element) {
            throw new Error('target_element is required to show popup');
        }
        if (!options.position) {
            options.position = 'left';
        }
        const target_element = options.target_element;

        if (this.custom_html) {
            let html = this.custom_html(options.task);
            html += '<div class="pointer"></div>';
            this.parent.innerHTML = html;
            this.pointer = this.parent.querySelector('.pointer');
        } else {
            // set data
            this.title.innerHTML = options.title;
            this.subtitle.innerHTML = options.subtitle;
            this.parent.style.width = this.parent.clientWidth + 'px';
        }

        // set position
        let position_meta: DOMRect;
        if (target_element instanceof HTMLElement) {
            position_meta = target_element.getBoundingClientRect();
        } else if (target_element instanceof SVGElement) {
            position_meta = options.target_element.getBBox();
        }

        if (options.position === 'left' || options.position !== `right`) {
            this.parent.style.left = position_meta.x + (position_meta.width + 10) + 'px';
        } else {
            this.parent.style.right = position_meta.x + (position_meta.width + 10) + 'px';
        }

        if (position_meta.y + this.parent.offsetHeight > gantt_height) {
            this.parent.style.top = (position_meta.y + position_meta.height - this.parent.offsetHeight) + 'px';
            this.pointer.style.bottom = '2px';
            this.pointer.style.top = '';
        } else {
            this.parent.style.top = position_meta.y + 'px';
            this.pointer.style.bottom = '';
            this.pointer.style.top = '2px';
        }

        this.pointer.style.transform = 'rotateZ(90deg)';
        this.pointer.style.left = '-7px';
        this.parent.style.opacity = '1';
    }

    hide() {
        this.parent.style.opacity = '0';
        this.parent.style.left = '0';
    }
}