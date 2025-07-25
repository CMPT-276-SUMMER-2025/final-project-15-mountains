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

    //Update Text for the README.MD
    const updateText = (event) => {
        setDecodedContent(event.target.value);
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

            // Catching and throwing proper Errors
            const id = await fetch(`https://api.github.com/users/${Username}`)
            if(!id.ok) throw new Error("Username incorrect");
	
            const repo = await fetch(`https://api.github.com/repos/${Username}/${Repo}`)
            if(!repo.ok) throw new Error("This Repository does not exist");
            const response = await fetch(`https://api.github.com/repos/${Username}/${Repo}/contents/README.md`);
            if (!response.ok) throw new Error("README.md does not exist");
            setErrorMessage("");

            // Retrieving Data from API
            const data = await response.json();
            
            // Decodeds from base64
            const decodedContent = new TextDecoder("utf-8").decode(
                Uint8Array.from(atob(data.content), c => c.charCodeAt(0))
            );

            // Decoded Content for the Textarea
            setDecodedContent(decodedContent);

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
                <h1 className="text-7xl text-center">README Viewer</h1>
                <p className="text-center text-md">Enter your GitHub username and the repository, to view your README markdown file.</p>
            
                {/* Input Section */}
                <div className="flex grid-cols-3 gap-4 justify-center py-4">
                    <Input className="border-black dark:border-gray-500 border-1  w-50" id="Username" placeholder="Username" onChange={(e) => setUsername(e.target.value)}></Input>
                    <Input className="border-black dark:border-gray-500 border-1 w-50" id="Repository" placeholder="Repository" onChange={(e) => setRepo(e.target.value)}></Input>
                    <Button className="hover:cursor-pointer" onClick={fetchMarkdown}>Load</Button>
                </div>
            </div>

            {/* Error Message */}
            <div className="text-red-500 mb-4 text-center">
                {errorMessage}
            </div>

            <Card className={`relative flex flex-row gap-4 p-6 min-h-[600px]  ${sizeup ? "w-full" : "w-4/6"} self-center transition-all duration-300`}>
                <button onClick={togglesize} className="absolute right-2 top-2 z-50 cursor-pointer">
                    {!sizeup && <ScreenFullIcon size={16} />}
                    {sizeup && <ScreenNormalIcon size={16} />}
                </button>

                {/* The Left side of the Card */}
                <div className="w-1/2 flex flex-col rounded-2xl border-2 dark:border-gray-500">
                    <div className="self-center border-b-2 w-full text-center py-5 text-3xl dark:border-gray-500">Rendered Markdown</div>
                    <div className="flex-1 h-full p-4 rounded-xl overflow-auto">
                    <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={remarkGfm}>{markdown}</ReactMarkdown>
                    </div>
                </div>


                {/* The Right side of the card */}
                <div className="w-1/2 flex flex-col rounded-2xl border-2 dark:border-gray-500">
                    <div className="self-center border-b-2 w-full text-center py-5  text-3xl dark:border-gray-500">Markdown Editor</div>
                    <Textarea className="flex-1 resize-none h-full rounded-xl rounded-t-none border-t-0 text-white" value={decodedContent} onChange={updateText} placeholder="Start typing to see a preview of your Markdown file">{decodedContent}</Textarea>
                </div>
                
            </Card>
        
        </div>
  );

}
