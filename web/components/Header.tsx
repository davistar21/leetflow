"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/ModeToggle";
import { motion } from "framer-motion";

export function Header({
  lastThreadId,
  setLastThreadId,
}: {
  lastThreadId: string;
  setLastThreadId: (id: string) => void;
}) {
  const [tempId, setTempId] = useState(lastThreadId);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    setLastThreadId(tempId);
    setOpen(false);
  };

  return (
    <header className="flex items-center justify-between py-6">
      <div className="flex items-center gap-2">
        <motion.div
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-2 rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </motion.div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          LeetFlow
        </h1>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Automation</DialogTitle>
            <DialogDescription>
              Set the last known Twitter Thread ID to maintain continuity. Day
              count starts automatically from Day 3.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="thread-id">Last Thread ID</Label>
              <Input
                id="thread-id"
                value={tempId}
                onChange={(e) => setTempId(e.target.value)}
                placeholder="e.g. 17382929292"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
