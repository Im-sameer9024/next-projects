import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response("Prompt is required", { status: 400 });
    }

    const stream = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      max_completion_tokens:400,
      messages: [
        { role: "system", content: "You are a helpful assistant" },
        { role: "user", content: prompt },
      ],
      stream: true, // ✅ important
    });

    // Convert Groq stream → Web ReadableStream
    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            controller.enqueue(encoder.encode(content));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Groq Streaming Error:", error);
    return new Response("Error occurred", { status: 500 });
  }
}