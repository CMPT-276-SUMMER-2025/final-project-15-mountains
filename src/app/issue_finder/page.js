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

export default function IssueSelector() {
    const [selectedLang, setSelectedLang] = useState("JavaScript");
    const languages = ["JavaScript", "Python", "TypeScript", "Go", "Java", "C++", "Rust"];

    const [loading,setLoading] = useState(false);
    const [issues,setIssues] = useState([]);

    const fetchIssues = async () => {
        setLoading(true);
        const res = await fetch(`/api/github_api/issue_finder?lang=${selectedLang}`);
        const data = await res.json();
        setIssues(data);
        setLoading(false);
    };
    return (
        <div>
        <div className="flex flex-col justify-end items-center h-[20vh] mb-15">
            <h1 className="text-7xl">Issue Finder</h1>
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
                <SelectTrigger className="w-64">
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
                    {loading ? "searching..." : "Find Issues"}
                </Button>
            </div>

            
            <div className="space-y-4 w-90 border-l-5 flex flex-col justify-center items-center  text-gray-500">
                <h2 className="text-xl font-semibold">
                AI Issue Selector
                </h2>
                <p className="text-sm font-semibold">
                Can't pick? Let AI decide.
                </p>

                <Input placeholder="Tell us what kind of issue you want..." disabled={true} className="w-64" />
                <Button disabled={true} className="hover:cursor-pointer">
                    Coming soon
                </Button>
            </div>
            </Card>
            <div className="border-0 bg-transparent w-200 mt-5">
                {issues.map((issue, i) => (
                <Card key={issue.id} id={`issue-${i}`} className={"p-4 transition-all duration-300 mb-5"}>
                    <a href={issue.html_url} className="underline font-medium text-lg">{issue.title}</a>
                    <div className="text-sm text-gray-200 mt-2">
                        <p><strong>Repo:</strong> <a href={issue.repository.html_url} target="_blank" className="underline">{issue.repository.name}</a></p>
                        <p><strong>Repo Description:</strong> {issue.repository.description || "No description"}</p>
                        <p><strong>Stars:</strong> {issue.repository.stargazers_count} &nbsp;&nbsp; <strong>|| Forks:</strong> {issue.repository.forks_count}</p>
                    </div>
                </Card>
            ))}
                </div>

            

        </div>







        </div>
  );
}