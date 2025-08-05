# Final Project — CMPT 276 Group 15: Mountains - GitGood

A web app that helps developers level up their GitHub presence with AI-powered tools, beginner-friendly issue discovery, README feedback, and personalized GitHub growth tools.
```
.
├── docs                    # Documentation files
│   ├── proposal            # Project proposal
│   ├── design              # Design documentation
│   ├── final               # Final report and deliverables
│   ├── communication       # Meeting notes and communication logs
│   ├── ai-disclosure       # AI usage disclosures
├── misc                    # miscellaneous files
│   ├── ...         
├── src                     # Source files 
│   ├── app                 # Main application code
│   ├── public              # Static assets (png, svg, jpeg, etc.)
│   ├── tests               # Playwright testing files
│   └── ...                 # Additional source components      
├── tools                   # Development tools and utilities
└── README.md               # Project overview (this file)
```
##  Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (comes with Node)

##  Installation

Clone the repository and install dependencies:

```bash
git clone git@github.com:CMPT-276-SUMMER-2025/final-project-15-mountains.git
cd final-project-15-mountains/src
npm install
```
## 🔐 Set Up Environment Variables

Create a `.env.local` file in the root of the project and add the following:

```env
GH_TOKEN=your_github_api_token
AI_TOKEN=your_openai_api_token
```

Replace `your_github_api_token` and `your_openai_api_token` with your actual API keys.
##  Running the App Locally

Start the development server:

```bash
npm run dev
```

Then open your browser and go to:

```
http://localhost:3000
```

##  Building for Production

To build the project:

```bash
npm run build
```

Then preview the production build:

```bash
npm run start
```

## M1 - Project Report
[CMPT 276 - Project Report - Milestone 1](CMPT%20276%20-%20Project%20Report-%20milestone%201.pdf)

## M0 - Project Proposal
[Project Proposal](project%20proposal%20(2).pdf)
## 📄 License

MIT License
