import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

    const path = "./data.json";

// Helper function to write file and return a promise
const writeFile = (data) => {
return new Promise((resolve, reject) => {
    jsonfile.writeFile(path, data, (err) => {
    if (err) reject(err);
    else resolve();
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

    await simpleGit().add([path]).commit(date, { '--date': date });
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
    await simpleGit().add([path]).commit(date, { '--date': date });

    // Recursively call makeCommits with decremented n
    await makeCommits(n - 1);
};

makeCommits(100);
