import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";
import fs from "fs/promises";

// File paths
const dataPath = "./data.json";
const csharpFilePath = "./RandomFile.cs";
const reactFilePath = "./RandomComponent.jsx";

// Helper: Write JSON file
const writeFile = (data) => {
  return jsonfile.writeFile(dataPath, data);
};

// Helper: Randomly modify C# file
const modifyCSharpFile = async () => {
  const randomContent = `// Random update: ${Math.random().toString(36).substring(2, 15)}\n`;
  await fs.appendFile(csharpFilePath, randomContent);
};

// Helper: Randomly modify React file
const modifyReactFile = async () => {
  const randomContent = `// Random React change: ${Math.random().toString(36).substring(2, 15)}\n`;
  await fs.appendFile(reactFilePath, randomContent);
};

// Get last year base date (January 1st)
const lastYear = moment().subtract(1, "year").year();
const baseDate = moment(`${lastYear}-01-01`);

// Main function to commit
const makeCommits = async (n) => {
  if (n === 0) {
    await simpleGit().push();
    return;
  }

  const x = random.int(0, 51); // Weeks 0-51
  const y = random.int(0, 6);  // Days 0-6
  const commitDate = baseDate.clone().add(x, "weeks").add(y, "days");

  // Ensure the date stays within last year
  if (commitDate.year() !== lastYear) {
    return await makeCommits(n); // Retry
  }

  const formattedDate = commitDate.format();

  console.log(`Committing on: ${formattedDate}`);

  // Modify files
  await writeFile({ date: formattedDate });
  await modifyCSharpFile();
  await modifyReactFile();

  // Git commit
  await simpleGit()
    .add([dataPath, csharpFilePath, reactFilePath])
    .commit(`Commit on ${formattedDate}`, { "--date": formattedDate });

  // Recurse
  await makeCommits(n - 1);
};

// Start committing
makeCommits(100);
