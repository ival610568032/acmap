import { indexOfModelType } from './ModelType';

function EventModel(e) {
	this.type = e.type;
	this.clientX = e.event.clientX;
	this.clientY = e.event.clientY;

	var view = e.target;
	if (view) {
		if (view._subType) {
			this.subType = view._subType;
		}
		if (view._val) {
			this.val = view._val;
		}
	}
	while (view) {
		if (indexOfModelType(view._type)) {
			this.deviceCode = view.name;
			this.deviceType = view._type;
			break;
		}
		if (!this.val) {
			if (view._subType) {
				this.subType = view._subType;
			}
			if (view._val) {
				this.val = view._val;
			}
		}
		view = view.parent;
	}

}

export default EventModel;