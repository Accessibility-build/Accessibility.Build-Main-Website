import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle, Eye, Keyboard, Link as LinkIcon } from 'lucide-react';

interface RelatedItem {
  title: string;
  description: string;
  href: string;
  level: 'A' | 'AA' | 'AAA';
  category: string;
  icon?: React.ReactNode;
}

interface RelatedContentProps {
  currentCriteria: string;
  title?: string;
}

export default function WCAGRelatedContent({ currentCriteria, title = "Related WCAG Success Criteria" }: RelatedContentProps) {
  // Comprehensive WCAG criteria mapping with relationships
  const wcagRelationships: Record<string, RelatedItem[]> = {
    '2.3.1': [
      {
        title: 'WCAG 2.4.1 Bypass Blocks',
        description: 'Learn about skip links and navigation bypass mechanisms',
        href: '/wcag/2-4-1',
        level: 'A',
        category: 'Navigation',
        icon: <Keyboard className="w-5 h-5" />
      },
      {
        title: 'WCAG 2.4.2 Page Titled',
        description: 'Master descriptive page titles for better user orientation',
        href: '/wcag/2-4-2',
        level: 'A',
        category: 'Navigation',
        icon: <BookOpen className="w-5 h-5" />
      },
      {
        title: 'WCAG 1.4.2 Audio Control',
        description: 'Control auto-playing audio content for users',
        href: '/wcag/1-4-2',
        level: 'A',
        category: 'Media',
        icon: <Eye className="w-5 h-5" />
      }
    ],
    '2.4.1': [
      {
        title: 'WCAG 2.4.3 Focus Order',
        description: 'Ensure logical keyboard navigation sequences',
        href: '/wcag/2-4-3',
        level: 'A',
        category: 'Navigation',
        icon: <Keyboard className="w-5 h-5" />
      },
      {
        title: 'WCAG 2.4.4 Link Purpose',
        description: 'Create descriptive and meaningful link text',
        href: '/wcag/2-4-4',
        level: 'A',
        category: 'Navigation',
        icon: <LinkIcon className="w-5 h-5" />
      },
      {
        title: 'WCAG 2.1.1 Keyboard',
        description: 'Ensure all functionality is keyboard accessible',
        href: '/wcag/2-1-1',
        level: 'A',
        category: 'Keyboard',
        icon: <Keyboard className="w-5 h-5" />
      }
    ],
    '2.4.2': [
      {
        title: 'WCAG 2.4.1 Bypass Blocks',
        description: 'Implement skip links and navigation bypass mechanisms',
        href: '/wcag/2-4-1',
        level: 'A',
        category: 'Navigation',
        icon: <Keyboard className="w-5 h-5" />
      },
      {
        title: 'WCAG 1.3.1 Info and Relationships',
        description: 'Structure content with proper semantic markup',
        href: '/wcag/1-3-1',
        level: 'A',
        category: 'Structure',
        icon: <BookOpen className="w-5 h-5" />
      },
      {
        title: 'WCAG 2.4.3 Focus Order',
        description: 'Maintain logical focus sequences in navigation',
        href: '/wcag/2-4-3',
        level: 'A',
        category: 'Navigation',
        icon: <Keyboard className="w-5 h-5" />
      }
    ],
    '2.4.3': [
      {
        title: 'WCAG 2.4.1 Bypass Blocks',
        description: 'Skip links work with proper focus management',
        href: '/wcag/2-4-1',
        level: 'A',
        category: 'Navigation',
        icon: <Keyboard className="w-5 h-5" />
      },
      {
        title: 'WCAG 2.1.2 No Keyboard Trap',
        description: 'Prevent focus from getting trapped in components',
        href: '/wcag/2-1-2',
        level: 'A',
        category: 'Keyboard',
        icon: <Keyboard className="w-5 h-5" />
      },
      {
        title: 'WCAG 2.4.7 Focus Visible',
        description: 'Ensure focus indicators are always visible',
        href: '/wcag/2-4-7',
        level: 'AA',
        category: 'Navigation',
        icon: <Eye className="w-5 h-5" />
      }
    ]
  };

  // Additional helpful resources
  const additionalResources = [
    {
      title: 'Interactive WCAG 2.2 Checklist',
      description: 'Complete checklist with filtering and progress tracking',
      href: '/wcag',
      level: 'A' as const,
      category: 'Overview',
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      title: 'Accessibility Audit Tool',
      description: 'Comprehensive website accessibility analysis',
      href: '/tools',
      level: 'A' as const,
      category: 'Tools',
      icon: <Eye className="w-5 h-5" />
    }
  ];

  const relatedItems = wcagRelationships[currentCriteria] || [];
  const allItems = [...relatedItems, ...additionalResources].slice(0, 6);

  if (allItems.length === 0) return null;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'A': return 'bg-green-100 text-green-800 border-green-200';
      case 'AA': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'AAA': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
        {title}
      </h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="group block p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
                {item.icon}
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor(item.level)}`}>
                Level {item.level}
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {item.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {item.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {item.category}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Need More Help?</h3>
        <p className="text-blue-800 text-sm mb-3">
          Explore our comprehensive accessibility resources and tools to build more inclusive web experiences.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/wcag"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Full WCAG Checklist
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            Accessibility Tools
          </Link>
        </div>
      </div>
    </div>
  );
} 