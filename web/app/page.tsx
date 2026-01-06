"use client";

import React, { useState } from "react";
import axios from "axios";
import { chat } from "../lib/chat";
import { Header } from "@/components/Header";
import { InputForm } from "@/components/InputForm";
import { EditorPreview } from "@/components/EditorPreview";
import { toast } from "sonner";

export default function Home() {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    language: "Python",
    code: "",
    image: "",
    day: "",
  });

  const [lastThreadId, setLastThreadId] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    const toastId = toast.loading("Generating explanation with AI...");
    try {
      const prompt = `
      You are an experienced engineer sharing a "developer diary" update. 
      Analyze the provided LeetCode solution and code.

      Context:
      - Title: ${formData.title}
      - URL: ${formData.url}
      - Language: ${formData.language}
      
      Code:
      \`\`\`${formData.language.toLowerCase()}
      ${formData.code}
      \`\`\`

      ${formData.image ? `Screenshot: ${formData.image}` : ""}

      Persona/Style Guide:
      - Tone: Conversational, chill, "Twitter thread" vibe. Like a senior dev explaining a cool find to a friend.
      - Storytelling: Frame the explanation as an experience. "I tackled X today..." or "This problem was tricky because..."
      - No "AI Slop": Avoid phrases like "In this problem we will...", "The complexity is O(N)", "In conclusion".
      - Use Code Comments: If the code has comments, incorporate them into the narrative as if they are your inner thoughts.
      - Formatting: Use bolding for emphasis, bullet points for clarity.
      
      Required Output Structure (Markdown):
      # ${formData.title}

      [Problem Link](${formData.url})

      ## The Mission
      (A brief, engaging hook about what the problem asked for and why it's interesting.)

      ## The Strategy
      (How I approached it. The "Aha!" moment. Why I chose this algorithm.)

      ## The Code
      (The code block provided above, verbatim)

      ## The Analysis
      (Time/Space complexity, but casually explained. e.g., "Runs in O(N) which is sweet because...")

      ## The Result
      (If image provided: ![Showcase](${formData.image}). Else: omit.)

      IMPORTANT: Return valid JSON: { "markdown": "..." }
      `;

      const response = (await chat(prompt)) as { markdown: string };

      if (response && response.markdown) {
        setMarkdown(response.markdown);
        toast.success("Markdown generated successfully!", { id: toastId });
      } else {
        throw new Error("Invalid response format from AI");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate markdown", {
        id: toastId,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePost = async () => {
    setIsPosting(true);
    const toastId = toast.loading("Publishing to Gist and X...");
    try {
      const res = await axios.post("/api/post", {
        markdown,
        title: formData.title,
        lastThreadId,
        day: formData.day,
      });
      if (res.data.success) {
        toast.success("Successfully published to X!", {
          id: toastId,
          action: {
            label: "View Gist",
            onClick: () => window.open(res.data.gistUrl, "_blank"),
          },
        });
        setLastThreadId("");
      } else if (res.data.warning) {
        toast.warning(res.data.warning, { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to post", {
        id: toastId,
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex flex-col">
      <div className="container mx-auto px-4 max-w-6xl flex-1 flex flex-col">
        <Header lastThreadId={lastThreadId} setLastThreadId={setLastThreadId} />

        <div className="flex-1 flex flex-col lg:flex-row gap-6 pb-20">
          <InputForm
            formData={formData}
            handleChange={handleChange}
            handleGenerate={handleGenerate}
            isGenerating={isGenerating}
            disabled={isPosting}
          />
          <EditorPreview
            markdown={markdown}
            setMarkdown={setMarkdown}
            status={markdown ? "generated" : "idle"}
            handlePost={handlePost}
          />
        </div>
      </div>
    </div>
  );
}
