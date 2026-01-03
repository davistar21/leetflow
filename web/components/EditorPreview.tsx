"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Send, Eye, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import remarkGfm from "remark-gfm";
import MarkdownImage from "./MarkdownImage";
import MarkdownErrorBoundary from "./MarkdownErrorBoundary";

interface EditorPreviewProps {
  markdown: string;
  setMarkdown: (md: string) => void;
  status: string;
  handlePost: () => void;
}

export function EditorPreview({
  markdown,
  setMarkdown,
  status,
  handlePost,
}: EditorPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full lg:w-1/2 flex flex-col h-full"
    >
      <Card className="flex flex-col h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Review & Edit</CardTitle>
          {status === "generated" && (
            <Button
              onClick={handlePost}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Send className="mr-2 h-4 w-4" /> Post Changes
            </Button>
          )}
        </CardHeader>
        <CardContent className="flex-1 flex flex-col pt-4 min-h-[500px]">
          <Tabs defaultValue="preview" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">
                <Eye className="mr-2 h-4 w-4" /> Preview
              </TabsTrigger>
              <TabsTrigger value="edit">
                <Edit3 className="mr-2 h-4 w-4" /> Edit
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="flex-1 mt-4 relative">
              <div className="absolute inset-0 border rounded-md p-4 overflow-auto bg-background prose prose-sm dark:prose-invert max-w-none">
                {markdown ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none border rounded-md p-6 min-h-[500px] bg-card">
                    <MarkdownErrorBoundary>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          img: ({ node, ...props }) => (
                            // @ts-ignore
                            <MarkdownImage {...props} />
                          ),
                        }}
                      >
                        {markdown}
                      </ReactMarkdown>
                    </MarkdownErrorBoundary>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Generated content will appear here...
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="edit" className="flex-1 mt-4 relative">
              <Textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="absolute inset-0 font-mono text-sm resize-none p-4"
                placeholder="# Markdown editor..."
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
