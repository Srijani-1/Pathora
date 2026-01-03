import {
    SandpackProvider,
    SandpackLayout,
    SandpackCodeEditor,
    SandpackPreview,
    SandpackFileExplorer,
    SandpackConsole,
    useSandpack
} from "@codesandbox/sandpack-react";
import { nightOwl, githubLight } from "@codesandbox/sandpack-themes";
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import { toast } from "sonner";
import { Plus, Trash2, FileCode, Eye, Layout, Terminal as TerminalIcon, Save } from "lucide-react";

// --- 1. RE-ADD THE SAVE BUTTON COMPONENT ---
function SaveButton({ projectId, projectMetadata, onSaveSuccess }: { projectId: number, projectMetadata: any, onSaveSuccess: () => void }) {
    const { sandpack } = useSandpack();
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        const toastId = toast.loading("Saving full-stack repository...");
        try {
            // Transform sandpack files to clean dictionary
            const rawFiles = sandpack.files;
            const filesToSave: Record<string, string> = {};
            Object.keys(rawFiles).forEach(path => {
                filesToSave[path] = rawFiles[path].code;
            });

            const token = localStorage.getItem('access_token');
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...projectMetadata,
                    files: filesToSave
                }),
            });

            if (!response.ok) throw new Error("Save failed");

            toast.success("Repository saved successfully!", { id: toastId });
            onSaveSuccess();
        } catch (error: any) {
            toast.error(error.message || "Error saving project", { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-md text-xs font-bold shadow-lg transition-all active:scale-95"
        >
            <Save size={14} />
            {isSaving ? "SAVING..." : "SAVE"}
        </button>
    );
}

// --- 2. FILE OPERATIONS COMPONENT ---
function FileOperations() {
    const { sandpack } = useSandpack();
    const [newFileName, setNewFileName] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    const addFile = () => {
        if (!newFileName) return;
        const path = newFileName.startsWith("/") ? newFileName : `/${newFileName}`;
        try {
            sandpack.addFile(path, "// New file\n");
            setNewFileName("");
            setIsAdding(false);
            toast.success(`Created ${path}`);
        } catch (e) { toast.error("Invalid path or duplicate file"); }
    };

    return (
        <div className="p-3 border-b border-white/10 bg-black/20">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase opacity-40 tracking-widest text-white">Repository</span>
                <div className="flex gap-3">
                    <button onClick={() => setIsAdding(!isAdding)} className="text-white/60 hover:text-blue-400">
                        <Plus size={16} />
                    </button>
                    <button onClick={() => sandpack.deleteFile(sandpack.activeFile)} className="text-white/60 hover:text-red-400">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
            {isAdding && (
                <div className="space-y-1">
                    <input
                        autoFocus
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addFile()}
                        placeholder="e.g. routes/api.js"
                        className="w-full bg-slate-800 border border-white/10 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                    />
                    <p className="text-[9px] text-white/30 italic">Folders are created automatically via /</p>
                </div>
            )}
        </div>
    );
}

// --- 3. MAIN EDITOR VIEW ---
export function ProjectEditorView({ projectId, onSaveSuccess }: { projectId: number, onSaveSuccess: () => void }) {
    const [project, setProject] = useState<any>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeMobileTab, setActiveMobileTab] = useState<'files' | 'code' | 'preview' | 'terminal'>('code');

    useEffect(() => {
        const checkTheme = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        };
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const fetchProject = async () => {
            const data = await apiFetch(`/projects/${projectId}`);
            setProject(data);
        };
        fetchProject();
    }, [projectId]);

    if (!project) return <div className="p-6 text-center text-white">Loading Full-Stack IDE...</div>;

    const fullStackSkeleton = {
        "/package.json": JSON.stringify({
            dependencies: { "express": "^4.18.2" },
            scripts: { "start": "node server.js" },
            main: "server.js"
        }, null, 2),
        "/server.js": `const express = require('express');\nconst app = express();\nconst port = 3000;\n\napp.get('/api/hello', (req, res) => {\n  res.json({ message: "Hello from Backend!" });\n});\n\napp.listen(port, () => {\n  console.log('Server running on port ' + port);\n});`,
        "/App.js": `import React, { useState, useEffect } from "react";\n\nexport default function App() {\n  const [msg, setMsg] = useState("Loading...");\n  useEffect(() => {\n    fetch('/api/hello').then(r => r.json()).then(d => setMsg(d.message));\n  }, []);\n  return <h1>{msg}</h1>;\n}`,
        "/index.js": `import React from "react";\nimport { createRoot } from "react-dom/client";\nimport App from "./App";\nconst root = createRoot(document.getElementById("root"));\nroot.render(<App />);`
    };

    const initialFiles = (project.files && Object.keys(project.files).length > 0) ? project.files : fullStackSkeleton;

    return (
        <div className={`flex flex-col h-screen overflow-hidden ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-gray-100'}`}>
            <SandpackProvider
                template="node" // Crucial for backend support
                theme={isDarkMode ? nightOwl : githubLight}
                files={initialFiles}
            >
                {/* HEADER */}
                <div className="px-4 py-3 border-b flex justify-between items-center bg-slate-900 border-white/10 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">
                            {project.title.charAt(0)}
                        </div>
                        <h1 className="text-sm font-bold truncate max-w-[150px]">{project.title}</h1>
                    </div>

                    <SaveButton
                        projectId={projectId}
                        projectMetadata={{ ...project }}
                        onSaveSuccess={onSaveSuccess}
                    />
                </div>

                {/* MOBILE TABS */}
                <div className="lg:hidden flex border-b border-white/10 bg-slate-900/80 p-1">
                    {['files', 'code', 'preview', 'terminal'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveMobileTab(tab as any)}
                            className={`flex-1 py-2 text-[10px] font-bold rounded uppercase transition-all ${activeMobileTab === tab ? 'bg-blue-600 text-white' : 'text-white/30'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* EXPLORER */}
                    <div className={`${activeMobileTab === 'files' ? 'flex' : 'hidden lg:flex'} w-full lg:w-64 border-r flex-col bg-slate-900 border-white/5`}>
                        <FileOperations />
                        <div className="flex-1 overflow-y-auto px-2 py-2">
                            <SandpackFileExplorer />
                        </div>
                    </div>

                    {/* MAIN CONTENT AREA */}
                    <div className={`flex-1 ${activeMobileTab === 'files' ? 'hidden lg:flex' : 'flex'} flex-col min-w-0`}>
                        <SandpackLayout style={{ height: '100%', border: 'none', borderRadius: 0 }}>

                            {/* EDITOR */}
                            <div className={`h-full flex-1 ${activeMobileTab === 'code' ? 'flex' : 'hidden lg:flex'}`}>
                                <SandpackCodeEditor style={{ height: '100%' }} showTabs closableTabs showLineNumbers wrapContent />
                            </div>

                            {/* PREVIEW & TERMINAL STACK */}
                            <div className={`h-full flex-1 flex-col ${activeMobileTab === 'preview' || activeMobileTab === 'terminal' ? 'flex' : 'hidden lg:flex'}`}>
                                <div className={`flex-1 ${activeMobileTab === 'preview' ? 'flex' : 'hidden lg:flex'}`}>
                                    <SandpackPreview style={{ height: '100%' }} showNavigator />
                                </div>
                                <div className={`h-1/3 border-t border-white/10 ${activeMobileTab === 'terminal' ? 'flex' : 'hidden lg:flex'}`}>
                                    <div className="flex flex-col w-full h-full bg-[#011627]">
                                        <div className="px-3 py-1 bg-black/40 text-[9px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                            <TerminalIcon size={10} /> Node Terminal
                                        </div>
                                        <SandpackConsole style={{ flex: 1 }} />
                                    </div>
                                </div>
                            </div>
                        </SandpackLayout>
                    </div>
                </div>
            </SandpackProvider>

            <style>{`
                .sp-layout { display: flex !important; flex-direction: row !important; height: 100% !important; }
                .sp-stack { height: 100% !important; width: 100% !important; }
                @media (max-width: 1023px) { .sp-layout { flex-direction: column !important; } }
                
                /* Terminal Styling */
                .sp-console { background: transparent !important; }
                .sp-console-list { font-family: monospace !important; font-size: 12px !important; }
            `}</style>
        </div>
    );
}
