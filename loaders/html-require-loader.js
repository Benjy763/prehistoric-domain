const fs = require('fs');
const path = require('path');

// Regular expression to capture <require> tag with path attribute.
const ws = '[^]*?';
const requireRe = new RegExp(`<require${ws}path="(.*?)">`, 'g');

module.exports = function (source) {
  // Use Webpack 5's this.getOptions() for loader options.
  const options = this.getOptions ? this.getOptions() : {};

  // Set a base directory for your paths, you can set it as 'src' folder.
  const projectRoot = path.resolve(__dirname, '../src');
  const templateRoot = options.root || projectRoot;

  let match;
  const requires = [];

  // Loop through each <require> tag and process the path.
  while ((match = requireRe.exec(source)) !== null) {
    // Get the path inside the <require> tag.
    const relativePath = match[1].trim();

    // Resolve the path relative to the base directory (e.g., 'src').
    let requirePath = path.resolve(templateRoot, relativePath);

    // If the path points to a directory that doesn't exist, throw an error.
    if (!fs.existsSync(requirePath)) {
      throw new Error(`File not found: ${requirePath}`);
    }

    // Read the file content.
    let requireSource = fs.readFileSync(requirePath, 'utf8');
    requires.push(requirePath);

    // Replace the <require> tag with the file's HTML content.
    source = source.replace(
      match[0],
      `<!-- <require path="${requirePath}"> -->\n${requireSource}\n<!-- </require> -->`
    );
  }

  // Add dependencies for Webpack's Hot Module Replacement.
  requires.filter(uniq).forEach((requirePath) => {
    this.addDependency(requirePath);
  });

  return source;
};

// Helper function to ensure unique paths.
function uniq(value, index, self) {
  return self.indexOf(value) === index;
}
