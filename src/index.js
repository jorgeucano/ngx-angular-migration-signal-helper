#!/usr/bin/env node

const yargs = require('yargs');

const fs = require('fs');
const path = require('path');

const rootDir = yargs.argv.src || './example/components';
const inputRegex = /@Input\s*\(/g;
const components = [];
const componentWithTemplates = [];
const full = [];

function processFile(file) {
  const content = fs.readFileSync(file, 'utf-8');
  const componentMatch = /@Component\(\{[\s\S]*?selector:\s*['"]([\w-]+)['"][\s\S]*?\}\)/.exec(content);
  
  if (!componentMatch) {
    return;
  }

  const selector = componentMatch[1];
  const matches = content.matchAll(inputRegex);
  
  for (const match of matches) {
    if (!components.includes(selector)) {
      components.push(selector);
    }
  }
}

// start function
function traverseTSDir(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      traverseTSDir(filePath);
    } else if (file.endsWith('.ts')) {
      processFile(filePath);
    }
  }
}

// check components with inputs
traverseTSDir(rootDir);

// check templates with components with inputs
function traverseTemplateDir(dir) {

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      traverseTemplateDir(filePath);
    } else if (file.endsWith('.html')) {
      processTemplate(filePath);
    }
  }
}

function getTagRegex(tagName) {
  return new RegExp('<' + tagName);
}
function processTemplate(file) {
  
  const content = fs.readFileSync(file, 'utf-8');
  
  // iterate tag for check into the template
  
  for (let i = 0; i < components.length; i++) {
    const selector = components[i];
    const templateMatch = getTagRegex(selector).exec(content);
    if (templateMatch && !file.includes(selector)) {
      full.push({template: file, component: selector});
      if (!componentWithTemplates.includes(file)) {
        componentWithTemplates.push(file);
      }
    }
  }
}

// check templates with tags
traverseTemplateDir(rootDir);
const tempObj = {};

for (const obj of full) {
  if (obj.component in tempObj) {
    tempObj[obj.component].push(obj.template);
  } else {
    tempObj[obj.component] = [obj.template];
  }
}

const newArr = [];

for (const [component, templates] of Object.entries(tempObj)) {
  newArr.push({ component, templates });
}

let markdownList = '';

for (const obj of newArr) {
  const checkboxItems = obj.templates.map(template => `- [ ] ${template}`).join('\n');
  markdownList += `- ${obj.component}\n${checkboxItems}\n`;
}

fs.writeFile('components-to-migrate.md', markdownList, (err) => {
  if (err) throw err;
  console.log('File to migrated Save! name: components-to-migrate.md, you can copy and paste to create a ticket in your project!');
});
