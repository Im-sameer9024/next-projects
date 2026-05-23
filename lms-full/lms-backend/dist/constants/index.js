import ms, {} from "ms";
const REFRESH_TOKEN_EXPIRES_IN = process.env
    .REFRESH_TOKEN_EXPIRES_IN;
const maxAge = ms(REFRESH_TOKEN_EXPIRES_IN);
export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge,
    path: "/",
};
export const CourseTitlePrompt = (text) => {
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
//# sourceMappingURL=index.js.map