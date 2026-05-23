import ms, { type StringValue } from "ms";

const REFRESH_TOKEN_EXPIRES_IN = process.env
  .REFRESH_TOKEN_EXPIRES_IN as StringValue;

const maxAge = ms(REFRESH_TOKEN_EXPIRES_IN);

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge,
  path: "/",
};

export const CourseTitlePrompt = (text: string) => {
  return `
Generate exactly 4 professional online course titles related to "${text}".

Rules:
- Return ONLY a valid JSON array
- No explanation
- No numbering
- No markdown
- No extra text

Example:
[
  "Complete MERN Stack Bootcamp",
  "Advanced React Development",
  "Modern Node.js API Masterclass",
  "Full Stack Web Engineering"
]
`;
};

export const CourseDescriptionPrompt = (title: string) => {
  return `
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
};

export const ChapterDescriptionPrompt = ({
  courseTitle,
  chapterTitle,
}: {
  courseTitle: string;
  chapterTitle: string;
}) => {
  return `
Generate a professional and engaging chapter description for an online course.

Course Title:
"${courseTitle}"

Chapter Title:
"${chapterTitle}"

Rules:
- Write in a professional and beginner-friendly tone
- Explain what students will learn in this chapter
- Keep it concise and engaging
- Maximum 2 short paragraphs
- Use markdown
- Use headings
- Use bullet points
- Length should be between 120 - 500 characters
- Make the chapter feel practical and valuable
`;
};
