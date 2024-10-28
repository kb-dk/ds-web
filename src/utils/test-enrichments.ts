const addTestDataEnrichment = (type: string, component: string, title: string, index: number) => {
	return `${santizeAndSimplify(type)}-${santizeAndSimplify(component)}-${santizeAndSimplify(title)}-${index}`;
};

const santizeAndSimplify = (str: string) => {
	return str
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-') // Replace spaces with hyphens
		.replace(/[^a-z0-9-]/g, ''); // Remove any non-alphanumeric chars except hyphens
};

export { addTestDataEnrichment, santizeAndSimplify };
