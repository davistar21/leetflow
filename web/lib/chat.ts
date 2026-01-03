interface AIResponse {
  message: { content: string | { type: string; text: string }[] };
}

const puterChat = async (
  prompt: string | ChatMessage[],
  options?: PuterChatOptions
): Promise<unknown> => {
  // const puter = getPuter();
  const puter = window.puter;
  if (!puter) {
    throw new Error("Puter.js not available for chat.");
  }

  // We explicitly request JSON format for all study set generation parts
  const defaultOptions = {
    model: options?.model || "claude-3-7-sonnet-latest",
    responseMimeType: "application/json",
  };

  const response = (await puter.ai.chat(prompt, undefined, undefined, {
    ...defaultOptions,
    ...options,
  })) as AIResponse | undefined;

  if (!response || !response.message.content) {
    throw new Error("AI returned an invalid or empty response.");
  }

  // Extract content, assuming the LLM returns a clean JSON string if responseMimeType is set.
  const content = Array.isArray(response.message.content)
    ? response.message.content[0]?.text || ""
    : response.message.content;
  console.log(content);
  try {
    // Attempt to parse the content as JSON immediately
    return JSON.parse(content);
  } catch (_e) {
    // If parsing fails, try to clean markdown triple backticks (a fallback)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("AI response was not valid JSON.");
  }
};

export const chat = async (prompt: string, options?: PuterChatOptions) => {
  return puterChat(prompt, options);
};
