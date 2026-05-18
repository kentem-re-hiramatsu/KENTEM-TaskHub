import {
  Bell, User, UserCircle, LogOut, HelpCircle, ExternalLink, X,
  Users, Users2, LayoutDashboard, FolderPlus, List, Settings, Code,
  ChevronRight, ChevronDown, Plus, Trash2, Edit, Search,
  AlertCircle, CheckCircle, Info, RefreshCw, Loader2, type LucideIcon,
} from 'lucide-react';
import { css } from 'styled-system/css';

// Maps ksrc icon types to lucide icons
const iconMap: Record<string, LucideIcon> = {
  bell: Bell,
  accountCircle: UserCircle,
  account: User,
  output: LogOut,
  helpCircle: HelpCircle,
  newOpen: ExternalLink,
  close: X,
  member: Users,
  grouping: Users2,
  dashboard: LayoutDashboard,
  constructionAdd: FolderPlus,
  list: List,
  settings: Settings,
  code: Code,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  plus: Plus,
  delete: Trash2,
  edit: Edit,
  search: Search,
  alertCircle: AlertCircle,
  checkCircle: CheckCircle,
  info: Info,
  refreshCw: RefreshCw,
  loader: Loader2,
};

type Variant = 'primary' | 'secondary' | 'tertiary' | 'error';

interface IconProps {
  category?: 'mask' | 'fill';
  type: string;
  size?: 'small' | 'medium' | 'large';
  variant?: Variant;
  className?: string;
}

const sizeMap = { small: 16, medium: 20, large: 24 };

export const Icon = ({ type, size = 'medium', variant = 'primary', className }: IconProps) => {
  const LucideIcon = iconMap[type];
  if (!LucideIcon) return null;
  return (
    <LucideIcon
      size={sizeMap[size]}
      className={`${colorStyle[variant]} ${className ?? ''}`}
    />
  );
};

const colorStyle: Record<Variant, string> = {
  primary: css({ color: 'app.primary' }),
  secondary: css({ color: 'app.textSecondary' }),
  tertiary: css({ color: 'app.textTertiary' }),
  error: css({ color: 'app.error.DEFAULT' }),
};
