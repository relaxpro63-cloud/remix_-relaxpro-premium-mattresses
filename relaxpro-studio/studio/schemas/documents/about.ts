export default {
  name: 'about',
  title: 'About Page',
  type: 'document',
  fields: [
    { name: 'hero', title: 'Hero Section', type: 'object', fields: [{ name: 'title', title: 'Title', type: 'string' }, { name: 'subtitle', title: 'Subtitle', type: 'string' }, { name: 'backgroundImage', title: 'Background Image', type: 'imageWithAlt' }] },
    { name: 'ourStory', title: 'Our Story', type: 'object', fields: [{ name: 'title', title: 'Section Title', type: 'string' }, { name: 'content', title: 'Story Content', type: 'array', of: [{ type: 'block' }, { type: 'imageWithAlt' }] }] },
    { name: 'ourProcess', title: 'Our Process', type: 'object', fields: [{ name: 'title', title: 'Section Title', type: 'string' }, { name: 'steps', title: 'Process Steps', type: 'array', of: [{ type: 'object', fields: [{ name: 'stepNumber', title: 'Step Number', type: 'number' }, { name: 'title', title: 'Step Title', type: 'string' }, { name: 'description', title: 'Description', type: 'text', rows: 3 }, { name: 'image', title: 'Step Image', type: 'imageWithAlt' }] }] }] },
    { name: 'certifications', title: 'Certifications', type: 'object', fields: [{ name: 'title', title: 'Section Title', type: 'string' }, { name: 'items', title: 'Certification Items', type: 'array', of: [{ type: 'object', fields: [{ name: 'name', title: 'Certification Name', type: 'string' }, { name: 'description', title: 'Description', type: 'text', rows: 2 }, { name: 'logo', title: 'Logo', type: 'imageWithAlt' }] }] }] },
    { name: 'values', title: 'Our Values / Mission', type: 'object', fields: [{ name: 'missionStatement', title: 'Mission Statement', type: 'text', rows: 4 }, { name: 'valueCards', title: 'Value Cards', type: 'array', of: [{ type: 'featureCard' }] }] },
    { name: 'teamSection', title: 'Team / Factory Section', type: 'object', fields: [{ name: 'title', title: 'Section Title', type: 'string' }, { name: 'content', title: 'Content', type: 'array', of: [{ type: 'block' }, { type: 'imageWithAlt' }] }] },
    { name: 'seo', title: 'SEO Settings', type: 'pageSEO' },
  ],
}
