# Accessible Table Implementation

A comprehensive demonstration of building fully accessible tables using `<div>` elements with proper ARIA roles instead of semantic HTML table elements.

## 🎯 What You'll Find Here

This directory contains:

1. **Live Demo** - `page.tsx` - A working example with sorting functionality and complete documentation
2. **Detailed Guide** - `ACCESSIBLE_TABLE_GUIDE.md` - Complete implementation documentation
3. **Usage Examples** - `example-usage.tsx` - Multiple real-world examples

## 🚀 Quick Start

### View the Demo

Navigate to `/accessible-table` in your browser to see the live implementation.

### Use the Reusable Component

```tsx
import { AccessibleTable } from '@/components/accessible-table/accessible-table';
import { useTableSort } from '@/hooks/use-table-sort';

function MyComponent() {
  const { sortedData, sortColumn, sortDirection, handleSort } = 
    useTableSort(myData);

  return (
    <AccessibleTable
      data={sortedData}
      columns={columns}
      ariaLabel="My table"
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={handleSort}
    />
  );
}
```

## 📁 File Structure

```
app/accessible-table/
├── page.tsx                         # Main demo page with employee table and documentation
├── example-usage.tsx                # Multiple usage examples
├── ACCESSIBLE_TABLE_GUIDE.md        # Complete implementation guide
└── README.md                        # This file

components/accessible-table/
└── accessible-table.tsx             # Reusable table component

hooks/
└── use-table-sort.ts               # Custom sorting hook

types/
└── accessible-table.ts             # TypeScript type definitions
```

## ✨ Key Features

### 1. Full ARIA Implementation
- `role="table"`, `role="row"`, `role="cell"` for proper semantics
- `aria-label` and `aria-describedby` for context
- `aria-sort` for sort state indication

### 2. Keyboard Navigation
- Tab through sortable headers
- Enter/Space to activate sorting
- Clear focus indicators

### 3. Screen Reader Support
- Proper table structure announced
- Sort state changes communicated
- Cell content properly associated with headers

### 4. TypeScript Integration
- Fully typed components and hooks
- Type-safe sorting logic
- Generic types for any data structure

### 5. Sorting Functionality
- Click to sort ascending
- Click again to sort descending
- Click third time to reset
- Visual and auditory feedback

## 🎨 Styling

The table uses Tailwind CSS with:
- Responsive design
- Dark mode support
- Hover states
- Focus indicators
- Accessible color contrast

## ♿ Accessibility Compliance

This implementation follows:
- **WCAG 2.1 Level AA** standards
- **WAI-ARIA** best practices
- **Section 508** requirements

### What Makes It Accessible?

✅ **Semantic Structure** - ARIA roles maintain table semantics  
✅ **Keyboard Navigation** - Full keyboard access to all features  
✅ **Screen Reader Support** - Clear announcements and navigation  
✅ **Focus Management** - Visible focus indicators  
✅ **Live Regions** - Status updates announced automatically  
✅ **Visual Feedback** - Icons and colors (with text alternatives)  
✅ **Consistent Layout** - Cells align with headers  
✅ **Error Prevention** - Graceful empty state handling  

## 🧪 Testing

### Manual Testing
```bash
# 1. Keyboard Test
- Tab through all headers
- Use Enter/Space to sort
- Verify focus is visible

# 2. Screen Reader Test
- Test with NVDA/JAWS/VoiceOver
- Navigate table structure
- Verify sort announcements

# 3. Visual Test
- Check hover states
- Verify sort indicators
- Test dark mode
```

### Automated Testing
```bash
# Run with axe-core or similar
npm test
```

## 📖 Documentation

### Read the Full Guide

See `ACCESSIBLE_TABLE_GUIDE.md` for:
- Step-by-step implementation
- ARIA roles reference
- TypeScript integration
- Best practices
- Common pitfalls
- Testing guidelines

### View Examples

See `example-usage.tsx` for:
- Employee directory table
- Product inventory table
- User analytics table
- Task management table
- Empty state handling

## 🔧 Customization

### Custom Column Configuration

```tsx
const columns = [
  { 
    key: 'name', 
    label: 'Full Name', 
    width: 'w-1/3',
    sortable: true 
  },
  { 
    key: 'email', 
    label: 'Email Address', 
    width: 'w-1/3',
    sortable: false // Non-sortable column
  },
];
```

### Custom Styling

```tsx
<AccessibleTable
  className="custom-table-styles"
  data={data}
  columns={columns}
  // ... other props
/>
```

### Custom Row Key

```tsx
<AccessibleTable
  getRowKey={(row) => row.uniqueId}
  // ... other props
/>
```

## 🎓 Learning Resources

### Why Divs with ARIA Roles?

While semantic HTML (`<table>`, `<tr>`, `<td>`) is generally preferred, divs with ARIA roles are useful for:

1. **Flexibility** - Complex layouts and responsive designs
2. **CSS Control** - Easier Grid/Flexbox integration
3. **Custom Interactions** - Complex interactive behaviors
4. **Learning** - Understanding accessibility fundamentals

**Important**: Always maintain accessibility when using divs!

### ARIA Roles Used

| Role | Purpose |
|------|---------|
| `table` | Main container |
| `rowgroup` | Groups rows (header/body) |
| `row` | Individual row |
| `columnheader` | Column header cell |
| `cell` | Data cell |

### Key ARIA Attributes

| Attribute | Purpose |
|-----------|---------|
| `aria-label` | Names the table |
| `aria-describedby` | Links to description |
| `aria-sort` | Indicates sort state |
| `aria-live` | Announces updates |

## 🐛 Troubleshooting

### Table Not Announced by Screen Reader
- Verify `role="table"` is present
- Check `aria-label` is provided
- Ensure roles are nested correctly

### Sorting Not Working
- Check `handleSort` is called
- Verify state updates correctly
- Ensure `sortedData` is used for rendering

### Focus Not Visible
- Add/verify focus styles
- Check `focus:ring` classes
- Test with high contrast mode

### Cells Not Aligning
- Ensure consistent width classes
- Verify flexbox layout
- Check column configuration

## 💡 Best Practices

1. **Always use semantic HTML when possible** - Only use divs when necessary
2. **Provide clear labels** - `aria-label` should be descriptive
3. **Maintain structure** - Keep proper rowgroup/row/cell hierarchy
4. **Test thoroughly** - Use real screen readers and keyboard
5. **Keep it simple** - Don't over-complicate the structure
6. **Document decisions** - Explain why divs were chosen over semantic HTML

## 📚 Additional Resources

- [MDN: ARIA Table Role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/table_role)
- [W3C: WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/table/)
- [WebAIM: Creating Accessible Tables](https://webaim.org/techniques/tables/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🤝 Contributing

Found an issue or want to improve this? Contributions are welcome!

1. Test with multiple screen readers
2. Verify keyboard navigation
3. Check color contrast
4. Run automated accessibility tests
5. Document any changes

## 📝 License

This implementation is part of the AccessibilityBuild project.

---

**Remember**: Accessibility is not optional. Every user deserves a great experience, regardless of how they access your content.

