function Base(opts){
    this._type = opts.type;
    this._zlevel= opts.zlevel;
}

Base.prototype = {
	_dispose: false,
	_update: false,
	isDispose() {
		return this._dispose;
	},
	isUpdate() {
		return this._update;
	}
};

export default Base;