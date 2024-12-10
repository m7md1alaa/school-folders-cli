import { input, select } from '@inquirer/prompts';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { createFolder } from '../utils/folderCreator.js';

export async function editFolderStructure(): Promise<void> {
  const baseDirectory = await input({
    message: 'Enter the base directory of the folder structure you want to edit:',
    default: path.join(os.homedir(), 'Desktop'),
  });

  if (!fs.existsSync(baseDirectory)) {
    console.log('The specified directory does not exist.');
    return;
  }

  const semesterFolders = getSemesterFolders(baseDirectory);
  
  if (semesterFolders.length === 0) {
    await handleNoSemesters(baseDirectory);
    return;
  }

  await handleEditAction(baseDirectory, semesterFolders);
}

function getSemesterFolders(baseDirectory: string): string[] {
  return fs.readdirSync(baseDirectory)
    .filter(folder => folder.startsWith('Semester_') || folder.startsWith('الترم'));
}

async function handleNoSemesters(baseDirectory: string): Promise<void> {
  console.log('No semester folders found in the specified directory.');
  const createNew = await select<boolean>({
    message: 'Would you like to create a new semester folder?',
    choices: [
      { name: 'Yes', value: true },
      { name: 'No', value: false },
    ],
  });

  if (createNew) {
    const newSemesterName = await input({
      message: 'Enter the name of the new semester folder:',
      default: 'Semester_1',
    });
    createFolder(path.join(baseDirectory, newSemesterName));
    console.log(`Created new semester folder: ${newSemesterName}`);
  } else {
    console.log('Operation cancelled.');
  }
}

type EditAction = 'add_subject' | 'remove_subject';

async function handleEditAction(baseDirectory: string, semesterFolders: string[]): Promise<void> {
  const action = await select<EditAction>({
    message: 'What would you like to do?',
    choices: [
      { name: 'Add a new subject', value: 'add_subject' },
      { name: 'Remove a subject', value: 'remove_subject' },
    ],
  });

  const semester = await select<string>({
    message: action === 'add_subject' ? 'Select the semester to add the subject to:' : 'Select the semester to remove a subject from:',
    choices: semesterFolders.map(folder => ({ name: folder, value: folder })),
  });

  if (action === 'add_subject') {
    await addNewSubject(baseDirectory, semester);
  } else {
    await removeSubject(baseDirectory, semester);
  }
}

async function addNewSubject(baseDirectory: string, semester: string): Promise<void> {
  const newSubject = await input({
    message: 'Enter the name of the new subject:',
  });

  const subjectPath = path.join(baseDirectory, semester, newSubject);
  createFolder(subjectPath);
  console.log(`Added new subject: ${newSubject} to ${semester}`);
}

async function removeSubject(baseDirectory: string, semester: string): Promise<void> {
  const subjects = fs.readdirSync(path.join(baseDirectory, semester));

  if (subjects.length === 0) {
    console.log(`No subjects found in ${semester}.`);
    return;
  }

  const subjectToRemove = await select<string>({
    message: 'Select the subject to remove:',
    choices: subjects.map(subject => ({ name: subject, value: subject })),
  });

  fs.rmdirSync(path.join(baseDirectory, semester, subjectToRemove), { recursive: true });
  console.log(`Removed subject: ${subjectToRemove} from ${semester}`);
}