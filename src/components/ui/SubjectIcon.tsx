import { getSubjectTheme } from '../../data/subjectTheme';
import './SubjectIcon.css';

interface SubjectIconProps {
  slug: string;
  size?: number;
}

export function SubjectIcon({ slug, size = 44 }: SubjectIconProps) {
  const theme = getSubjectTheme(slug);
  return (
    <div
      className="subject-icon"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.5,
        background: theme.gradient,
        boxShadow: `0 6px 20px -6px ${theme.glow}99`,
      }}
    >
      {theme.icon}
    </div>
  );
}
