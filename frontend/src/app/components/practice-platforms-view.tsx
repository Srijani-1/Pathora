import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  BookOpen, Video, FileText, Code, 
  ExternalLink, Search, Filter, ArrowLeft
} from 'lucide-react';

interface PracticePlatformsViewProps {
  onNavigate?: (view: string) => void;
}

export function PracticePlatformsView({ onNavigate }: PracticePlatformsViewProps = {}) {
  const resources = [
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
      id: '12',
      title: 'HackerRank',
      description: 'Coding challenges and skill assessments',
      type: 'Practice',
      category: 'Coding',
      url: '#',
      icon: Code
    },
    {
      id: '13',
      title: 'CodeWars',
      description: 'Kata-style coding challenges',
      type: 'Practice',
      category: 'Coding',
      url: '#',
      icon: Code
    },
    {
      id: '14',
      title: 'Exercism',
      description: 'Mentored coding exercises in multiple languages',
      type: 'Practice',
      category: 'Coding',
      url: '#',
      icon: Code
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4" 
          onClick={() => onNavigate?.('resources')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Resources
        </Button>
        <h1>Practice Platforms</h1>
        <p className="text-muted-foreground mt-1">
          Hands-on coding practice and challenges
        </p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search practice platforms..." 
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

      {/* Resource List */}
      <Card>
        <CardHeader>
          <CardTitle>All Practice Platforms</CardTitle>
          <CardDescription>
            Browse our collection of coding practice platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {resources.map((resource) => {
              const Icon = resource.icon;
              return (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-[#10b981]/50 hover:bg-accent transition-all cursor-pointer"
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
    </div>
  );
}