const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "..", "assignments.json");

async function readAssignments() {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading assignments:", error.message);
    return [];
  }
}

async function writeAssignments(assignments) {
  try {
    await fs.writeFile(
      filePath,
      JSON.stringify(assignments, null, 2)
    );
  } catch (error) {
    console.error("Error writing assignments:", error.message);
  }
}

module.exports = {
  readAssignments,
  writeAssignments
};