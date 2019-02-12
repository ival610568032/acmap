

import * as zrUtil from 'zrender/src/core/util';
import Eventful from 'zrender/src/mixin/Eventful';
import Painter from './Painter';
import Model from './config/Model';
import View from './config/view';
import EventModel from './EventModel';
import EventBus from './EventBus';

 function updateProps(oldStatus, newStatus) {
    var diff = false;

    Object.keys(newStatus).forEach(key => {
        if (newStatus[key] && newStatus[key] !=  oldStatus[key]) {
            oldStatus[key] = newStatus[key];
            diff = true;
        }
    });

    return diff;
}

/**
 * 单个实例eMap
 */
function eMap(dom, opts, id) {
    this.EventNames = {
        click,
        contextmenu,
        render,
        dataloaded,
        dataupdated,
        statusLoaded,
        statusupdated,
        viewupdated
    }

    opts = opts || {};

    this._id = id;

    this._api = new ExtensionAPI(this);

    this._dom = dom;

    this._zr = zrender.init(dom, {
        renderer: opts.renderer || 'canvas',
        devicePixelRatio: opts.devicePixelRatio,
        width: opts.width,
        height: opts.height
    });

    /** 事件模块*/
    this._eventBus = new EventBus(this);

    /** 绘图模块*/
    this._painter = new Painter(this);

    /** 模型模块*/
    this._model = new Model(this);

    /** 原始数据*/
    this._map = {};

    /** 原始初始状态*/
    this._status = {};

    /** 设备数据字典（未进行model转换的数据）*/
    this._mapDevice = {};

    /** 设备状态字典（已进行model转换的数据）*/
    this._mapStatus = {};    
}

eMap.prototype = {
    getZr() {
        return this._zr;
    },

    getEventBus() {
        return this._eventBus
    },

    getModel() {
       return this._model;
    },
    
    getPainter() {
        return this._painter;
    },

    getId(){
        return this._id;
    },

    isDisposed = function () {
        return this._disposed;
    },

    resize(opts) {
        this._zr.resize(opts);
    },

    getDeviceListByType(type) {
        if (this._map && this._map.hasOwnProperty(type)) {
            return this._map[type];
        } else {
            return [];
        }
    },

    setDevice(map, callback) {
        [this._map, this._mapDevice, changeList]  =  callback(map, this._model);
        this._eventBus.trigger(this.EventNames.dataloaded, true);
    },

    setStatus = function (status, callback) {
        [this._status, this._mapStatus, changeList] = callback(status, this._model);
        this._eventBus.trigger(this.EventNames.statusLoaded, true);
    },

    updateDevice(list) {
        var changeList = [];

        if (list && list.length) {
            zrUtil.each(list, function(elem){
                let oldDevice = this._mapDevice[elem.code];
                let newDevice = this._model.getModelByType[elem.type].Device(elem);

                if (!oldDevice) {
                    this._mapDevice[elem.code] = newDevice;
                    changeList.push(newDevice);
                } else if (updateProps(oldDevice, newDevice)) {
                    changeList.push(oldDevice);
                }
                
            }, this);

            this._eventBus.trigger(this.EventNames.dataupdated, true);
        }
    },

    updateStatus(list) {
        var changeList = [];

        if (list && list.length) {
            zrUtil.each(list, function(elem){
                let oldStatus = this._mapStatus[elem.code];
                let newStatus = this._model.getModelByType[elem.type].Status(elem);

                if (!oldStatus) {
                    this._mapStatus[elem.code] = newStatus;
                    changeList.push(newStatus);
                } else if (updateProps(oldStatus, newStatus)) {
                    changeList.push(oldStatus);
                }
            }, this);

            this._eventBus.trigger(this.EventNames.statusLoaded, true);
        }
    },

    clear() {
        this._map = {};

        this._status = {};

        this._mapDevice = {};

        this._mapStatus = {};

        this._painter.clear();
    },

    dispose() {
        if (this._disposed) {
            return;
        }

        this._disposed = true;

        this._zr.dispose();
    },

    on(eventname, cb, context) {
        if (Object.values(EventNames).includes(eventname)) {
            this. _eventBus.on(eventname, cb, context);
        }
    },

    off (eventname, cb, context) {
        if (Object.values(EventNames).includes(eventname)) {
            this. _eventBus.off(eventname, cb, context);
        }
    },
}

/**
 * 多个实例集合 eMaps
 */
var idBase = new Date() - 0;

var DOM_ATTRIBUTE_KEY = '_echarts_instance_';

var eMaps = {
    instances: {},
    version: '3.3.2',
    dependencies: {
        zrender: '3.2.2'
    }
};

eMaps.prototype = {
    init(dom, opts) {
        var id = 'ec_' + idBase++;
        
        var emap = new eEap(dom, opts, id);
        
        dom.setAttribute && 
            dom.setAttribute(DOM_ATTRIBUTE_KEY, id);

        this.instances[id] = emap;
        
        return emap;
    },
    
    dispose(map) {
        if (zrUtil.isDom(map)) {
            map = emaps.getInstanceByDom(map);
        } else if (typeof map === 'string') {
            map = this.instances[map];
        }

        if ((map instanceof eMap) && !map.isDisposed()) {
            map.dispose();
            delete this.instances[map.getId()];
        }
    },

    getInstanceByDom = function (dom) {
        var key = dom.getAttribute(DOM_ATTRIBUTE_KEY);
        return this.instances[key];
    },

    getInstanceById = function (key) {
        return this.instances[key];
    }
};

export default eMaps;