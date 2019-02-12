import * as zrUtil from 'zrender/core/util';
import Group from 'zrender/container/Group';

function View(name,loader) {
    Group.call(this);
    this._levelName = name
    this._loader  = loader;
    this._instances = {};
}

View.prototype = {
    getShapeTipPoint: function (payload) {
		var view = this._instances[payload.code];
		if (view) {
			return view.getShapeTipPoint(payload.val);
		}
		return null;
    },
    
    render(model, repaint) {
        if (model.isDispose()) {
			this.delView(model);
		} else {
			var view = this._instances[model._code];
			if (view) {
                if (repaint) {
				    this.delView(model);
                    return this.addView(model);
                } else {
                    return this.uptView(model); 
                }
			} else {
				return this.addView(model);
			}
        }
        
		return null;
    },

    addView(model) {
		var shape = this._loader.shape[model._type](model, this.loader.theme);
		this._instances[model._code] = shape;
		this._group.add(shape);
		return shape;
    },
    
    uptView(model) {
        var shape = this._instances[model._code];
        if (shape) {
            shape.update(model, this.loader.theme);
        }
        return shape;
    },

    delView(model) {
        var view = this._instances[model._code];
		if (view) {
			this._group.remove(view);
			delete this._instances[model._code];
		}
    },

    clear() {
        this._instances = {};
        this._group.removeAll();
    }
};

zrUtil.mixin(View, Group);

export default View;
