'use client';

import { ListPage } from '@/components/templates/list-page';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  UserCheck,
  Mail,
  Calendar,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
} from 'lucide-react';
import { useState } from 'react';

// Mock team member data
const teamMembers = [
  {
    id: 'member_001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'Product Manager',
    department: 'Product',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SJ',
    isOnline: true,
    lastActive: '2025-01-16T10:30:00Z',
    joinedDate: '2024-03-15T09:00:00Z',
    weeklyContributions: 24,
    location: 'San Francisco, CA',
  },
  {
    id: 'member_002',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    role: 'Senior Developer',
    department: 'Engineering',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MC',
    isOnline: true,
    lastActive: '2025-01-16T11:15:00Z',
    joinedDate: '2023-11-08T09:00:00Z',
    weeklyContributions: 31,
    location: 'New York, NY',
  },
  {
    id: 'member_003',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    role: 'UX Designer',
    department: 'Design',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ER',
    isOnline: false,
    lastActive: '2025-01-15T17:45:00Z',
    joinedDate: '2024-01-20T09:00:00Z',
    weeklyContributions: 18,
    location: 'Austin, TX',
  },
  {
    id: 'member_004',
    name: 'David Park',
    email: 'david.park@company.com',
    role: 'DevOps Engineer',
    department: 'Engineering',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DP',
    isOnline: true,
    lastActive: '2025-01-16T10:00:00Z',
    joinedDate: '2024-06-01T09:00:00Z',
    weeklyContributions: 28,
    location: 'Seattle, WA',
  },
  {
    id: 'member_005',
    name: 'Jessica Liu',
    email: 'jessica.liu@company.com',
    role: 'Marketing Manager',
    department: 'Marketing',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=JL',
    isOnline: false,
    lastActive: '2025-01-16T08:30:00Z',
    joinedDate: '2024-02-12T09:00:00Z',
    weeklyContributions: 15,
    location: 'Los Angeles, CA',
  },
  {
    id: 'member_006',
    name: 'Alex Thompson',
    email: 'alex.thompson@company.com',
    role: 'QA Engineer',
    department: 'Engineering',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AT',
    isOnline: true,
    lastActive: '2025-01-16T11:45:00Z',
    joinedDate: '2023-09-10T09:00:00Z',
    weeklyContributions: 22,
    location: 'Denver, CO',
  },
  {
    id: 'member_007',
    name: 'Maria Santos',
    email: 'maria.santos@company.com',
    role: 'Sales Director',
    department: 'Sales',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MS',
    isOnline: false,
    lastActive: '2025-01-15T16:20:00Z',
    joinedDate: '2024-05-03T09:00:00Z',
    weeklyContributions: 19,
    location: 'Chicago, IL',
  },
  {
    id: 'member_008',
    name: 'Ryan Foster',
    email: 'ryan.foster@company.com',
    role: 'Junior Developer',
    department: 'Engineering',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RF',
    isOnline: true,
    lastActive: '2025-01-16T10:15:00Z',
    joinedDate: '2024-08-15T09:00:00Z',
    weeklyContributions: 26,
    location: 'Portland, OR',
  },
  {
    id: 'member_009',
    name: 'Hannah Kim',
    email: 'hannah.kim@company.com',
    role: 'Data Analyst',
    department: 'Product',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=HK',
    isOnline: false,
    lastActive: '2025-01-15T14:30:00Z',
    joinedDate: '2024-04-22T09:00:00Z',
    weeklyContributions: 17,
    location: 'Boston, MA',
  },
  {
    id: 'member_010',
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    role: 'Customer Success',
    department: 'Support',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=JW',
    isOnline: true,
    lastActive: '2025-01-16T11:00:00Z',
    joinedDate: '2023-12-01T09:00:00Z',
    weeklyContributions: 21,
    location: 'Miami, FL',
  },
  {
    id: 'member_011',
    name: 'Linda Zhang',
    email: 'linda.zhang@company.com',
    role: 'UI Designer',
    department: 'Design',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=LZ',
    isOnline: true,
    lastActive: '2025-01-16T10:45:00Z',
    joinedDate: '2024-07-08T09:00:00Z',
    weeklyContributions: 20,
    location: 'San Diego, CA',
  },
  {
    id: 'member_012',
    name: 'Robert Taylor',
    email: 'robert.taylor@company.com',
    role: 'Backend Developer',
    department: 'Engineering',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RT',
    isOnline: false,
    lastActive: '2025-01-15T18:15:00Z',
    joinedDate: '2023-10-20T09:00:00Z',
    weeklyContributions: 29,
    location: 'Dallas, TX',
  },
  {
    id: 'member_013',
    name: 'Sophie Martinez',
    email: 'sophie.martinez@company.com',
    role: 'Content Writer',
    department: 'Marketing',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SM',
    isOnline: true,
    lastActive: '2025-01-16T09:30:00Z',
    joinedDate: '2024-03-25T09:00:00Z',
    weeklyContributions: 16,
    location: 'Phoenix, AZ',
  },
  {
    id: 'member_014',
    name: 'Kevin Brown',
    email: 'kevin.brown@company.com',
    role: 'Security Engineer',
    department: 'Engineering',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=KB',
    isOnline: false,
    lastActive: '2025-01-15T15:00:00Z',
    joinedDate: '2024-09-12T09:00:00Z',
    weeklyContributions: 25,
    location: 'Atlanta, GA',
  },
  {
    id: 'member_015',
    name: 'Amanda Davis',
    email: 'amanda.davis@company.com',
    role: 'HR Manager',
    department: 'People',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AD',
    isOnline: true,
    lastActive: '2025-01-16T11:30:00Z',
    joinedDate: '2024-01-08T09:00:00Z',
    weeklyContributions: 12,
    location: 'Nashville, TN',
  },
  {
    id: 'member_016',
    name: 'Thomas Anderson',
    email: 'thomas.anderson@company.com',
    role: 'Frontend Developer',
    department: 'Engineering',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TA',
    isOnline: true,
    lastActive: '2025-01-16T10:20:00Z',
    joinedDate: '2024-11-03T09:00:00Z',
    weeklyContributions: 33,
    location: 'Philadelphia, PA',
  },
  {
    id: 'member_017',
    name: 'Rachel Green',
    email: 'rachel.green@company.com',
    role: 'Business Analyst',
    department: 'Product',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RG',
    isOnline: false,
    lastActive: '2025-01-15T16:45:00Z',
    joinedDate: '2024-04-10T09:00:00Z',
    weeklyContributions: 14,
    location: 'Minneapolis, MN',
  },
  {
    id: 'member_018',
    name: 'Carlos Mendez',
    email: 'carlos.mendez@company.com',
    role: 'Solutions Architect',
    department: 'Engineering',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CM',
    isOnline: true,
    lastActive: '2025-01-16T09:45:00Z',
    joinedDate: '2023-08-14T09:00:00Z',
    weeklyContributions: 27,
    location: 'Houston, TX',
  },
  {
    id: 'member_019',
    name: 'Jennifer Lee',
    email: 'jennifer.lee@company.com',
    role: 'Financial Analyst',
    department: 'Finance',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=JLee',
    isOnline: false,
    lastActive: '2025-01-15T17:00:00Z',
    joinedDate: '2024-06-18T09:00:00Z',
    weeklyContributions: 11,
    location: 'Salt Lake City, UT',
  },
  {
    id: 'member_020',
    name: 'Mark Johnson',
    email: 'mark.johnson@company.com',
    role: 'Technical Writer',
    department: 'Product',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MJ',
    isOnline: true,
    lastActive: '2025-01-16T10:50:00Z',
    joinedDate: '2024-02-28T09:00:00Z',
    weeklyContributions: 13,
    location: 'Raleigh, NC',
  },
];

const departments = [
  'All',
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Support',
  'People',
  'Finance',
];
const sortOptions = ['Name', 'Role', 'Recent Activity', 'Joined Date'];

function formatLastActive(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    return 'Active now';
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else {
    return `${Math.floor(diffInHours / 24)}d ago`;
  }
}

function MemberCard({ member }: { member: (typeof teamMembers)[0] }) {
  return (
    <Card className="p-6 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar
              src={member.avatar}
              alt={member.name}
              fallback={member.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
              size="lg"
            />
            <div
              className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background ${
                member.isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{member.name}</h3>
            <p className="text-sm text-muted-foreground">{member.role}</p>
            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatLastActive(member.lastActive)}</span>
              </div>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="secondary">{member.department}</Badge>
          <div className="text-sm text-muted-foreground">
            {member.weeklyContributions} contributions this week
          </div>
        </div>
        <Button variant="outline" size="sm">
          View Profile
        </Button>
      </div>

      <div className="mt-3 text-xs text-muted-foreground">📍 {member.location}</div>
    </Card>
  );
}

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [sortBy, setSortBy] = useState('Name');

  // Filter and sort members
  let filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      selectedDepartment === 'All' || member.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  // Sort members
  filteredMembers = filteredMembers.sort((a, b) => {
    switch (sortBy) {
      case 'Name':
        return a.name.localeCompare(b.name);
      case 'Role':
        return a.role.localeCompare(b.role);
      case 'Recent Activity':
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      case 'Joined Date':
        return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
      default:
        return 0;
    }
  });

  const onlineCount = teamMembers.filter((member) => member.isOnline).length;
  const totalCount = teamMembers.length;

  return (
    <ListPage
      title="Team Directory"
      subtitle={`${totalCount} members • ${onlineCount} online`}
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Team' }]}
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      }
    >
      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Member Cards */}
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {filteredMembers.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <Users className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No team members found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}
    </ListPage>
  );
}
