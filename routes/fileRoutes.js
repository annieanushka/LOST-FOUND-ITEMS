const express = require('express');
const router = express.Router();
const {
  createFile,
  readFile,
  appendToFile,
  updateFile,
  deleteFile,
  listDirectory,
} = require('../fileoperations');

const DEFAULT_FILE_NAME = 'items.txt';

function getFileName(req) {
  return req.body.fileName || req.query.fileName || DEFAULT_FILE_NAME;
}

router.post('/create', async (req, res) => {
  try {
    const fileName = getFileName(req);
    const content = req.body.content || '';

    await createFile(fileName, content);

    res.json({
      success: true,
      message: 'File created successfully',
      fileName,
      content,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get('/read', async (req, res) => {
  try {
    const fileName = getFileName(req);
    const content = await readFile(fileName);

    res.json({
      success: true,
      fileName,
      content,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post('/append', async (req, res) => {
  try {
    const fileName = getFileName(req);
    const contentToAppend = req.body.content || '';

    await appendToFile(fileName, contentToAppend);
    const updatedContent = await readFile(fileName);

    res.json({
      success: true,
      message: 'Content appended successfully',
      fileName,
      content: updatedContent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.put('/update', async (req, res) => {
  try {
    const fileName = getFileName(req);
    const content = req.body.content || '';

    await updateFile(fileName, content);

    res.json({
      success: true,
      message: 'File updated successfully',
      fileName,
      content,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.delete('/delete', async (req, res) => {
  try {
    const fileName = getFileName(req);

    await deleteFile(fileName);

    res.json({
      success: true,
      message: 'File deleted successfully',
      fileName,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get('/list', async (req, res) => {
  try {
    const files = await listDirectory();

    res.json({
      success: true,
      files,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
