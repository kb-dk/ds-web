const addTestDataEnrichment = (type: string, title: string, index: number) => {
	return `${santizeAndSimplify(type)}-${santizeAndSimplify(title)}-${index}`;
};

const santizeAndSimplify = (str: string) => {
	return str
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-') // Replace spaces with hyphens
		.replace(/[^a-z0-9-]/g, ''); // Remove any non-alphanumeric chars except hyphens
};

export { addTestDataEnrichment };
