# Naixu Guo's Academic Website

This is a simplified Jekyll website where all content is managed through simple YAML files.

## How to Update Content

### 1. News (Homepage)
Edit `_data/news.yml` to update the recent news on the homepage:

```yaml
- date: "Jan 2025"
  text: "Your news item here"
- date: "Dec 2024"
  text: "Another news item"
```

### 2. Publications
Edit `_data/publications.yml` to update your publications:

```yaml
- title: "Paper Title"
  authors: "Your Name, Co-author Name"
  venue: "Journal/Conference Name, Year"
  excerpt: "Brief description of the paper"
  date: 2024-01-01
  link: "https://paper-link.com"
  pdf_link: "files/paper.pdf"
  code_link: "https://github.com/code"
  media_link: "https://media-link.com"
```

### 3. Research Areas
Edit `_data/research.yml` to update your research interests:

```yaml
- title: "Research Area Name"
  description: "Description of your research"
  keywords: ["keyword1", "keyword2"]
  status: "active"  # or "planning"
```

### 4. CV
Edit `_data/cv.yml` to update your CV information:

```yaml
education:
  - degree: "Degree Name"
    institution: "Institution Name"
    year: "Year"
    description: "Description"

experience:
  - position: "Position Title"
    institution: "Institution"
    year: "Year"
    description: "Description"

skills:
  technical: ["Skill1", "Skill2"]
  quantum: ["Quantum Skill1", "Quantum Skill2"]
  languages: ["Language1", "Language2"]
```

### 5. Mini Library
Edit `_data/mini_lib.yml` to update your resource library:

```yaml
- title: "Resource Title"
  type: "book"  # or "paper", "tutorial", "review"
  author: "Author Name"
  year: "Year"
  description: "Description"
  link: "https://resource-link.com"
```

## Running the Website

1. Install dependencies: `bundle install`
2. Start the server: `bundle exec jekyll serve --livereload`
3. View at: http://127.0.0.1:4000/

## File Structure

- `_data/` - All content in YAML format
- `_pages/` - Page templates that read from YAML files
- `assets/` - CSS, JavaScript, and images
- `_layouts/` - Jekyll layout templates

## Benefits of This System

- **Simple**: Just edit YAML files, no HTML knowledge needed
- **Fast**: Changes appear immediately with live reload
- **Organized**: All content is in one place
- **Maintainable**: Easy to add new items or modify existing ones

