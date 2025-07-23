"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function IssueSelector() {
    const [selectedLang, setSelectedLang] = useState("JavaScript");
    const languages = ["JavaScript", "Python", "TypeScript", "Go", "Java", "C++", "Rust"];

    const [loading,setLoading] = useState(false);
    const [issues,setIssues] = useState([]);

    const [error,setError] = useState(false);
    const [errorMessage,setErrorMessage] = useState("");


    const [AIloading,setAILoading] = useState(false);
    const [userPrompt,setUserPrompt] = useState("");
    const [highlightedIndex,setHighlightedIndex] = useState(-1);
    const [aimessage,setAImessage] = useState("");

    const fetchIssues = async () => {
        setHighlightedIndex(-1);
        setAImessage("");
        setLoading(true);
        setError(false);

        try {
            const cached = localStorage.getItem(selectedLang);

            if (!cached) {
                const res = await fetch(`/api/github_api/issue_finder?lang=${selectedLang}`);
                if (!res.ok) throw new Error("Failed to fetch");

                const data = await res.json();
                setIssues(data);

                
                localStorage.setItem(selectedLang, JSON.stringify(data));
            } else {
                setIssues(JSON.parse(cached));
            }
        } catch (err) {
            setErrorMessage("Failed to fetch issues. Please try again after a few mins");
            setError(true);
            setIssues([]);
        } finally {
            setLoading(false);
        }
    };

    const getAISuggestion = async () => {
        setAILoading(true);
        setError(false);
        try {
            const res = await fetch('/api/ai_api/issue_suggestion',{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: userPrompt, issues }),
                
            });
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setHighlightedIndex(data.index);
            setAImessage(data.explanation);
            console.log(data);
        } catch (err) {
            setErrorMessage("Failed to generate suggestion. Please try again after a few mins");
            setError(true);
        } finally {
            setAILoading(false);
        }
    };
    useEffect(() => {
        if (highlightedIndex !== null) {
        const element = document.getElementById(`issue-${highlightedIndex}`);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        }
    }, [highlightedIndex]);

    return (
        <div className="h-[100vh]">
        <div className="flex flex-col justify-end items-center h-60 mb-10">
            <h1 className="lg:text-7xl">Issue Finder</h1>
            <h3 className="text-md mt-5">Discover beginner-friendly GitHub issues in your favorite language.</h3> <h3> Use AI to pick the best one based on your interests and goals.</h3>
        </div>
        <div className="flex flex-col justify-center items-center mt-5">
        <Card className="p-6 flex flex-row justify-center px-10 mb-3">
            
            <div className="space-y-4 border-r-5 pr-10 flex flex-col justify-center items-center">
                <h2 className="text-xl font-semibold">
                    Find Good First Issues
                </h2>
                <p className="text-sm font-semibold">
                    Select a language and search for GitHub issues.
                </p>

                <Select value={selectedLang} onValueChange={setSelectedLang}>
                <SelectTrigger data-testid="language-select" className="w-64">
                    <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                    {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                        {lang}
                    </SelectItem>
                    ))}
                </SelectContent>

                </Select>
                <Button onClick={fetchIssues} disabled={loading} className="hover:cursor-pointer">
                    {loading ? "Searching..." : "Find Issues"}
                </Button>
            </div>

            
            <div className="space-y-4 w-90 border-l-5 flex flex-col justify-center items-center  ">
                <h2 className="text-xl font-semibold">
                AI Issue Selector
                </h2>
                <p className="text-sm font-semibold">
                Can not pick? Let AI decide.
                </p>

                <Input data-testid="AI-Input" placeholder="Tell us what kind of issue you want..." value={userPrompt} onChange={(e) => setUserPrompt(e.target.value)} disabled={!issues.length} className="w-64"/>
                <Button onClick={getAISuggestion} disabled={!issues.length || AIloading} className="hover:cursor-pointer">
                    {AIloading ? "Loading..." :"Get AI Suggestion"}
                </Button>
            </div>
            </Card>
            {error && (
            <Alert variant="destructive" className="mt-4 w-[600px]">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                {errorMessage}
                </AlertDescription>
            </Alert>
            )}

            <div className="border-0 bg-transparent w-200 mt-5">
                {issues.map((issue, i) => (
                <Card onClick={() => window.open(issue.html_url, "_blank")} key={issue.id} id={`issue-${i}`} className={`p-4 hover:cursor-pointer transition-all duration-300 mb-5 ${highlightedIndex === i ? "border-2 border-green-500 scale-110 m-6 shadow-xl/20 shadow-green-600" : 
                    "border-1 hover:border-white hover:shadow-xl/20 hover:shadow-white "
      }`}>
                    <a href={issue.html_url} target="_blank" className="underline font-medium text-lg text-black dark:text-white">{issue.title}</a>
                    <div className="text-sm dark:text-gray-200 mt-2">
                        <p><strong>Repo:</strong> <a href={issue.repository.html_url} target="_blank" className="underline">{issue.repository.name}</a></p>
                        <p><strong>Repo Description:</strong> {issue.repository.description || "No description"}</p>

                    </div>
                    {highlightedIndex === i && aimessage != "" && (
                        <div className=" mt-2 p-4 border-l-4 border-green-500 bg-green-100 dark:bg-green-900/40 rounded-md shadow-md text-xs">
                            <strong className=" mb-1 text-green-800 dark:text-green-300 ">
                            Why AI chose this:
                            </strong>
                            <p className="text-gray-800 dark:text-gray-100">{aimessage}</p>
                        </div>
                        )}
                </Card>
            ))}
                </div>

            

        </div>







        </div>
  );
}