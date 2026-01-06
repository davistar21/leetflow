"use client";

import { motion } from "framer-motion";
import { FileCode, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormData {
  title: string;
  url: string;
  language: string;
  code: string;
  image: string;
  day: string;
}

interface InputFormProps {
  formData: FormData;
  handleChange: (name: string, value: string) => void;
  handleGenerate: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

export function InputForm({
  formData,
  handleChange,
  handleGenerate,
  isGenerating,
  disabled,
}: InputFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full lg:w-1/2"
    >
      <Card>
        <CardHeader>
          <CardTitle>Problem Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Problem Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. Two Sum"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="day">Day Number (Optional)</Label>
            <Input
              id="day"
              type="number"
              value={formData.day}
              onChange={(e) => handleChange("day", e.target.value)}
              placeholder="Auto-increments if empty"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">LeetCode URL</Label>
            <Input
              id="url"
              value={formData.url}
              onChange={(e) => handleChange("url", e.target.value)}
              placeholder="https://leetcode.com/problems/..."
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/3 space-y-2">
              <Label>Language</Label>
              <Select
                value={formData.language}
                onValueChange={(val) => handleChange("language", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Python">Python</SelectItem>
                  <SelectItem value="TypeScript">TypeScript</SelectItem>
                  <SelectItem value="JavaScript">JavaScript</SelectItem>
                  <SelectItem value="Java">Java</SelectItem>
                  <SelectItem value="C++">C++</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-2/3 space-y-2">
              <Label htmlFor="image">Image URL (Optional)</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => handleChange("image", e.target.value)}
                placeholder="Imgur link..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Solution Code</Label>
            <Textarea
              id="code"
              value={formData.code}
              onChange={(e) => handleChange("code", e.target.value)}
              className="font-mono text-sm min-h-[300px]"
              placeholder="Paste your solution here..."
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={disabled}
            className="w-full"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileCode className="mr-2 h-4 w-4" />
            )}
            Generate Markdown
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
