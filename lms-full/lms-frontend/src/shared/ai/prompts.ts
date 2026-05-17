export const courseTitlePrompt = (text: string) => `
Generate exactly 4 professional online course titles related to:
"${text}"

Rules:
- Return ONLY valid JSON array
- No markdown
- No explanation
- No numbering

Example:
[
  "Complete MERN Stack Bootcamp",
  "Advanced React Development",
  "Modern Node.js API Masterclass",
  "Full Stack Web Engineering"
]
`;

export const courseDescriptionPrompt = (title: string) => `
Generate a professional online course description for:

"${title}"

Rules:
- Write in professional tone
- Keep it concise
- 2 short paragraphs maximum
- Make it engaging for students
- No markdown
- No headings
- Length should be 100 - 450 characters
`;
