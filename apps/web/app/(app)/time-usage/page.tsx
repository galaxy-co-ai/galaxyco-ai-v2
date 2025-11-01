'use client';

import { DetailPage } from '@/components/templates/detail-page';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  Target,
  TrendingUp,
  Activity,
  Calendar,
  BarChart3,
  Timer,
  Play,
  Pause,
} from 'lucide-react';

// Mock data for time usage dashboard
const timeMetrics = [
  {
    label: "Today's Hours",
    value: '6.5h',
    change: '+1.2h from yesterday',
    trend: 'up' as const,
    icon: <Clock className="h-5 w-5" />,
  },
  {
    label: 'Weekly Goal',
    value: '32/40h',
    change: '80% completed',
    trend: 'up' as const,
    icon: <Target className="h-5 w-5" />,
  },
  {
    label: 'Productivity Score',
    value: '87%',
    change: '+5% this week',
    trend: 'up' as const,
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    label: 'Focus Sessions',
    value: '12',
    change: '4 today',
    trend: 'up' as const,
    icon: <Activity className="h-5 w-5" />,
  },
];

const projectBreakdown = [
  {
    project: 'GalaxyCo Platform',
    hours: 18.5,
    percentage: 46,
    color: 'bg-blue-500',
    tasks: 12,
  },
  {
    project: 'Client Portal',
    hours: 8.2,
    percentage: 20,
    color: 'bg-green-500',
    tasks: 7,
  },
  {
    project: 'Mobile App',
    hours: 7.8,
    percentage: 19,
    color: 'bg-purple-500',
    tasks: 5,
  },
  {
    project: 'Admin Dashboard',
    hours: 4.1,
    percentage: 10,
    color: 'bg-orange-500',
    tasks: 3,
  },
  {
    project: 'Documentation',
    hours: 2.4,
    percentage: 5,
    color: 'bg-yellow-500',
    tasks: 4,
  },
];

const todayActivity = [
  {
    id: '1',
    project: 'GalaxyCo Platform',
    task: 'User Authentication System',
    duration: '2h 15m',
    startTime: '9:00 AM',
    endTime: '11:15 AM',
    status: 'completed',
  },
  {
    id: '2',
    project: 'Client Portal',
    task: 'Dashboard Components',
    duration: '1h 45m',
    startTime: '11:30 AM',
    endTime: '1:15 PM',
    status: 'completed',
  },
  {
    id: '3',
    project: 'Mobile App',
    task: 'API Integration',
    duration: '3h 30m',
    startTime: '2:00 PM',
    endTime: '5:30 PM',
    status: 'in-progress',
  },
];

const weeklyStats = [
  { day: 'Mon', hours: 8.2, goal: 8 },
  { day: 'Tue', hours: 7.5, goal: 8 },
  { day: 'Wed', hours: 6.8, goal: 8 },
  { day: 'Thu', hours: 8.9, goal: 8 },
  { day: 'Fri', hours: 6.5, goal: 8 },
  { day: 'Sat', hours: 0, goal: 0 },
  { day: 'Sun', hours: 0, goal: 0 },
];

const teamMembers = [
  {
    name: 'Alex Rodriguez',
    hours: 42.5,
    efficiency: 94,
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AR',
  },
  {
    name: 'Lisa Chen',
    hours: 38.2,
    efficiency: 91,
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=LC',
  },
  {
    name: 'David Park',
    hours: 35.8,
    efficiency: 88,
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DP',
  },
  {
    name: 'Emma Wilson',
    hours: 40.1,
    efficiency: 92,
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=EW',
  },
];

function TimeOverview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Project Breakdown */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Time by Project (This Week)</h3>
          <div className="space-y-4">
            {projectBreakdown.map((project, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${project.color}`} />
                    <span className="text-sm font-medium">{project.project}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold">{project.hours}h</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({project.tasks} tasks)
                    </span>
                  </div>
                </div>
                <Progress value={project.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly Chart */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Weekly Hours</h3>
          <div className="space-y-4">
            {weeklyStats.map((day, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-8 text-sm font-medium">{day.day}</div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{day.hours}h</span>
                    {day.goal > 0 && (
                      <span className="text-muted-foreground">Goal: {day.goal}h</span>
                    )}
                  </div>
                  <Progress
                    value={day.goal > 0 ? (day.hours / day.goal) * 100 : 0}
                    className="h-2"
                  />
                </div>
                <div className="w-12 text-right text-sm">
                  {day.goal > 0 && (
                    <Badge
                      variant={day.hours >= day.goal ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {Math.round((day.hours / day.goal) * 100)}%
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Team Performance */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Team Performance (This Week)</h3>
        <div className="space-y-4">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  src={member.avatar}
                  alt={member.name}
                  fallback={member.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                  size="sm"
                />
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.hours}h logged</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold">{member.efficiency}%</p>
                  <p className="text-xs text-muted-foreground">efficiency</p>
                </div>
                <div className="w-20">
                  <Progress value={member.efficiency} className="h-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function TodayActivity() {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Today&apos;s Activity</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Timer className="mr-2 h-4 w-4" />
            Start Timer
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
        </div>
      </div>

      {/* Current Session */}
      <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white">
              <Play className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">Mobile App - API Integration</p>
              <p className="text-xs text-muted-foreground">Started 2:00 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-lg font-bold text-green-600">3:30:45</p>
              <p className="text-xs text-muted-foreground">running</p>
            </div>
            <Button variant="outline" size="sm">
              <Pause className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {todayActivity.map((activity) => (
          <div
            key={activity.id}
            className={`rounded-lg border p-4 ${
              activity.status === 'in-progress'
                ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'
                : 'border-border bg-card'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {activity.project}
                  </Badge>
                  <Badge
                    variant={activity.status === 'completed' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {activity.status}
                  </Badge>
                </div>
                <p className="text-sm font-medium">{activity.task}</p>
                <p className="text-xs text-muted-foreground">
                  {activity.startTime} - {activity.endTime}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">{activity.duration}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Analytics() {
  const insights = [
    {
      title: 'Peak Productivity Hours',
      value: '2:00 PM - 4:00 PM',
      description: 'You&apos;re 25% more productive during this time',
      trend: 'up',
    },
    {
      title: 'Average Session Length',
      value: '2h 15m',
      description: 'Optimal for deep work sessions',
      trend: 'neutral',
    },
    {
      title: 'Break Frequency',
      value: 'Every 90 minutes',
      description: 'Following recommended patterns',
      trend: 'up',
    },
    {
      title: 'Focus Score',
      value: '87%',
      description: 'Above average for your role',
      trend: 'up',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {insights.map((insight, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">{insight.title}</h4>
                <p className="text-2xl font-bold mb-2">{insight.value}</p>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                {insight.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Productivity Tips</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
            <div>
              <p className="text-sm font-medium">Schedule focused work blocks</p>
              <p className="text-xs text-muted-foreground">
                Try 2-hour blocks for complex tasks during your peak hours
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
            <div>
              <p className="text-sm font-medium">Take regular breaks</p>
              <p className="text-xs text-muted-foreground">
                Your productivity increases with 15-minute breaks every 90 minutes
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
            <div>
              <p className="text-sm font-medium">Minimize context switching</p>
              <p className="text-xs text-muted-foreground">
                Group similar tasks together to maintain focus
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function TimeUsagePage() {
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: <TimeOverview />,
    },
    {
      id: 'today',
      label: 'Today',
      content: <TodayActivity />,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      content: <Analytics />,
    },
  ];

  return (
    <DetailPage
      title="Time Usage & Analytics"
      subtitle="Track your time and optimize productivity"
      breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Time Usage' }]}
      actions={
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <Timer className="mr-2 h-4 w-4" />
            Start Timer
          </Button>
        </div>
      }
      metrics={timeMetrics}
      tabs={tabs}
      defaultTab="overview"
    />
  );
}
