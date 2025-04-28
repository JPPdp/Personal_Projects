import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";
import fs from "fs";  // Importing fs module to read and write files

    const path = "./data.json";
    const csharpFilePath = "./MyCSharpFile.cs";  // Path to your C# file
    const reactFilePath = "./MyComponent.js";  // Path to your React component file

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
    if (!fs.existsSync(csharpFilePath)) {
        fs.writeFileSync(csharpFilePath, `using System;\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine("Initial C# File");\n    }\n}\n`);
        console.log('C# file created!');
    }

    fs.readFile(csharpFilePath, 'utf8', (err, data) => {
        if (err) {
        console.error('Error reading C# file:', err);
        return;
        }

        const lines = data.split('\n');
        const randomLine = random.int(0, lines.length - 1);
        const randomText = generateRandomString(10);  // Use custom function to generate random string

        lines[randomLine] = `// Modified by script: ${randomText}`;

        const newData = lines.join('\n');
        fs.writeFile(csharpFilePath, newData, 'utf8', (err) => {
        if (err) {
            console.error('Error writing to C# file:', err);
        }
        });
    });
    };

    // Function to create or modify a React file randomly
    const modifyReactFile = () => {
    if (!fs.existsSync(reactFilePath)) {
        fs.writeFileSync(
        reactFilePath,
        `import React from 'react';\n\nconst MyComponent = () => {\n  return <div>Hello, World!</div>;\n};\n\nexport default MyComponent;\n`
        );
        console.log('React file created!');
    }

    fs.readFile(reactFilePath, 'utf8', (err, data) => {
        if (err) {
        console.error('Error reading React file:', err);
        return;
        }

        // Modify the content randomly (for example, changing the text inside JSX)
        let modifiedData = data;

        // Randomly change the text inside the div element
        const randomText = generateRandomString(10);  // Generate random string
        modifiedData = modifiedData.replace('<div>Hello, World!</div>', `<div>${randomText}</div>`);

        // Alternatively, you could modify other parts of the React component or add props randomly
        const randomAddProp = random.int(0, 1) === 1;
        if (randomAddProp) {
        const randomPropName = generateRandomString(5);
        const randomPropValue = generateRandomString(5);
        modifiedData = modifiedData.replace('<div>', `<div ${randomPropName}="${randomPropValue}">`);
        }

        fs.writeFile(reactFilePath, modifiedData, 'utf8', (err) => {
        if (err) {
            console.error('Error writing to React file:', err);
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
    modifyReactFile();  // Modify the React file before committing

    // Add the C# file, React file, and data.json to the commit
    await simpleGit().add([path, csharpFilePath, reactFilePath]).commit(date, { '--date': date });
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
    modifyReactFile();  // Modify the React file before committing

    // Add the C# file, React file, and data.json to the commit
    await simpleGit().add([path, csharpFilePath, reactFilePath]).commit(date, { '--date': date });

    // Recursively call makeCommits with decremented n
    await makeCommits(n - 1);
    };

makeCommits(100);
