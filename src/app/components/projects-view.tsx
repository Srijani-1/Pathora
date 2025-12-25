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

export function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('user_projects');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: 'Personal Portfolio Website',
        description: 'Build a responsive portfolio to showcase your projects and skills',
        status: 'completed',
        difficulty: 'beginner',
        startDate: '2024-01-15',
        estimatedHours: '10-15',
        technologies: ['HTML', 'CSS', 'JavaScript']
      },
      {
        id: '2',
        title: 'Task Management App',
        description: 'Create a full-stack todo application with user authentication',
        status: 'in-progress',
        difficulty: 'intermediate',
        startDate: '2024-02-01',
        estimatedHours: '20-30',
        technologies: ['React', 'Node.js', 'MongoDB']
      }
    ];
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    difficulty: 'beginner' as const,
    estimatedHours: '',
    technologies: ''
  });

  const handleCreateProject = () => {
    if (!newProject.title || !newProject.description || !newProject.estimatedHours) {
      toast.error('Please fill in all required fields');
      return;
    }

    const project: Project = {
      id: Date.now().toString(),
      title: newProject.title,
      description: newProject.description,
      status: 'planning',
      difficulty: newProject.difficulty,
      startDate: new Date().toISOString(),
      estimatedHours: newProject.estimatedHours,
      technologies: newProject.technologies.split(',').map(t => t.trim()).filter(Boolean)
    };

    const updated = [...projects, project];
    setProjects(updated);
    localStorage.setItem('user_projects', JSON.stringify(updated));
    
    setDialogOpen(false);
    setNewProject({
      title: '',
      description: '',
      difficulty: 'beginner',
      estimatedHours: '',
      technologies: ''
    });
    
    toast.success('Project created successfully! 🎉');
  };

  const handleStartProject = (projectId: string) => {
    const updated = projects.map(p => 
      p.id === projectId ? { ...p, status: 'in-progress' as const } : p
    );
    setProjects(updated);
    localStorage.setItem('user_projects', JSON.stringify(updated));
    toast.success('Project started! Good luck! 🚀');
  };

  const handleCompleteProject = (projectId: string) => {
    const updated = projects.map(p => 
      p.id === projectId ? { ...p, status: 'completed' as const } : p
    );
    setProjects(updated);
    localStorage.setItem('user_projects', JSON.stringify(updated));
    toast.success('Project completed! Amazing work! 🎉');
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
            <Card key={project.id} className="hover:shadow-md transition-shadow">
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
                      onClick={() => handleStartProject(project.id)}
                      className="flex-1 bg-[#4338ca] hover:bg-[#4338ca]/90"
                      size="sm"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Start Project
                    </Button>
                  )}
                  {project.status === 'in-progress' && (
                    <Button
                      onClick={() => handleCompleteProject(project.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}
                  {project.status === 'completed' && (
                    <Button
                      disabled
                      className="flex-1"
                      size="sm"
                      variant="outline"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Completed
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
