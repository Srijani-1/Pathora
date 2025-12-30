import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Code2, Plus, FolderOpen, Clock, Calendar, CheckCircle2, PlayCircle } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '../lib/api';
import { useEffect } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  startDate: string;
  estimatedHours: string;
  technologies: string[];
}

type ProjectsViewProps = {
  onOpenProject: (projectId: number) => void;
};

export function ProjectsView({ onOpenProject }: ProjectsViewProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('logged_in_user') || '{}');
        if (!user.id) return;
        const data = await apiFetch(`/projects/user/${user.id}`);
        // Map backend fields to frontend interface if needed
        const mapped = data.map((p: any) => ({
          id: p.id.toString(),
          title: p.title,
          description: p.description,
          status: p.status,
          difficulty: p.difficulty,
          startDate: p.start_date,
          estimatedHours: p.estimated_hours,
          technologies: p.technologies.split(',').map((t: string) => t.trim())
        }));
        setProjects(mapped);
      } catch (error) {
        toast.error('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    difficulty: 'beginner' as const,
    estimatedHours: '',
    technologies: ''
  });

  const handleCreateProject = async () => {
    if (!newProject.title || !newProject.description || !newProject.estimatedHours) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('logged_in_user') || '{}');
      const projectData = {
        title: newProject.title,
        description: newProject.description,
        difficulty: newProject.difficulty,
        estimated_hours: newProject.estimatedHours,
        technologies: newProject.technologies
      };

      const created = await apiFetch(`/projects/?user_id=${user.id}`, {
        method: 'POST',
        body: JSON.stringify(projectData)
      });

      const mapped: Project = {
        id: created.id.toString(),
        title: created.title,
        description: created.description,
        status: created.status,
        difficulty: created.difficulty,
        startDate: created.start_date,
        estimatedHours: created.estimated_hours,
        technologies: created.technologies.split(',').map((t: string) => t.trim())
      };

      setProjects(prev => [...prev, mapped]);
      setDialogOpen(false);
      setNewProject({
        title: '',
        description: '',
        difficulty: 'beginner',
        estimatedHours: '',
        technologies: ''
      });

      toast.success('Project created successfully! 🎉');
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  const handleStartProject = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    try {
      await apiFetch(`/projects/${projectId}/status?status=in-progress`, {
        method: 'PUT'
      });
      setProjects(prev => prev.map(p =>
        p.id === projectId ? { ...p, status: 'in-progress' as const } : p
      ));
      toast.success('Project started! Good luck! 🚀');
    } catch (error) {
      toast.error('Failed to update project status');
    }
  };

  const handleCompleteProject = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    try {
      await apiFetch(`/projects/${projectId}/status?status=completed`, {
        method: 'PUT'
      });
      setProjects(prev => prev.map(p =>
        p.id === projectId ? { ...p, status: 'completed' as const } : p
      ));
      toast.success('Project completed! Amazing work! 🎉');
    } catch (error) {
      toast.error('Failed to update project status');
    }
  };

  const handleReopenProject = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation(); // Prevent opening the editor
    try {
      await apiFetch(`/projects/${projectId}/status?status=in-progress`, {
        method: 'PUT'
      });
      setProjects(prev => prev.map(p =>
        p.id === projectId ? { ...p, status: 'in-progress' as const } : p
      ));
      toast.success('Project reopened! 🚀');
    } catch (error) {
      toast.error('Failed to update project status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'in-progress': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'planning': return 'bg-amber-500/10 text-amber-700 dark:text-amber-400';
      default: return '';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-teal-500/10 text-teal-700 dark:text-teal-400';
      case 'intermediate': return 'bg-violet-500/10 text-violet-700 dark:text-violet-400';
      case 'advanced': return 'bg-red-500/10 text-red-700 dark:text-red-400';
      default: return '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl mb-2">Projects</h1>
          <p className="text-muted-foreground">Apply your skills with hands-on projects</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#4338ca] hover:bg-[#4338ca]/90">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Start a new project to apply your learning
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  placeholder="E.g., E-commerce Website"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="What will you build?"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty *</Label>
                <Select
                  value={newProject.difficulty}
                  onValueChange={(value) => setNewProject({ ...newProject, difficulty: value as any })}
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Estimated Hours *</Label>
                <Input
                  id="hours"
                  placeholder="E.g., 10-15"
                  value={newProject.estimatedHours}
                  onChange={(e) => setNewProject({ ...newProject, estimatedHours: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                <Input
                  id="technologies"
                  placeholder="E.g., React, Node.js, MongoDB"
                  value={newProject.technologies}
                  onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject} className="bg-[#4338ca] hover:bg-[#4338ca]/90">
                Create Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <Card className="p-12 text-center">
          <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg mb-2">No Projects Yet</h3>
          <p className="text-muted-foreground mb-4">
            Start your first project to apply what you've learned
          </p>
          <Button onClick={() => setDialogOpen(true)} className="bg-[#4338ca] hover:bg-[#4338ca]/90">
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-md transition-shadow"
              onClick={() => onOpenProject(Number(project.id))}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Code2 className="w-5 h-5 text-[#4338ca] flex-shrink-0 mt-1" />
                  <div className="flex gap-2 flex-wrap">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.replace('-', ' ')}
                    </Badge>
                    <Badge className={getDifficultyColor(project.difficulty)}>
                      {project.difficulty}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{project.estimatedHours} hours</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(project.startDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  {project.status === 'planning' && (
                    <Button
                      onClick={(e) => handleStartProject(e, project.id)} // Pass 'e'
                      className="flex-1 bg-[#4338ca] hover:bg-[#4338ca]/90"
                      size="sm"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Start Project
                    </Button>
                  )}
                  {project.status === 'in-progress' && (
                    <Button
                      onClick={(e) => handleCompleteProject(e, project.id)} // Pass 'e'
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}

                  {/* --- UPDATED THIS SECTION --- */}
                  {project.status === 'completed' && (
                    <Button
                      onClick={(e) => handleReopenProject(e, project.id)}
                      className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      size="sm"
                      variant="outline"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Reopen Project
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
