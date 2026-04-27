import { NextRequest } from "next/server";
import { mockResponses } from "@/lib/mock-responses";

export const dynamic = "force-dynamic";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  message: string;
  history?: ChatMessage[];
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequestBody = await req.json();
    const userMessage = body.message;

    if (!userMessage) {
      return Response.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    let responseText = "";
    let sources: Array<{ file: string; section?: string }> = [];

    for (const mock of mockResponses) {
      if (mock.pattern.test(userMessage)) {
        responseText = mock.response;
        sources = mock.sources;
        break;
      }
    }

    if (!responseText) {
      const fallback = mockResponses[mockResponses.length - 1];
      responseText = fallback.response;
      sources = fallback.sources;
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const chunks = responseText.split("");
        let index = 0;

        function push() {
          if (index < chunks.length) {
            const chunk = chunks[index++];
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk, sources })}\n\n`));
            setTimeout(push, 10);
          } else {
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          }
        }

        push();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}