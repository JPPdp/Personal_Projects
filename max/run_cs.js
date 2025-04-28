import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";
import fs from "fs";  // Importing fs module to read and write files

const path = "./data.json";
const csharpFilePath = "./MyCSharpFile.cs";  // Path to your C# file

// Helper function to write file and return a promise
const writeFile = (data) => {
  return new Promise((resolve, reject) => {
    jsonfile.writeFile(path, data, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

// Function to generate a random string of a given length
const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};

// Function to modify C# file randomly
const modifyCSharpFile = () => {
  // Check if the C# file exists
  if (!fs.existsSync(csharpFilePath)) {
    // If the file does not exist, create it with initial content
    fs.writeFileSync(csharpFilePath, `using System;\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine("Initial C# File");\n    }\n}\n`);
    console.log('C# file created!');
  }

  // Read the C# file
  fs.readFile(csharpFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading C# file:', err);
      return;
    }

    // Randomly select a line to modify or add content
    const lines = data.split('\n');
    const randomLine = random.int(0, lines.length - 1);
    const randomText = generateRandomString(10);  // Use custom function to generate random string

    // Modify a random line or append to the file
    lines[randomLine] = `// Modified by script: ${randomText}`;

    // Join the lines back together and write to the file
    const newData = lines.join('\n');
    fs.writeFile(csharpFilePath, newData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing to C# file:', err);
      }
    });
  });
};

const markCommit = async (x, y) => {
  const date = moment()
    .subtract(1, "y")
    .add(1, "d")
    .add(x, "w")
    .add(y, "d")
    .format();

  const data = {
    date: date,
  };

  await writeFile(data); // Wait for file to be written before committing
  modifyCSharpFile(); // Modify the C# file before committing

  // Add both the data.json and MyCSharpFile.cs to the commit
  await simpleGit().add([path, csharpFilePath]).commit(date, { '--date': date });
  await simpleGit().push();
};

const makeCommits = async (n) => {
  if (n === 0) return simpleGit().push(); // Base case: push when no more commits are needed

  const x = random.int(0, 54);
  const y = random.int(0, 6);
  const date = moment().subtract(1, "y").add(1, "d").add(x, "w").add(y, "d").format();

  const data = {
    date: date,
  };
  console.log(date);

  await writeFile(data); // Wait for file to be written before committing
  modifyCSharpFile(); // Modify the C# file before committing

  // Add both the data.json and MyCSharpFile.cs to the commit
  await simpleGit().add([path, csharpFilePath]).commit(date, { '--date': date });

  // Recursively call makeCommits with decremented n
  await makeCommits(n - 1);
};

makeCommits(100);
