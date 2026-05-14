/**
 * Day 1 Setup Script
 * Initializes the development environment and repository structure
 */

import { existsSync, mkdirSync, writeFileSync } from 'fs';  //Converted into ES6 module syntax using import statement
import path from 'path';

console.log('🚀 Setting up Day 1: SDLC & GitHub Mastery...\n');

// Created directory structure
const directories = [
  'week1/day1/code',
  'week1/day1/docs',
  'week1/day1/screenshots',
  '.github/workflows',
  '.github/ISSUE_TEMPLATE',
  'docs/architecture',
  'docs/api',
  'docs/deployment'
];

directories.forEach(dir => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});


## Sprint Goal
Establishd development workflow and created foundation for advanced frontend development.

## User Stories

### Epic 1: Development Environment Setup
- [ ] **US-001**: As a developer, I want to set up Git workflow so that I can collaborate effectively
- [ ] **US-002**: As a developer, I want to create proper repository structure so that the project is organized
- [ ] **US-003**: As a developer, I want to establish branching strategy so that features can be developed independently

### Epic 2: Documentation Standards
- [ ] **US-004**: As a developer, I want to create PR templates so that code reviews are consistent
- [ ] **US-005**: As a developer, I want to document processes so that team members can follow best practices

## Acceptance Criteria
- Repository structure is established
- Branching strategy is implemented
- PR templates are created
- Documentation is comprehensive
- All tasks are committed with descriptive messages`
  ,
  {
    path: 'week1/day1/docs/architecture.md',
    content: `# Week 1 Architecture

## System Overview
This week focuses on establishing the foundation for advanced frontend development.

## Components
- **Repository Structure**: Organized codebase with proper folder hierarchy
- **Git Workflow**: Feature branch strategy with PR reviews
- **Documentation**: Comprehensive guides and templates
- **Development Environment**: VS Code setup with extensions

## Task Done
1. Created Fork in Mechlin Repository
2. created feature branch with sda-training
3. Implemented feature with tests
4. Creates pulled request
5. Code reviewed process
6. Merged to developed branch
7. Deploy to staging environment

## Technology Stack Used
- Git for version control
- GitHub for collaboration
- Markdown for documentation
- VS Code for development`
  }
];

files.forEach(file => {
  if (!existsSync(file.path)) {
    writeFileSync(file.path, file.content);
    console.log(`Created file: ${file.path}`);
  }
});

console.log('\n🎉 Day 1 setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Review the created files and directories');
console.log('2. Follow the hands-on tasks in the README');
console.log('3. Created our first commit');
console.log('4. Set up your branching strategy');
console.log('\n Happy coding! 🚀');
