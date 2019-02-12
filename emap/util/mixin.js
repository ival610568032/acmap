

export default function mixin(sourceObj, targetObj) {
	for (var key in sourceObj) {
		if (!(key in targetObj) && sourceObj.hasOwnProperty(key)) {
			targetObj[key] = sourceObj[key];
		}
	}
 
	return targetObj;
}
