import {
  Inbox,
  ShoppingCart,
  Book,
  Briefcase,
  User,
  Heart,
  Star,
  Home,
  LucideIcon,
} from 'lucide-react';

interface GroupIconProps {
  iconName: string;
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  inbox: Inbox,
  'shopping-cart': ShoppingCart,
  book: Book,
  briefcase: Briefcase,
  user: User,
  heart: Heart,
  star: Star,
  home: Home,
};

export default function GroupIcon({
  iconName,
  className = 'w-4 h-4',
}: GroupIconProps) {
  const Icon = iconMap[iconName] || Inbox;
  return <Icon className={className} />;
}
