import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  BookOpen, Video, FileText, Code, 
  ExternalLink, Search, Filter, ArrowLeft
} from 'lucide-react';

interface OfficialDocsViewProps {
  onNavigate?: (view: string) => void;
}

export function OfficialDocsView({ onNavigate }: OfficialDocsViewProps = {}) {
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
      id: '7',
      title: 'TypeScript Handbook',
      description: 'Official TypeScript documentation and guides',
      type: 'Documentation',
      category: 'Language',
      url: '#',
      icon: BookOpen
    },
    {
      id: '8',
      title: 'Node.js Documentation',
      description: 'Official Node.js API documentation',
      type: 'Documentation',
      category: 'Backend',
      url: '#',
      icon: BookOpen
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
        <h1>Official Documentation</h1>
        <p className="text-muted-foreground mt-1">
          Authoritative references and official guides
        </p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search documentation..." 
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
          <CardTitle>All Official Documentation</CardTitle>
          <CardDescription>
            Browse our collection of official documentation
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
    </div>
  );
}