"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Mail, Code, Users, Zap, Target } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Amar Koonar",
      role: "Project Manager",
      github: "https://github.com/amarkoonar",
      linkedin: "https://www.linkedin.com/in/amar-koonar-36a186365/?originalSubdomain=ca",
      email: "ask41@sfu.ca"
    },
    {
      name: "Edward Lee",
      role: "DevOps Engineer",
      github: "https://github.com/euidml",
      linkedin: "FILL_IN",
      email: "ela145@sfu.ca"
    },
    {
      name: "Matthew Tsui",
      role: "QA Developer",
      github: "https://github.com/MatthewTsui2001",
      linkedin: "FILL_IN",
      email: "FILL_IN@example.com"
    },
    {
      name: "Thomas Brigham",
      role: "UI/UX Designer",
      github: "https://github.com/denoire",
      linkedin: "FILL_IN",
      email: "FILL_IN@example.com"
    }
  ];

  const features = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Smart Issue Matching",
      description: "AI-powered recommendations that match your skills with the perfect GitHub issues."
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Markdown Editor",
      description: "Advanced markdown editor with AI assistance for creating beautiful documentation."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Profile Comparison",
      description: "Compare GitHub profiles and discover collaboration opportunities with other developers."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "AI Chatbot",
      description: "Get instant help and guidance for your development challenges with our intelligent chatbot."
    }
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center mb-20">
        <h1 className="text-gradient font-bold mb-6">
          About GitGood
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
          We're passionate about making open source contribution accessible to everyone. 
          GitGood combines the power of AI with the collaborative spirit of GitHub to help 
          developers find their perfect contribution opportunities.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Badge variant="secondary" className="text-sm px-4 py-2">
            AI-Powered
          </Badge>
          <Badge variant="secondary" className="text-sm px-4 py-2">
            Open Source
          </Badge>
          <Badge variant="secondary" className="text-sm px-4 py-2">
            Developer Tools
          </Badge>
          <Badge variant="secondary" className="text-sm px-4 py-2">
            GitHub Integration
          </Badge>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto mb-20">
        <Card className="bg-gradient-to-br from-primary/5 to-blue-500/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Our Mission</CardTitle>
            <CardDescription className="text-lg max-w-4xl mx-auto">
              To democratize open source contribution by providing intelligent tools that help developers 
              of all skill levels find meaningful projects and make impactful contributions to the global 
              developer community.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <div className="text-primary">
                    {feature.icon}
                  </div>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{member.name}</CardTitle>
                <CardDescription className="text-primary font-medium">
                  {member.role}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center space-x-2">
                  <Link href={member.github} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Github className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={member.linkedin} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`mailto:${member.email}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto text-center">
        <Card className="bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl mb-4">Ready to Get Started?</CardTitle>
            <CardDescription className="text-lg">
              Join thousands of developers who are already using GitGood to find their next open source contribution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="px-8 py-3 text-lg">
                <Link href="/issue_finder">Start Finding Issues</Link>
              </Button>
              <Button variant="outline" asChild className="px-8 py-3 text-lg">
                <Link href="/chatbot">Try Our Chatbot</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 