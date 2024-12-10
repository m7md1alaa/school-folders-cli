import { input, select } from '@inquirer/prompts';
import path from 'path';
import os from 'os';
import { createUniversityFolders } from '../utils/folderCreator.js';
import { getAdditionalFolders } from '../utils/promptHelpers.js';
import { validateUniversityYear } from '../utils/validators.js';
import type{ Language } from '../types/index.js';

export async function handleUniversity(language: Language): Promise<void> {
  const year = await input({
    message: 'Enter the university year (e.g., 2023-2024):',
    validate: validateUniversityYear,
  });

  const semesterCount = await select<2 | 3>({
    message: 'How many semesters does your university have?',
    choices: [
      { name: '2 semesters', value: 2 },
      { name: '3 semesters', value: 3 },
    ],
  });

  const semesters = await collectSemesterSubjects(semesterCount, language);
  const additionalFolders = await getAdditionalFolders(language);
  const directory = await input({
    message: 'Enter the base directory where folders will be created:',
    default: path.join(os.homedir(), 'Desktop'),
  });

  await createUniversityFolders(directory, year, semesterCount, semesters, additionalFolders, language);
}

async function collectSemesterSubjects(semesterCount: number, language: Language): Promise<string[][]> {
  const semesters: string[][] = [];
  for (let i = 1; i <= semesterCount; i++) {
    const subjects = await collectSubjectsForSemester(i, language);
    semesters.push(subjects);
  }
  return semesters;
}

async function collectSubjectsForSemester(semesterNumber: number, language: Language): Promise<string[]> {
  const subjects: string[] = [];
  let addMore = true;

  while (addMore) {
    const subjectName = await input({
      message: `Enter subject name for Semester ${semesterNumber}:`,
    });
    subjects.push(subjectName);

    addMore = await select<boolean>({
      message: `Do you want to add another subject to Semester ${semesterNumber}?`,
      choices: [
        { name: 'Yes', value: true },
        { name: 'No', value: false },
      ],
    });
  }

  return subjects;
}