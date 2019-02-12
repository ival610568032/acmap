export function indexOfModelType(val) {
	for (var field in ModelType) {
		if (val === ModelType[field].type) {
			return field;
		}
	}
	return null;
}

export default ModelType = {
	Link: {type: 'Link', zlevel: 1 }
};