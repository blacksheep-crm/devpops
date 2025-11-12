# devpops Technical Documentation

## Comprehensive Technical Analysis of the Siebel CRM Development Operations Toolkit

**Version:** 24.12 "Raptor"
**Last Updated:** November 2024
**Status:** EDUCATIONAL USE ONLY - NOT FOR PRODUCTION

---

## 📚 Documentation Structure

This documentation is organized into separate focused documents for easier navigation and maintenance:

### Core Documentation

1. **[Architecture Overview](./01_ARCHITECTURE.md)**
   - System architecture and design
   - Component relationships
   - Integration points
   - Data flow diagrams

2. **[devpops.js Analysis](./02_DEVPOPS_JS.md)**
   - Main JavaScript library (12,244 lines)
   - 100+ functions categorized
   - Module structure
   - Key features implementation

3. **[postload.js Analysis](./03_POSTLOAD_JS.md)**
   - Postload customizations (8,517 lines)
   - Dependency Finder implementation
   - Workflow Visualizer
   - Web Tools enhancements

4. **[Repository Objects (SIF Files)](./04_SIF_FILES.md)**
   - All 5 SIF files analyzed
   - Business Components
   - Integration Objects
   - Views and Applets

5. **[FWK Runtime Business Service](./05_FWK_RUNTIME.md)**
   - 30+ methods documented
   - Server-side functionality
   - XML configuration

6. **[Features Implementation Guide](./06_FEATURES.md)**
   - Workflow Visualizer (24.12)
   - Dependency Finder (23.6+)
   - X-Ray metadata tool
   - Business Service Runner
   - Complete feature catalog

7. **[Installation & Configuration](./07_INSTALLATION.md)**
   - Prerequisites
   - Step-by-step installation
   - Configuration settings
   - Troubleshooting

8. **[Technical Reference](./08_TECHNICAL.md)**
   - JavaScript patterns
   - REST API usage
   - Siebel Open UI integration
   - Third-party libraries

---

## 🚀 Quick Start

If you're new to devpops, start with:
1. [Architecture Overview](./01_ARCHITECTURE.md) - Understand the big picture
2. [Installation Guide](./07_INSTALLATION.md) - Get it running
3. [Features Guide](./06_FEATURES.md) - See what it can do

---

## 📊 Project Statistics

| Component | Lines of Code | Files |
|-----------|--------------|-------|
| JavaScript (devpops.js) | 12,244 | 1 |
| JavaScript (postload.js) | 8,517 | 1 |
| JavaScript (SiebelQueryLang.js) | 3,100 | 1 |
| CSS (blacksheep.css) | 277 | 1 |
| HTML (logviewer.html) | 245 | 1 |
| **Total Client Code** | **24,383** | **5** |

| Repository Objects | Count |
|-------------------|-------|
| SIF Files | 5 |
| Business Services | 2 |
| Integration Objects | 5+ |
| Business Components | 5+ |
| Applets | 3+ |
| Views | 1+ |

---

## 🔑 Key Innovations

1. **REST API-based Dependency Finder** - Revolutionary approach to repository analysis
2. **Mermaid.js Workflow Visualizer** - Visual workflow diagrams
3. **Cytoscape Graph Visualizations** - Interactive dependency graphs
4. **Server Manager Browser Integration** - srvrmgr commands from browser
5. **Dynamic Business Service Runner** - Test any BS method
6. **Repository Metadata X-Ray** - See all metadata layers
7. **Modern Web Components** - Shoelace UI in Siebel

---

## ⚠️ Important Notes

- **EDUCATIONAL USE ONLY** - This toolkit is for learning and development environments
- **Not for Production** - Contains powerful features that should not be used in production
- **Requires Siebel 20.12+** - Some features require 23.6+ or 24.12+
- **REST API Required** - Must have Siebel REST API configured

---

## 📝 Version History

- **24.12** - Added Workflow Visualizer (Siebel 23.6+ required)
- **24.5** - Dependency Finder, ERD Viewer
- **23.6** - Major rewrite, REST API integration
- Earlier versions - Initial development

---

## 👥 Credits

- **blacksheep IT consulting GmbH** - Primary development
- **Jason MacZura** - Trace logging functionality
- **Slava (xapuk.com)** - Various utilities
- **James MacDonald** - ERD Viewer

---

## 📖 How to Use This Documentation

Each document is self-contained but references others where relevant. Start with the document most relevant to your needs:

- **Installing devpops?** → [Installation Guide](./07_INSTALLATION.md)
- **Understanding the code?** → [Architecture](./01_ARCHITECTURE.md) then specific file analyses
- **Using features?** → [Features Guide](./06_FEATURES.md)
- **Troubleshooting?** → [Technical Reference](./08_TECHNICAL.md)

---

*This documentation was created through systematic analysis of the devpops codebase.*