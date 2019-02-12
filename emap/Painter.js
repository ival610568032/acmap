import * as zrUtil from 'zrender/src/core/util';
import Eventful from 'zrender/src/mixin/Eventful';
import BoundingRect from 'zrender/src/core/BoundingRect';
import View from './config/View';
import * as matrix from 'zrender/src/core/matrix';
import * as vector from 'zrender/src/core/vector';

function Painter(eMap) {
    Eventful.call(this);

    if (eMap) {
        this.init(eMap);

        var bind = zrUtil.bind;

        // render
    }
}

Painter.prototype = {
	init: function (eMap) {
        this._eMap = eMap;
        this._viewLayers = {};
        this._viewInstances = {};
        
        if (this._eMap.getModel()) {
            let mapModel = _model.getMapModel();
            
            Object.keys(mapModel, (key) => {
                let layer = mapModel[key].layer;
                if (!this._viewLayers[layer]) {
                    this._viewLayers[layer] =  new Group({ _levelName: layer })
                    this._eMap.getZr().add(this._viewLayers[layer]);    
                }

                this._viewInstances[key] = new View(levelName, this._eMap.getLoader());

                this._viewLayers[layer].add(this._viewInstances[key]);
            })
        }

        this.updateZrBoundingRect({ width: this._eMap.getZr().getWidth(), height: this._eMap.getZr().getHeight() });
        this._eMap.getZr().on('resize', this.updateZrBoundingRect, this);
        this._eMap.getEventBus().on(this._eMap.EventNames.render, this.render);
    },
    
    render(payload) {
		if (this._eMap.getLoader() && payload) {
			if (payload.devices && payload.devices.length) {
                zrUtil.each(list, function(elem){
                    this._viewInstances[elem._type].render(elem, repaint);
                },this);

			} else if (payload.dataZoom) {
                this.updateTransform(payload.dataZoom);
                
			} else if (payload.zrBoundingRect) {
				this.revisibleAll();
            }

            this.transformAll();

            this._eMap.getEventBus().trigger(this._eMap.EventNames.viewupdated, payload.updatedType);
        }
    },

    getShapeTipPoint(payload) {
        var view = this._viewInstances[payload.type];
		if (view) {
			var point = view.getShapeTipPoint(payload);
			if (point) {
				// 矩阵变换
				var transform = this.getTransform();
				var transPoint = vector.applyTransform([], [point.x, point.y], transform);
				return {
					x: transPoint[0],
					y: transPoint[1]
				};
			}
			return null;
		}
    },
    
    getZrBoundingRect(){
       return this.zrBoundingRect;
    },

    updateZrBoundingRect(opts) {
		this.zrBoundingRect = new BoundingRect(0, 0, opts.width, opts.height);
		this.render({ zrBoundingRect: this.zrBoundingRect });
    },

    clearByType(type) {
        this._viewInstances[type].clear();
    },

    clear() {
        Object.keys(this._viewInstances, key => {
            this.clearByType(key);
        });
    },

    /**
     * 全部视图设置缩放/平移
     */
    transformAll() {
        var transform = this.transform;
        this._viewInstances.eachChild((view) => {
            view.forEach(elem => {
                this.transformView(transform);             
            });
        })
    },
    
    /**
     * 全部视图设置显隐
     */
    revisibleAll() {
        this._viewInstances.eachChild((view) => {
            view.eachChild((elem) => {
                this.revisibleView(elem);
            });
        });
        
    },

    /**
     * 设置单个元素平移/缩放
     * @param {*} elem 
     * @param {*} transform 
     */
    transformView(elem, transform) {
		if (elem) {
			elem.transform = transform;
			elem.decomposeTransform();
			this.revisibleView(elem);
		}
    },

    /**
     * 设置单个元素显隐
     * @param {*} elem 
     */
    revisibleView(elem) {
		if (this.checkVisible(elem)) {
			elem.show();
		} else {
			elem.hide();
		}
		elem.dirty();
    },

    /**
     * 检查元素显隐
     * @param {*} elem 
     */
    checkVisible(elem) {
		return this.getZrBoundingRect().intersect(elem.getBoundingRect());
    }
}

zrUtil.mixin(Painter, Eventful);

export default Painter;