export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    { name: 'branding', title: 'Branding', type: 'object', fields: [{ name: 'siteName', title: 'Site Name', type: 'string' }, { name: 'tagline', title: 'Tagline', type: 'string' }, { name: 'logo', title: 'Logo', type: 'imageWithAlt' }, { name: 'favicon', title: 'Favicon', type: 'image' }] },
    { name: 'navigation', title: 'Navigation', type: 'object', fields: [{ name: 'mainMenu', title: 'Main Menu', type: 'array', of: [{ type: 'navItem' }] }, { name: 'footerMenu', title: 'Footer Menu', type: 'array', of: [{ type: 'navItem' }] }, { name: 'ctaButton', title: 'Navbar CTA Button', type: 'ctaButton' }, { name: 'phoneNumber', title: 'Navbar Phone Number', type: 'string' }] },
    { name: 'footer', title: 'Footer', type: 'object', fields: [{ name: 'description', title: 'Footer Description', type: 'text', rows: 4 }, { name: 'socialLinks', title: 'Social Links', type: 'array', of: [{ type: 'socialLink' }] }, { name: 'certifications', title: 'Certification Badges', type: 'array', of: [{ type: 'object', fields: [{ name: 'name', title: 'Name', type: 'string' }, { name: 'image', title: 'Badge Image', type: 'imageWithAlt' }] }] }, { name: 'copyrightText', title: 'Copyright Text', type: 'string' }] },
    { name: 'contactInfo', title: 'Global Contact Info', type: 'object', fields: [{ name: 'mainPhone', title: 'Main Phone', type: 'string' }, { name: 'secondaryPhone', title: 'Secondary Phone', type: 'string' }, { name: 'whatsappNumber', title: 'WhatsApp Number', type: 'string' }, { name: 'whatsappDefaultMessage', title: 'Default WhatsApp Message', type: 'text', rows: 2 }, { name: 'email', title: 'Email', type: 'string' }, { name: 'factoryAddress', title: 'Factory Address', type: 'text', rows: 3 }] },
    { name: 'announcement', title: 'Announcement Banner', type: 'object', fields: [{ name: 'showBanner', title: 'Show Banner', type: 'boolean' }, { name: 'bannerText', title: 'Banner Text', type: 'string' }, { name: 'bannerLink', title: 'Banner Link', type: 'string' }, { name: 'bannerColor', title: 'Banner Color', type: 'string', options: { list: ['green', 'blue', 'red', 'yellow'] } }] },
    {
      name: 'staticImages', title: 'Static Brand Images', type: 'object',
      fields: [
        { name: 'gotsCotton', title: 'GOTS Organic Cotton', type: 'imageWithAlt' },
        { name: 'quiltedCotton', title: 'Quilted Organic Cotton', type: 'imageWithAlt' },
        { name: 'naturalLatex', title: '100% Natural Latex', type: 'imageWithAlt' },
        { name: 'comfortMeter', title: 'Comfort Meter Chart', type: 'imageWithAlt' },
        { name: 'sizeChart', title: 'Size Chart', type: 'imageWithAlt' },
        { name: 'heroBedroom', title: 'Hero Bedroom Background', type: 'imageWithAlt' },
      ],
    },
    { name: 'seo', title: 'Default SEO', type: 'pageSEO' },
    { name: 'analytics', title: 'Analytics and Tracking', type: 'object', fields: [{ name: 'gaTrackingId', title: 'Google Analytics ID', type: 'string' }, { name: 'metaPixelId', title: 'Meta Pixel ID', type: 'string' }, { name: 'gtmId', title: 'Google Tag Manager ID', type: 'string' }] },
  ],
}
