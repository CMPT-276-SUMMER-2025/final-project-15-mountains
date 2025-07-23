"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function page() {
  return (
    <div className="w-full h-250">
        {/* Header */}
        <div className="flex flex-col mx-auto py-30 text-center">
            <h1 className="text-4xl text-center">README Viewer</h1>
            <p className="text-center">Enter your GitHub username and the repository, to view your README markdown file.</p>
            
            {/* Input Section */}
            <div className="flex grid-cols-3 gap-4 justify-center py-4">
                <Input className="border-black border-1 rounded-full text-center w-50" id="Username" placeholder="Username" ></Input>
                <Input className="border-black border-1 rounded-full text-center w-50" id="Repository" placeholder="Repository"></Input>
                <Button className="hover:cursor-pointer" >Load</Button>
            </div>

            <Card className="flex flex-row gap-4 p-6 min-h-[600px]">

                {/* The Left side of the Card */}
                <div className="w-1/2 flex flex-col">
                    <div className="flex-1 h-full p-4 rounded-xl overflow-auto">
                    </div>
                </div>

                {/* The Right side of the card */}
                <div className="w-1/2 flex flex-col">
                    <Textarea className="flex-1 resize-none h-full rounded-xl" ></Textarea>
                </div>
                
            </Card>
        </div>
    </div>
  );

}
