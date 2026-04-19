const assert = require('assert');
const fs = require('fs').promises;
const path = require('path');

const {
  createFile,
  readFile,
  appendToFile,
  updateFile,
  deleteFile,
  listDirectory,
} = require('./fileoperations');

const baseDir = path.join(__dirname, 'files');
const fileName = 'item.txt';
const filePath = path.join(baseDir, fileName);

const createdItem = [
  'Type: lost',
  'Item Name: Blue Backpack',
  'Category: Bags',
  'Location: Library Block A',
].join('\n');

const appendedItemDetails = [
  'Description: Contains notebooks and a charger',
  'Contact Number: 9876543210',
].join('\n');

const updatedItem = [
  'Type: found',
  'Item Name: Blue Backpack',
  'Category: Bags',
  'Location: Reception Desk',
  'Description: Bag handed over to the admin office',
  'Status: open',
].join('\n');

async function runTests() {
  await fs.mkdir(baseDir, { recursive: true });

  try {
    await createFile(fileName, createdItem);
    const createdContent = await readFile(fileName);
    assert.strictEqual(createdContent, createdItem);
    console.log('\nAfter create:\n' + createdContent);

    await appendToFile(fileName, '\n' + appendedItemDetails);
    const appendedContent = await readFile(fileName);
    assert.strictEqual(
      appendedContent,
      createdItem + '\n' + appendedItemDetails
    );
    console.log('\nAfter append:\n' + appendedContent);

    await updateFile(fileName, updatedItem);
    const updatedContent = await readFile(fileName);
    assert.strictEqual(updatedContent, updatedItem);
    console.log('\nAfter update:\n' + updatedContent);

    const files = await listDirectory();
    assert.ok(files.includes(fileName));
    console.log('Files in directory:', files);

    await deleteFile(fileName);
    await assert.rejects(() => fs.access(filePath), /ENOENT/);
    console.log('After delete: item.txt removed');

    console.log('All file operation tests passed successfully.');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

runTests();
