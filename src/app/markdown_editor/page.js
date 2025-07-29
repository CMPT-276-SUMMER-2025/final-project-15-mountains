"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown"
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, Maximize2, Minimize2, Github, FileText, Eye, Loader2 } from "lucide-react";
import { useRef } from "react";

export default function Page() {
    const [markdown, setMarkdown] = useState("");
    const [sizeup, setsizeup] = useState(false);
    const [errorMessage,setErrorMessage] = useState("");
    const [loading,setLoading] = useState(false);
    const [aimessage, setAImessage] = useState("");
    const [Username,setUsername] = useState("");
    const [Repo,setRepo] = useState("");
    
    const togglesize = () => {
        setsizeup(!sizeup);
    }
    
    const components = {
        h1: ({ node, ...props }) => <h1 className="text-4xl font-bold my-4 text-foreground" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-3xl font-semibold my-3 text-foreground" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-2xl font-semibold my-2 text-foreground" {...props} />,
        p: ({ node, ...props }) => <p className="text-base leading-relaxed my-2 text-foreground" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc list-inside pl-4 my-2" {...props} />,
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-4 bg-muted/50 p-4 rounded-r" {...props} />
        ),
        code: ({ node, ...props }) => (
            <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...props} />
        ),
        pre: ({ node, ...props }) => (
            <pre className="bg-muted text-sm p-4 overflow-x-auto rounded my-4 font-mono" {...props} />
        ),
        a: ({ node, ...props }) => (
            <a
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
            />
        ),
        img: ({ node, ...props }) => (
            <img className="my-4 rounded max-w-full h-auto" alt="" {...props} />
        ),
        strong: ({ node, ...props }) => (
            <strong className="font-bold" {...props} />
        ),
        em: ({ node, ...props }) => (
            <em className="italic text-muted-foreground" {...props} />
        ),
        hr: () => <hr className="my-6 border-t border-border" />,
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
            setLoading(true);
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
         setLoading(false);
        
    }

    return (
        <div className="min-h-screen py-20 px-4">
            {/* Header */}
            <div className="max-w-7xl mx-auto text-center mb-16">
                <h1 className="text-gradient font-bold mb-6">
                    Markdown Editor
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                    GitGoods all-in-one markdown editor. View READMEs from GitHub and make local edits with a live preview. 
                    Use AI to edit or create new markdown with whatever styling you want.
                </p>
                
                {/* GitHub Input Section */}
                <Card className="max-w-2xl mx-auto p-6">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center space-x-2">
                            <Github className="h-5 w-5" />
                            <span>Load from GitHub</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Input 
                                disabled={loading} 
                                className="flex-1 dark:border-gray-500" 
                                placeholder="Username" 
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <Input 
                                disabled={loading} 
                                className="flex-1 dark:border-gray-500" 
                                placeholder="Repository" 
                                onChange={(e) => setRepo(e.target.value)}
                            />
                            <Button 
                                disabled={loading} 
                                onClick={fetchMarkdown}
                                className="hover:scale-105 transition-transform duration-200 hover:cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    'Load README'
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Error Message */}
            {errorMessage && (
                <div className="max-w-4xl mx-auto mb-8">
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {errorMessage}
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            {/* Main Editor */}
            <div >
                <Card className={`transition-all duration-500 relative mx-auto ${sizeup ? "w-full" : "w-5/8"}`}>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                            <FileText className="h-5 w-5" />
                            <span>Markdown Editor</span>
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={togglesize}
                            className="hover:bg-accent hover:cursor-pointer"
                        >
                            {!sizeup ? (
                                <Maximize2 className="h-4 w-4" />
                            ) : (
                                <Minimize2 className="h-4 w-4" />
                            )}
                        </Button>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                        {/* AI Input */}
                        <div className="relative">
                            <Textarea
                                ref={textareaRef}
                                value={message}
                                onChange={handleTextareaChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Tell AI what changes you want: Edit this README with setup steps or Create a GitHub issue for broken links"
                                className="dark:border-gray-500 min-h-[60px] max-h-[200px] resize-none pr-12"
                                rows={2}
                                disabled={loading}
                            />
                            <Button
                                onClick={handleSubmit}
                                size="sm"
                                className="absolute bottom-2 right-2 h-8 w-8 p-0 hover:cursor-pointer"
                                disabled={loading}
                            >
                                {!loading ? (
                                    <Send className="h-4 w-4" />
                                ) : (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                )}
                            </Button>
                        </div>

                        {/* AI Response */}
                        {aimessage && (
                            <div className="p-4 bg-primary/5 border-l-4 border-primary rounded-md">
                                <div className="flex items-center mb-2">
                                    <Send className="h-4 w-4 text-primary mr-2" />
                                    <strong className="text-primary text-sm">
                                        What AI did:
                                    </strong>
                                </div>
                                <p className="text-sm text-muted-foreground">{aimessage}</p>
                            </div>
                        )}

                        {/* Editor and Preview */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Markdown Editor */}
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    <h3 className="font-semibold">Editor</h3>
                                </div>
                                <Textarea 
                                    className="min-h-[400px] resize-none font-mono text-sm dark:border-gray-500" 
                                    value={markdown}  
                                    onChange={(e) => setMarkdown(e.target.value)}  
                                    placeholder="Start typing to see a preview of your Markdown file"
                                />
                            </div>

                            {/* Preview */}
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Eye className="h-4 w-4 text-primary" />
                                    <h3 className="font-semibold">Preview</h3>
                                </div>
                                <div className="min-h-[400px] p-4 border rounded-md overflow-auto bg-card dark:border-gray-500">
                                    <ReactMarkdown 
                                        rehypePlugins={[rehypeRaw]} 
                                        remarkPlugins={remarkGfm} 
                                        components={components}
                                    >
                                        {markdown}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
