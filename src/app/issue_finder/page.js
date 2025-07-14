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

    const fetchIssues = async () => {
        setLoading(true);
        const response = await fetch("/api/github_api/issue_finder");
        const data = await response.json();
        console.log(data);
        setLoading(false);
    };
    return (
        <div>
        <div className="flex flex-col justify-end items-center h-[20vh] border-">
            <h1 className="text-7xl">Issue Finder</h1>
        </div>
        <div className="flex flex-col justify-center items-center mt-5 border-">
        <Card className="p-6 flex flex-row justify-center px-10 mb-3 border-2">
            
            <div className="space-y-4 border-r-5 pr-15 flex flex-col justify-center items-center">
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

            
            <div className="space-y-4 w-90 border-l-5 flex flex-col justify-center items-center ">
                <h2 className="text-xl font-semibold">
                AI Issue Selector
                </h2>
                <p className="text-sm font-semibold">
                Can't pick? Let AI decide.
                </p>

                <Input
                placeholder="Tell us what kind of issue you want..."
                disabled={true}
                className="w-64"
                />
                <Button className="hover:cursor-pointer">
                Ask AI to Choose
                </Button>
            </div>
            </Card>

        </div>







        </div>
  );
}