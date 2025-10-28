// Hard-coded groups configuration
// These groups are read-only and cannot be modified through the API

export interface Group {
  id: number;
  name: string;
  color: string;
  icon: string;
}

export const GROUPS: Group[] = [
  {
    id: 1,
    name: 'Uncategorized',
    color: '#6B7280',
    icon: 'inbox',
  },
  {
    id: 2,
    name: 'Shopping',
    color: '#10B981',
    icon: 'shopping-cart',
  },
  {
    id: 3,
    name: 'Study',
    color: '#3B82F6',
    icon: 'book',
  },
  {
    id: 4,
    name: 'Work',
    color: '#F59E0B',
    icon: 'briefcase',
  },
  {
    id: 5,
    name: 'Personal',
    color: '#8B5CF6',
    icon: 'user',
  },
];
