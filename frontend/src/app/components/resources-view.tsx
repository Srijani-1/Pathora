import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  BookOpen, Video, FileText, Code,
  ExternalLink, Search, Filter, Loader2
} from 'lucide-react';
import { apiFetch } from '../lib/api';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';

const iconMap: Record<string, any> = {
  BookOpen, Video, FileText, Code
};

// Define categories to match backend strings
const CATEGORIES = [
  { id: 'videos', label: 'Video Courses', icon: Video, color: 'text-[#14b8a6]', bg: 'bg-[#14b8a6]/10', border: 'border-[#14b8a6]/20' },
  { id: 'practice', label: 'Practice Platforms', icon: Code, color: 'text-[#10b981]', bg: 'bg-[#10b981]/10', border: 'border-[#10b981]/20' },
  { id: 'articles', label: 'Articles & Tutorials', icon: FileText, color: 'text-[#7c3aed]', bg: 'bg-[#7c3aed]/10', border: 'border-[#7c3aed]/20' },
];

export function ResourcesView() {
  const [resources, setResources] = useState<any[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [resourceData, statsData] = await Promise.all([
          apiFetch('/resources/'),
          apiFetch('/resources/stats')
        ]);
        setResources(resourceData);
        setStats(statsData);
      } catch (error) {
        toast.error('Failed to connect to resources library');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter Logic
  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory ? res.category === activeCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [resources, searchQuery, activeCategory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Learning Resources</h1>
          <p className="text-muted-foreground mt-1">
            Curated collection of high-quality learning materials
          </p>
        </div>
        {activeCategory && (
          <Button variant="ghost" size="sm" onClick={() => setActiveCategory(null)}>
            Clear Filters
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or description..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const count = stats[cat.label] || 0;
          return (
            <Card
              key={cat.id}
              className={`cursor-pointer transition-all hover:shadow-md ${cat.border} ${activeCategory === cat.label ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setActiveCategory(activeCategory === cat.label ? null : cat.label)}
            >
              <CardHeader className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${cat.bg}`}>
                    <Icon className={`w-5 h-5 ${cat.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold">{cat.label}</CardTitle>
                    <CardDescription className="text-xs">
                      {count} {count === 1 ? 'Resource' : 'Resources'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Resource List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>
                {activeCategory ? `${activeCategory}` : 'All Resources'}
              </CardTitle>
              <CardDescription>
                {filteredResources.length} materials found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredResources.length > 0 ? (
              filteredResources.map((resource) => {
                const Icon = iconMap[resource.icon_name] || BookOpen;
                return (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-all group"
                    onClick={() => window.open(resource.url, '_blank')}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                        <Icon className="w-5 h-5 group-hover:text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">{resource.title}</p>
                          <Badge variant="secondary" className="text-[10px] uppercase">
                            {resource.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {resource.description}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="ml-4 flex-shrink-0">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Search className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p>No resources found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
