import {
  Inbox,
  ShoppingCart,
  Book,
  Briefcase,
  User,
  Heart,
  Star,
  Home,
  Calendar,
  Folder,
  Flag,
  Target,
  Trophy,
  Music,
  Camera,
  Coffee,
  Gamepad2,
  Gift,
  Plane,
  Tag,
  Bell,
  Clock,
  CheckCircle,
  Code,
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
  calendar: Calendar,
  folder: Folder,
  flag: Flag,
  target: Target,
  trophy: Trophy,
  music: Music,
  camera: Camera,
  coffee: Coffee,
  gamepad: Gamepad2,
  gift: Gift,
  plane: Plane,
  tag: Tag,
  bell: Bell,
  clock: Clock,
  'check-circle': CheckCircle,
  code: Code,
};

export default function GroupIcon({
  iconName,
  className = 'w-4 h-4',
}: GroupIconProps) {
  const Icon = iconMap[iconName] || Inbox;
  return <Icon className={className} />;
}
