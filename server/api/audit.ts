import { defineEventHandler, setResponseHeader, createError } from 'h3';

export default defineEventHandler(async (event) => {
	// Fetch the base64 content of the PDF
	let data = await useStorage('assets:server').getItem('audit.base64');

	if (!data) {
		// Handle case where the file is not found or cannot be read
		throw createError({
			statusCode: 404,
			statusMessage: 'PDF file not found',
		});
	}

	// Check if the data is not already a string
	// const base64Data = Buffer.isBuffer(data) ? data.toString('base64') : data;

	// // Set the Content-Type header to application/pdf
	// setResponseHeader(event, 'Content-Type', 'application/pdf');
	// setResponseHeader(event, 'Content-Disposition', 'inline; filename="AuditReport.pdf"'); // Show in-browser with filename

	// Return the base64-encoded PDF wrapped in the data URI format
	return data;
});