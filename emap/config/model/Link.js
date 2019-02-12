
import * as zrUtil from 'zrender/src/core/util';
import ModelType from '../ModelType';
import Base from './Base';

const linkModel = {
	layer: '_logicalLevel',
	// vlevel: '_physicalLevel',
	Device(opts) {
		return zrUtil.mixin(new Base(ModelType.Link),
		{
			code: opts.code,
			name: opts.name,
			points: opts.points
		});
	},
	Status(opts) {
		return zrUtil.mixin(new Base(ModelType.Link), {
			code: opts.code,
			color: opts.color,
		});
	}	
}

export default linkModel;