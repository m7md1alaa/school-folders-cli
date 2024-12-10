import fs from 'fs';
import path from 'path';
import { getSemesterName, getArabicYearName } from './languageHelpers.js';
import type { Language, HighSchoolYear, HighSchoolTrack } from '../types/index';
import { createSubjectFolders } from './subjectManager';

export function createFolder(folderPath: string): void {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Folder created: ${folderPath}`);
  } else {
    console.log(`Folder already exists: ${folderPath}`);
  }
}

export function createAdditionalFolders(basePath: string, additionalFolders: string[], language: Language): void {
  additionalFolders.forEach(folder => {
    if (folder === 'عام' || folder === 'General') {
      const generalPath = path.join(basePath, folder);
      createFolder(generalPath);
      createFolder(path.join(
        generalPath,
        language === 'ar' ? 'التقويم والمواعيد النهائية' : 'Calendar & Deadlines'
      ));
    }
  });
}

export function createSchoolFolders(
  baseDirectory: string,
  year: string,
  highSchoolYear: HighSchoolYear,
  track: HighSchoolTrack,
  language: Language,
  additionalFolders: string[]
): void {
  const yearName = language === 'ar' ? getArabicYearName(highSchoolYear) : highSchoolYear;
  const rootFolderName = `${yearName} ${year}`;
  const rootPath = path.join(baseDirectory, rootFolderName);
  
  createFolder(rootPath);
  createAdditionalFolders(rootPath, additionalFolders, language);
  createSubjectFolders(rootPath, highSchoolYear, track, language, additionalFolders);
}

export function createUniversityFolders(
  baseDirectory: string,
  year: string,
  semesterCount: number,
  semesters: string[][],
  additionalFolders: string[],
  language: Language
): void {
  const yearPath = path.join(baseDirectory, year);
  createFolder(yearPath);
  createAdditionalFolders(yearPath, additionalFolders, language);

  for (let i = 0; i < semesterCount; i++) {
    const semesterPath = path.join(yearPath, getSemesterName(i + 1, language));
    createFolder(semesterPath);
    createSemesterSubjects(semesterPath, semesters[i], additionalFolders);
  }
}

function createSemesterSubjects(semesterPath: string, subjects: string[], additionalFolders: string[]): void {
  subjects.forEach(subject => {
    const subjectPath = path.join(semesterPath, subject.trim());
    createFolder(subjectPath);
    createSubjectSubfolders(subjectPath, additionalFolders);
  });
}

function createSubjectSubfolders(subjectPath: string, additionalFolders: string[]): void {
  additionalFolders.forEach(folder => {
    if (folder !== 'عام' && folder !== 'General') {
      createFolder(path.join(subjectPath, folder));
    }
  });
}