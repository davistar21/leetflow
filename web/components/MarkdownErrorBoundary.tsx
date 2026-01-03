"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class MarkdownErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Markdown rendering error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/10 text-destructive my-4">
            <div className="flex items-center gap-2 my-2">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-semibold !m-0">Content Rendering Error</h3>
            </div>
            <p className="text-sm opacity-90">
              There was an issue displaying this content section. This might be
              due to complex formatting or browser compatibility.
            </p>
            {this.state.error && (
              <pre className="mt-2 text-xs overflow-auto max-w-full bg-black/5 p-2 rounded">
                {this.state.error.message}
              </pre>
            )}
          </div>
        )
      );
    }

    return this.props.children;
  }
}
