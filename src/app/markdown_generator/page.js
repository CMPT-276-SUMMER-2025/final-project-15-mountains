"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown"
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Textarea } from "@/components/ui/textarea";
import {ScreenFullIcon} from '@primer/octicons-react';
import {ScreenNormalIcon} from '@primer/octicons-react';
import { useRef } from "react";
import { Send } from "lucide-react";
export default function Page() {
    const [markdown,setMarkdown] = useState();
    const [Username,setUsername] = useState();
    const [Repo,setRepo] = useState();
    const [decodedContent,setDecodedContent] = useState();
    const [errorMessage,setErrorMessage] = useState("");
    
    
    const [sizeup, setsizeup] = useState(false);

    const togglesize = () =>{
        setsizeup(!sizeup);

    }
     const [message, setMessage] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const textareaRef = useRef(null);

  const handleSubmit = () => {
    if (message.trim()) {
      setSubmissions(prev => [...prev, message.trim()]);
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Allow default behavior (new line)
        return;
      } else {
        // Prevent default and submit
        e.preventDefault();
        handleSubmit();
      }
    }
  };

  const handleTextareaChange = (e) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

    return (
        <div className="w-full h-auto min-h-[100vh] flex flex-col">
            {/* Header */}
            <div className="flex flex-col mx-auto pt-30 text-center">
                <h1 className="text-7xl text-center">README Viewer</h1>
                <p className="text-center text-md">Enter your GitHub username and the repository, to view your README markdown file.</p>
            
            
            </div>

            {/* Error Message */}
            <div className="text-red-500 mb-4 text-center">
                {errorMessage}
            </div>

            <Card className={`relative flex flex-col gap-4 p-6 min-h-[600px]  ${sizeup ? "w-full" : "w-4/6"} self-center transition-all duration-300`}>
                <button onClick={togglesize} className="absolute right-2 top-2 z-50 cursor-pointer">
                    {!sizeup && <ScreenFullIcon size={16} />}
                    {sizeup && <ScreenNormalIcon size={16} />}
                </button>

                {/* The Left side of the Card */}
                <div className="flex flex-row flex-1">

                
                <div className="w-1/2 flex flex-col rounded-2xl border-2 dark:border-gray-500 ">
                    <div className="self-center border-b-2 w-full text-center py-5 text-3xl dark:border-gray-500">Rendered Markdown</div>
                    <div className="flex-1 h-full p-4 rounded-xl overflow-auto">
                    <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={remarkGfm}>{markdown}</ReactMarkdown>
                    </div>
                </div>


                {/* The Right side of the card */}
                <div className="w-1/2 flex flex-col rounded-2xl border-2 dark:border-gray-500">
                    <div className="self-center border-b-2 w-full text-center py-5  text-3xl dark:border-gray-500">Markdown Editor</div>
                    <Textarea className="flex-1 resize-none h-full rounded-xl rounded-t-none border-t-0 text-white" value={"sus"} onChange={"ohi"} placeholder="Start typing to see a preview of your Markdown file">{decodedContent}</Textarea>
                </div>
            </div>
                 <div className="space-y-2">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here... (Enter to submit, Shift+Enter for new line)"
              className="min-h-[60px] max-h-[200px] resize-none pr-12"
              rows={2}
            />
            <Button
              onClick={handleSubmit}
              disabled={!message.trim()}
              size="sm"
              className="absolute bottom-2 right-2 h-8 w-8 p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Press Enter to submit, Shift+Enter for new line</span>
            <span>{message.length} characters</span>
          </div>
        </div>
            </Card>
            
        
        </div>
  );

}
