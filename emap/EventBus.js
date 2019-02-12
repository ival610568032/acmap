
import * as zrUtil from 'zrender/src/core/util';
import Eventful from 'zrender/src/mixin/Eventful';
import EventModel from './config/EventModel';

function EventBus(this) {
    Eventful.call(this);

    this.MOUSE_EVENT_NAMES = [
        'click', 
        'dblclick', 
        'mouseover', 
        'mouseout', 
        'mousemove',
        'mousedown', 
        'mouseup',
        'globalout', 
        'contextmenu'
    ];

    this._zr = this.getZr();
  
    this.initEvent();
}

EventBus.prototype = {
    initEvent() {
        this.MOUSE_EVENT_NAMES.forEach(eventname => {
            this._zr.on(eventname, this.mouseHandler.bind(this));          
        });
    },

    dispose() {
        this.MOUSE_EVENT_NAMES.forEach(eventname => {
            this._zr.off(eventname, this.mouseHandler.bind(this));          
        });
    },

    mouseHandler(e) {
        // this.trigger(eventname, new EventModel(e));
    },

    includes(eventname) {
        return this.MOUSE_EVENT_NAMES.includes(eventname);
    }
}

zrUtil.mixin(EventBus, Eventful);

export default EventBus