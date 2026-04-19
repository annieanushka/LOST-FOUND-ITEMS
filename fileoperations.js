const fs = require('fs').promises;
const path = require('path');
const baseDir = path.join(__dirname, 'files');
async function ensureDir() {
  try {
    await fs.mkdir(baseDir, { recursive: true });
  } catch (err) {
    console.error(err);
  }
}
async function createFile(fileName, content) {
  await ensureDir();
  const filePath = path.join(baseDir, fileName);
  await fs.writeFile(
    filePath,
    content,
    'utf8'
  );
}
async function readFile(fileName) {
  const filePath = path.join(baseDir, fileName);
  return await fs.readFile(
    filePath,
    'utf8'
  );
}
async function appendToFile(fileName, content) {
  const filePath = path.join(baseDir, fileName);
  await fs.appendFile(
    filePath,
    content,
    'utf8'
  );
}
async function updateFile(fileName, content) {
  const filePath = path.join(baseDir, fileName);
  await fs.writeFile(
    filePath,
    content,
    'utf8'
  );
}
async function deleteFile(fileName) {
  const filePath = path.join(baseDir, fileName);
  await fs.unlink(filePath);
}
async function listDirectory() {
  await ensureDir();
  return await fs.readdir(baseDir);
}
module.exports = {
  createFile,
  readFile,
  appendToFile,
  updateFile,
  deleteFile,
  listDirectory
};