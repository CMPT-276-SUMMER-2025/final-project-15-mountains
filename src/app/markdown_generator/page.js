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
    const [markdown, setMarkdown] = useState("");
    const [sizeup, setsizeup] = useState(false);
    const [errorMessage,setErrorMessage] = useState("");
    const [loading,setLoading] = useState(false);
    const [aimessage, setAImessage] = useState("");
    const [Username,setUsername] = useState("");
    const [Repo,setRepo] = useState("");
    const togglesize = () =>{
        setsizeup(!sizeup);

    }
    const components = {
        h1: ({ node, ...props }) => <h1 className="text-4xl font-bold my-4" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-3xl font-semibold my-3" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-2xl font-semibold my-2" {...props} />,
        p: ({ node, ...props }) => <p className="text-base leading-relaxed my-2" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc list-inside pl-4 my-2" {...props} />,
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 pl-4 italic  my-4" {...props} />
        ),
        code: ({ node, ...props }) => (
            <code className="brightness-50  px-1 py-0.5 rounded" {...props} />
        ),
        pre: ({ node, ...props }) => (
            <pre className=" text-sm p-4 overflow-x-auto rounded my-4" {...props} />
        ),
        a: ({ node, ...props }) => (
            <a
            className="text-blue-600 hover:underline dark:text-blue-400"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
            />
        ),
        img: ({ node, ...props }) => (
            <img className="my-4 rounded max-w-full h-auto" alt="" {...props} />
        ),
        strong: ({ node, ...props }) => (
            <strong className="font-bold text-black dark:text-white" {...props} />
        ),
        em: ({ node, ...props }) => (
            <em className="italic text-gray-700 dark:text-gray-300" {...props} />
        ),
        hr: () => <hr className="my-6 border-t border-gray-300 dark:border-gray-600" />,
        };

    const [message, setMessage] = useState('');
    const textareaRef = useRef(null);
    
    const handleSubmit = async () => {
        if (!message.trim()) {
            setErrorMessage("Please enter a message before submitting.");
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            const res = await fetch("/api/ai_api/markdown", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: message.trim(), markdown: markdown.trim() }),
            });

            if (!res.ok) {
                throw new Error("AI failed to return something. Please try again in a few minutes.");
            }

            const data = await res.json();

            setMarkdown(data.newMarkdown);
            setAImessage(data.explanation);
            setMessage("");

            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        } catch (err) {
            setErrorMessage(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };




    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
        if (e.shiftKey) {
            
            return;
        } else {
            
            e.preventDefault();
            handleSubmit();
        }
        }
    };

    const handleTextareaChange = (e) => {
        setMessage(e.target.value);
        
        
        if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };
    const updateText = (event) => {
        const fixedContent = fixRelativeImages(event.target.value, Username, Repo);
        setMarkdown(fixedContent);
    };

    //Fix image paths from relative to raw GitHub URLs
    const fixRelativeImages = (markdown, username, repo, branch = "main") => {
        return markdown.replace(
            /!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g,
            (_, alt, path) => {
                const cleanedPath = path.replace(/^\.\//, ""); // remove ./ if it exists
                return `![${alt}](https://raw.githubusercontent.com/${username}/${repo}/${branch}/${cleanedPath})`;
            }
        );
    };

    const fetchMarkdown = async () => {
         try {
            setErrorMessage("");
            // Catching and throwing proper Errors
            const id = await fetch(`https://api.github.com/users/${Username}`)
            if(!id.ok) throw new Error("Username incorrect");
	
            const repo = await fetch(`https://api.github.com/repos/${Username}/${Repo}`)
            if(!repo.ok) throw new Error("This Repository does not exist");
            const response = await fetch(`https://api.github.com/repos/${Username}/${Repo}/contents/README.md`);
            if (!response.ok) throw new Error("README.md does not exist");
            

            // Retrieving Data from API
            const data = await response.json();
            
            // Decodeds from base64
            const decodedContent = new TextDecoder("utf-8").decode(
                Uint8Array.from(atob(data.content), c => c.charCodeAt(0))
            );

            // Decoded Content for the Textarea
            setMarkdown(decodedContent);

            // Fixing images for the Markdown file
            const fixedContent = fixRelativeImages(decodedContent, Username, Repo);

            //Setting the Markdown 
            setMarkdown(fixedContent);
        } catch (err) {
            setErrorMessage(err.message);
        }
        
    }

    return (
        <div className="w-full h-auto min-h-[100vh] flex flex-col">
            {/* Header */}
            <div className="flex flex-col mx-auto pt-30 text-center">
                <h1 className="text-7xl text-center">Markdown Editor</h1>
                <p className="text-center text-md mt-5">Enter your GitHub username and the repository, to view your README markdown file.</p> 
                <p> Ask AI to make a markdown file for you.</p>
                {/* Input Section */}
                <div className="flex grid-cols-3 gap-4 justify-center py-4">
                    <Input className="border-black dark:border-gray-500 border-1  w-50" id="Username" placeholder="Username" onChange={(e) => setUsername(e.target.value)}></Input>
                    <Input className="border-black dark:border-gray-500 border-1 w-50" id="Repository" placeholder="Repository" onChange={(e) => setRepo(e.target.value)}></Input>
                    <Button className="hover:cursor-pointer" onClick={fetchMarkdown}>Load</Button>
                </div>
            
            </div>

            {/* Error Message */}
            {errorMessage && (
            <Alert variant="destructive" className="mt-4 w-[600px] self-center mb-7">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                {errorMessage}
                </AlertDescription>
            </Alert>
            )}

            <Card className={`relative flex flex-col gap-4 p-6 min-h-[600px]  ${sizeup ? "w-full" : "w-4/6"} self-center transition-all duration-300`}>
                <button onClick={togglesize} className="absolute right-2 top-2 z-50 cursor-pointer">
                    {!sizeup && <ScreenFullIcon size={16} />}
                    {sizeup && <ScreenNormalIcon size={16} />}
                </button>
                
                
                <div className="space-y-2">
                <div className="relative">
                    <Textarea
                    ref={textareaRef}
                    value={message}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Tell AI what changes you want or how you want your markdown to look"
                    className="min-h-[60px] max-h-[200px] resize-none pr-12"
                    rows={2}
                    disabled={loading}
                    />
                    <Button
                    onClick={handleSubmit}
                    size="sm"
                    className="absolute bottom-2 right-2 h-8 w-8 p-0"
                    disabled={loading}
                    >
                    {!loading ? <Send className="h-4 w-4" /> : <svg
                        className="animate-spin h-4 w-4 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        />
                        <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>}
                    </Button>
                </div>

    
                </div>
                {aimessage && (
                        <div className=" mt-2 p-4 border-l-4 border-green-500 bg-green-100 dark:bg-green-900/40 rounded-md shadow-md text-xs">
                            <strong className=" mb-1 text-green-800 dark:text-green-300 ">
                            What AI did.
                            </strong>
                            <p className="text-gray-800 dark:text-gray-100">{aimessage}</p>
                        </div>
                        )}
                <div className="flex flex-row flex-1 space-x-5">

                
                


                {/* The Right side of the card */}
                <div className="w-1/2 flex flex-col rounded-2xl border-2 dark:border-gray-500">
                    <div className="self-center border-b-2 w-full text-center py-5  text-3xl dark:border-gray-500">Markdown Editor</div>
                    <Textarea className="flex-1 resize-none h-full rounded-xl rounded-t-none border-t-0 text-white" value={markdown}  onChange={(e) => setMarkdown(e.target.value)}  placeholder="Start typing to see a preview of your Markdown file"></Textarea>
                </div>
                <div className="w-1/2 flex flex-col rounded-2xl border-2 dark:border-gray-500 ">
                    <div className="self-center border-b-2 w-full text-center py-5 text-3xl dark:border-gray-500">Rendered Markdown</div>
                    <div className="flex-1 h-full p-4 rounded-xl overflow-auto">
                    <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={remarkGfm} components={components}>{markdown}</ReactMarkdown>
                    </div>
                </div>
            </div>
                 
            </Card>
            
        
        </div>
  );

}
