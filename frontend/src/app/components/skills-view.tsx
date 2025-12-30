import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  CheckCircle2, Clock, Search, Filter,
  Circle, PlayCircle, ArrowRight
} from 'lucide-react';
import { Skill } from '../types/learning';
import { useState, useMemo } from 'react';

interface SkillsViewProps {
  skills: Skill[];
  onSkillClick: (skillId: string) => void;
}

export function SkillsView({ skills, onSkillClick }: SkillsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredSkills = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) return skills;

    return skills.filter(skill =>
      skill.title.toLowerCase().includes(query) ||
      skill.description.toLowerCase().includes(query) ||
      skill.category.toLowerCase().includes(query)
    );
  }, [skills, searchQuery]);

  const getStatusColor = (status: Skill['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20';
      case 'in-progress':
        return 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20';
      case 'upcoming':
        return 'bg-[#14b8a6]/10 text-[#14b8a6] border-[#14b8a6]/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status: Skill['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-[#10b981]" />;
      case 'in-progress':
        return <PlayCircle className="w-5 h-5 text-[#f59e0b]" />;
      default:
        return <Circle className="w-5 h-5 text-[#14b8a6]" />;
    }
  };

  const categories = Array.from(new Set(filteredSkills.map(s => s.category)));

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1>All Skills</h1>
        <p className="text-muted-foreground mt-1">
          Browse and manage your learning skills
        </p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search skills..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button> */}
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Skills</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{skills.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-[#10b981]">
              {skills.filter(s => s.status === 'completed').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In Progress</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-[#f59e0b]">
              {skills.filter(s => s.status === 'in-progress').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Upcoming</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-[#14b8a6]">
              {skills.filter(s => s.status === 'upcoming').length}
            </p>
          </CardContent>
        </Card>
      </div>
      {filteredSkills.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No skills match your search.
          </CardContent>
        </Card>
      )}

      {/* Skills by Category */}
      {categories.map((category) => {
        const categorySkills = filteredSkills.filter(
          s => s.category === category
        );


        return (
          <div key={category}>
            <h2 className="mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorySkills.map((skill) => (
                <Card
                  key={skill.id}
                  className="hover:shadow-md transition-all cursor-pointer border-2 hover:border-[#4338ca]/50"
                  onClick={() => onSkillClick(skill.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      {getStatusIcon(skill.status)}
                      <Badge className={getStatusColor(skill.status)}>
                        {skill.status === 'in-progress' ? 'In Progress' :
                          skill.status === 'completed' ? 'Completed' : 'Upcoming'}
                      </Badge>
                    </div>
                    <CardTitle className="text-base">{skill.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {skill.description.includes('#') || skill.description.length > 200
                        ? skill.description.replace(/#[^\n]*\n/g, '').split('\n\n')[0].slice(0, 150) + '...'
                        : skill.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {skill.estimatedTime}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {skill.difficulty}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSkillClick(skill.id);
                        }}
                      >
                        {skill.status === 'completed' ? 'Review' :
                          skill.status === 'in-progress' ? 'Continue' : 'Start'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
