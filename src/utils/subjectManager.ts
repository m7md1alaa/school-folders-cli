import path from "path";

import type { HighSchoolYear, HighSchoolTrack, Language, Subject } from "../types";
import { createFolder } from "./folderCreator";
import { getSemesterName } from "./languageHelpers";
import { subjectsByTrack } from "../constants/subjectsByTrack";

export function createSubjectFolders(
  rootPath: string,
  highSchoolYear: HighSchoolYear,
  track: HighSchoolTrack | null,
  language: Language, 
  additionalFolders: string[]
): void {
  const subjects = getSubjectsForYearAndTrack(highSchoolYear, track);

  Object.entries(subjects).forEach(([semester, semesterSubjects]) => {
    const semesterNumber = parseInt(semester.replace('Semester_', ''));
    const semesterPath = path.join(rootPath, getSemesterName(semesterNumber, language));
    createFolder(semesterPath);

    semesterSubjects.forEach(subject => {
      const subjectName = subject[language];
      const subjectPath = path.join(semesterPath, subjectName);
      createFolder(subjectPath);
      createSubjectSubfolders(subjectPath, additionalFolders);
    });
  });
}

function getSubjectsForYearAndTrack(
  year: HighSchoolYear,
  track: HighSchoolTrack | null
): { [key: string]: Subject[] } {
  const yearSubjects = subjectsByTrack[year];
  return track 
    ? { [track]: yearSubjects[track] } 
    : { general: yearSubjects.general };
}

function createSubjectSubfolders(
  subjectPath: string,
  additionalFolders: string[]
): void {
  additionalFolders.forEach(folder => {
    if (folder !== 'عام' && folder !== 'General') {
      createFolder(path.join(subjectPath, folder));
    }
  });
}