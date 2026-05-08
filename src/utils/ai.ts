import { ValidatedTripFormData } from './validation';

/**
 * Builds the AI planning prompt from validated user form data.
 * @param {ValidatedTripFormData} formData - Validated trip preferences
 * @returns {string} - Anthropic-ready system prompt
 */
export const buildSystemPrompt = (): string => {
  return `You are TravelAI, a world-class travel planning engine. 
Your goal is to generate highly detailed, personalized, and realistic travel itineraries.
Output must be a valid JSON object matching the requested schema.
Include specific timings, locations, and estimated costs for each activity.
Ensure the logic follows the budget and interest constraints strictly.`;
};

/**
 * Builds the user prompt for the AI.
 * @param {ValidatedTripFormData} formData - User input data
 * @returns {string} - User prompt
 */
export const buildUserPrompt = (formData: ValidatedTripFormData): string => {
  return `Plan a trip to ${formData.destination} for ${formData.travelers} people.
Dates: ${formData.startDate} to ${formData.endDate}.
Budget: $${formData.budget} total.
Interests: ${formData.interests.join(', ')}.

Provide the itinerary in the following JSON format:
{
  "id": "unique-id",
  "destination": "${formData.destination}",
  "startDate": "${formData.startDate}",
  "endDate": "${formData.endDate}",
  "days": [
    {
      "dayIndex": 1,
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "id": "act-1",
          "name": "Activity Name",
          "description": "Short description",
          "startTime": "09:00",
          "endTime": "11:00",
          "location": { "name": "Location Name", "lat": 0.0, "lng": 0.0, "placeId": "optional" },
          "category": "attraction|food|hotel|transit",
          "estimatedCost": 0
        }
      ]
    }
  ],
  "totalBudget": ${formData.budget},
  "currency": "USD"
}`;
};
