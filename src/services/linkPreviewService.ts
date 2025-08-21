import { ProjectLink } from '../types/Project';

interface LinkMetadata {
  title?: string;
  description?: string;
  image?: string;
}

export const linkPreviewService = {
  async fetchLinkPreview(url: string): Promise<Partial<ProjectLink>> {
    try {
      // Normalize URL
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      
      // Try to fetch metadata using a CORS proxy or direct fetch
      const metadata = await this.extractMetadata(normalizedUrl);
      
      return {
        url: normalizedUrl,
        title: metadata.title || this.extractDomainName(normalizedUrl),
        description: metadata.description || '',
        image: metadata.image || '',
        addedAt: new Date().toISOString()
      };
    } catch (error) {
      console.warn('Failed to fetch link preview:', error);
      // Fallback to basic URL info
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      return {
        url: normalizedUrl,
        title: this.extractDomainName(normalizedUrl),
        description: 'Link preview unavailable',
        image: '',
        addedAt: new Date().toISOString()
      };
    }
  },

  async extractMetadata(url: string): Promise<LinkMetadata> {
    try {
      // For demo purposes, we'll simulate metadata extraction
      // In a real app, you might use a service like linkpreview.net
      const domain = this.extractDomainName(url);
      
      // Simulate different responses based on domain
      if (domain.includes('github')) {
        return {
          title: 'GitHub Repository',
          description: 'Code repository and version control',
          image: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
        };
      } else if (domain.includes('youtube')) {
        return {
          title: 'YouTube Video',
          description: 'Video content on YouTube',
          image: 'https://www.youtube.com/img/desktop/yt_1200.png'
        };
      } else if (domain.includes('docs.google')) {
        return {
          title: 'Google Docs',
          description: 'Document or spreadsheet',
          image: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico'
        };
      }
      
      // Default fallback
      return {
        title: `${domain.charAt(0).toUpperCase() + domain.slice(1)} Website`,
        description: `Content from ${domain}`,
        image: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
      };
    } catch (error) {
      throw new Error('Failed to extract metadata');
    }
  },

  extractDomainName(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  }
};