
import ModelType from '../ModelType';

export function parseMap(map, _model) {
    var _map = {};
    var _mapDevice = {};
    var _deviceList = [];

    if (map) {
        if (map.linkList && map.linkList.length > 0) {
            zrUtil.each(map.linkList , function(elem){
                elem.type = ModelType.Link.type;
                elem.update = true;
                _mapDevice[elem.code] = elem
                _deviceList.push(_model.getModelByType(elem.type).Device(elem));
            }, this);

            _map[ModelType.Link.type] = map.linkList;
        }
    }

    return [_map, _mapDevice, _deviceList]
}

export function parseStatus(status, _model) {

    // [this._status, this._mapStatus, changeList] = callback(status, this._Model);
}