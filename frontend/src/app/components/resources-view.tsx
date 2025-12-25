import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  BookOpen, Video, FileText, Code, 
  ExternalLink, Search, Filter 
} from 'lucide-react';

interface ResourcesViewProps {
  onNavigate: (view: string) => void;
}

export function ResourcesView({ onNavigate }: ResourcesViewProps) {
  const resources = [
    {
      id: '1',
      title: 'MDN Web Docs',
      description: 'Comprehensive documentation for web technologies',
      type: 'Documentation',
      category: 'Foundation',
      url: '#',
      icon: BookOpen
    },
    {
      id: '2',
      title: 'React Official Documentation',
      description: 'The official React documentation and tutorials',
      type: 'Documentation',
      category: 'Framework',
      url: '#',
      icon: BookOpen
    },
    {
      id: '3',
      title: 'JavaScript.info',
      description: 'Modern JavaScript tutorial from basics to advanced',
      type: 'Tutorial',
      category: 'Foundation',
      url: '#',
      icon: FileText
    },
    {
      id: '4',
      title: 'Frontend Masters',
      description: 'Advanced web development video courses',
      type: 'Video Course',
      category: 'Advanced',
      url: '#',
      icon: Video
    },
    {
      id: '5',
      title: 'LeetCode',
      description: 'Practice coding problems and algorithms',
      type: 'Practice',
      category: 'Coding',
      url: '#',
      icon: Code
    },
    {
      id: '6',
      title: 'CSS-Tricks',
      description: 'Tips, tricks, and techniques on CSS',
      type: 'Articles',
      category: 'Styling',
      url: '#',
      icon: FileText
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1>Learning Resources</h1>
        <p className="text-muted-foreground mt-1">
          Curated collection of high-quality learning materials
        </p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search resources..." 
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resource Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-[#4338ca]/20 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('official-docs')}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#4338ca]/10">
                <BookOpen className="w-5 h-5 text-[#4338ca]" />
              </div>
              <div>
                <CardTitle className="text-base">Official Documentation</CardTitle>
                <CardDescription className="text-xs">
                  Authoritative references
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              3 resources available
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#14b8a6]/20 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('video-courses')}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#14b8a6]/10">
                <Video className="w-5 h-5 text-[#14b8a6]" />
              </div>
              <div>
                <CardTitle className="text-base">Video Courses</CardTitle>
                <CardDescription className="text-xs">
                  Interactive learning
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              5 courses available
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#10b981]/20 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('practice-platforms')}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#10b981]/10">
                <Code className="w-5 h-5 text-[#10b981]" />
              </div>
              <div>
                <CardTitle className="text-base">Practice Platforms</CardTitle>
                <CardDescription className="text-xs">
                  Hands-on coding
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              4 platforms available
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#7c3aed]/20 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('articles-tutorials')}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#7c3aed]/10">
                <FileText className="w-5 h-5 text-[#7c3aed]" />
              </div>
              <div>
                <CardTitle className="text-base">Articles & Tutorials</CardTitle>
                <CardDescription className="text-xs">
                  In-depth guides
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              12 articles available
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resource List */}
      <Card>
        <CardHeader>
          <CardTitle>All Resources</CardTitle>
          <CardDescription>
            Browse our complete collection of learning materials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {resources.map((resource) => {
              const Icon = resource.icon;
              return (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-[#4338ca]/50 hover:bg-accent transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-muted">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{resource.title}</p>
                        <Badge variant="outline" className="text-xs">
                          {resource.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {resource.description}
                      </p>
                      <Badge variant="outline" className="text-xs mt-2">
                        {resource.category}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Suggested Resources */}
      <Card className="bg-gradient-to-br from-[#f59e0b]/5 to-transparent border-[#f59e0b]/20">
        <CardHeader>
          <CardTitle>Suggested for Your Current Skill</CardTitle>
          <CardDescription>
            Resources tailored to React Fundamentals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-card rounded-lg border border-border">
            <p className="font-medium mb-1">React Hooks Complete Guide</p>
            <p className="text-sm text-muted-foreground mb-2">
              Deep dive into useState, useEffect, and custom hooks
            </p>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">Video Course</Badge>
              <Button variant="outline" size="sm">
                View Resource
                <ExternalLink className="w-3 h-3 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
