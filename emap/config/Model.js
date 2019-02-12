
import * as zrUtil from 'zrender/core/util';
import ModelType from './ModelType';
import linkModel from './model/Link';

function Model() {    
    this.init();
}

Model.prototype = {
    init() {
        this.mapModel = {};
        this.mapModel[ModelType.Link] = linkModel;
    },

    getMapModel() {
        return this.mapModel;
    },

    getModelByType(type) {
        return this.mapModel[type];
    }
};

export default Model;
