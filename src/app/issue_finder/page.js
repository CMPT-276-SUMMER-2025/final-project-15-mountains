"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, Calendar, GitBranch, Tag } from "lucide-react";

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
            setErrorMessage("Failed to fetch issues. Please try again after a few minutes");
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
        } catch (err) {
            setErrorMessage("Failed to generate suggestion. Please try again after a few minutes");
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
        <div className="min-h-screen py-20 px-4">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto text-center mb-16">
                <h1 className="text-gradient font-bold mb-6">
                    Issue Finder
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    Discover beginner-friendly GitHub issues in your favorite language. 
                    Use AI to pick the best one based on your interests and goals.
                </p>
            </div>

            {/* Search Controls */}
            <div className="max-w-6xl mx-auto mb-12">
                <Card className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Language Selection */}
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-4">
                                    <Search className="h-6 w-6 text-primary mr-2" />
                                    <h2 className="text-2xl font-semibold">Find Good First Issues</h2>
                                </div>
                                <p className="text-muted-foreground">
                                    Select a language and search for GitHub issues.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <Select value={selectedLang} onValueChange={setSelectedLang}>
                                    <SelectTrigger data-testid="language-select" className="w-full">
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
                                
                                <Button 
                                    onClick={fetchIssues} 
                                    disabled={loading} 
                                    className="w-full hover:scale-105 transition-transform duration-200"
                                >
                                    {loading ? "Searching..." : "Find Issues"}
                                </Button>
                            </div>
                        </div>

                        {/* AI Suggestion */}
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-4">
                                    <Sparkles className="h-6 w-6 text-primary mr-2" />
                                    <h2 className="text-2xl font-semibold">AI Issue Selector</h2>
                                </div>
                                <p className="text-muted-foreground">
                                     Need help deciding? Let AI help you choose.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <Input 
                                    data-testid="AI-Input" 
                                    placeholder="Tell us what kind of issue you want..." 
                                    value={userPrompt} 
                                    onChange={(e) => setUserPrompt(e.target.value)} 
                                    disabled={!issues.length} 
                                    className="w-full"
                                />
                                <Button 
                                    onClick={getAISuggestion} 
                                    disabled={!issues.length || AIloading} 
                                    variant="outline"
                                    className="w-full hover:scale-105 transition-transform duration-200"
                                >
                                    {AIloading ? "Loading..." : "Get AI Suggestion"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="max-w-6xl mx-auto mb-8">
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {errorMessage}
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            {/* Issues List */}
            <div className="max-w-6xl mx-auto">
                <div className="space-y-6">
                    {issues.map((issue, i) => (
                        <Card 
                            key={issue.id} 
                            id={`issue-${i}`} 
                            onClick={() => window.open(issue.html_url, "_blank")}
                            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                                highlightedIndex === i 
                                    ? "ring-2 ring-primary scale-105 shadow-xl" 
                                    : "hover:ring-1 hover:ring-border"
                            }`}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg mb-2 hover:text-primary transition-colors">
                                            {issue.title}
                                        </CardTitle>
                                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                                            <GitBranch className="h-4 w-4 mr-1" />
                                            <a 
                                                href={issue.repository.html_url} 
                                                target="_blank" 
                                                className="hover:text-primary transition-colors underline"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {issue.repository.name}
                                            </a>
                                            <span className="mx-2">•</span>
                                            <Calendar className="h-4 w-4 mr-1" />
                                            {new Date(issue.created_at).toLocaleDateString()}
                                        </div>
                                        {issue.repository.description && (
                                            <p className="text-sm text-muted-foreground mb-3">
                                                {issue.repository.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            
                            <CardContent>
                                {issue.labels.length > 0 && (
                                    <div className="flex items-center mb-4">
                                        <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <div className="flex flex-wrap gap-2">
                                            {issue.labels.map((label) => (
                                                <Badge 
                                                    key={label.name}
                                                    variant="secondary"
                                                    className="text-xs"
                                                    style={{
                                                        backgroundColor: `#${label.color}20`,
                                                        color: `#${label.color}`,
                                                        border: `1px solid #${label.color}40`
                                                    }}
                                                >
                                                    {label.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {highlightedIndex === i && aimessage && (
                                    <div className="mt-4 p-4 bg-primary/5 border-l-4 border-primary rounded-md">
                                        <div className="flex items-center mb-2">
                                            <Sparkles className="h-4 w-4 text-primary mr-2" />
                                            <strong className="text-primary text-sm">
                                                Why AI chose this:
                                            </strong>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{aimessage}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
                
                {issues.length === 0 && !loading && !error && (
                    <div className="text-center py-12">
                        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Select a language and search for issues to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}