import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the routes and their corresponding markdown files
const routes = [
  { slug: 'basic-concepts', title: 'Basic Concepts', file: 'src/routes/basic-concepts/+page.md' },
  { slug: 'components', title: 'Components', file: 'src/routes/components/+page.md' },
  { slug: 'configuration', title: 'Configuration', file: 'src/routes/configuration/+page.md' },
  { slug: 'data-loading', title: 'Data Loading', file: 'src/routes/data-loading/+page.md' },
  { slug: 'installation', title: 'Installation', file: 'src/routes/installation/+page.md' },
  { slug: 'introduction', title: 'Introduction', file: 'src/routes/introduction/+page.md' },
  { slug: 'project-structure', title: 'Project Structure', file: 'src/routes/project-structure/+page.md' },
  { slug: 'routing', title: 'Routing', file: 'src/routes/routing/+page.md' }
];

function extractTextFromMarkdown(content) {
  // Remove markdown syntax and extract plain text
  return content
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`[^`]*`/g, '')
    // Remove headers markdown
    .replace(/^#+\s*/gm, '')
    // Remove links but keep text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Remove emphasis
    .replace(/[*_]{1,2}([^*_]*)[*_]{1,2}/g, '$1')
    // Remove multiple spaces and newlines
    .replace(/\s+/g, ' ')
    .trim();
}

function buildSearchIndex() {
  const searchIndex = [];
  const projectRoot = path.resolve(__dirname, '..');

  for (const route of routes) {
    const filePath = path.join(projectRoot, route.file);
    
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const plainText = extractTextFromMarkdown(content);
        
        // Extract headings with levels for better search results
        const headingMatches = content.match(/^(#+)\s+(.+)$/gm) || [];
        const headingsWithIds = [];
        let h2Index = 0;
        let h3Index = 0;
        
        headingMatches.forEach(match => {
          const level = (match.match(/^#+/) || [''])[0].length;
          const text = match.replace(/^#+\s+/, '');
          
          let headingId = '';
          if (level === 1) {
            // Skip H1 headings (usually the main title)
            return;
          } else if (level === 2) {
            h2Index++;
            h3Index = 0;
            headingId = `heading-${h2Index}`;
          } else if (level === 3) {
            h3Index++;
            headingId = `heading-${h2Index}-${h3Index}`;
          }
          
          headingsWithIds.push({
            text,
            level,
            id: headingId
          });
        });
        
        const headingTexts = headingsWithIds.map(h => h.text);
        
        searchIndex.push({
          slug: route.slug,
          title: route.title,
          content: plainText,
          headings: headingTexts,
          headingsWithIds: headingsWithIds,
          // Create searchable text combining title, headings, and content
          searchText: [route.title, ...headingTexts, plainText].join(' ').toLowerCase()
        });
      }
    } catch (error) {
      console.warn(`Warning: Could not read ${filePath}:`, error.message);
    }
  }

  // Write search index to static directory
  const outputPath = path.join(projectRoot, 'static', 'search-index.json');
  fs.writeFileSync(outputPath, JSON.stringify(searchIndex, null, 2));
  
  console.log(`✅ Search index built with ${searchIndex.length} pages`);
  console.log(`📁 Saved to: ${outputPath}`);
}

buildSearchIndex();