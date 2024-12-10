import { input, select } from '@inquirer/prompts';
import path from 'path';
import os from 'os';

import { createSchoolFolders } from '../utils/folderCreator';
import { getAdditionalFolders } from '../utils/promptHelpers';
import type { Language, HighSchoolYear, HighSchoolTrack } from '../types/index';

export async function handleHighSchool(language: Language): Promise<void> {
  const schoolYear = await input({
    message: 'Enter the school year (e.g., 1445-1446):',
    validate: (input: string) => {
      const regex = /^\d{4}-\d{4}$/;
      return regex.test(input)
        ? true
        : 'Please enter a valid Hijri year range (e.g., 1445-1446).';
    },
  });

  const highSchoolYear = await select<HighSchoolYear>({
    message: "What's the high school year?",
    choices: [
      { name: 'First year', value: 'first' },
      { name: 'Second year', value: 'second' },
      { name: 'Third year', value: 'third' },
    ],
  });

  const highSchoolTrack = await getHighSchoolTrack(highSchoolYear);
  const additionalFolders = await getAdditionalFolders(language);
  const directory = await input({
    message: 'Enter the base directory where folders will be created:',
    default: path.join(os.homedir(), 'Desktop'),
  });

  await createSchoolFolders(
    directory,
    schoolYear,
    highSchoolYear,
    highSchoolTrack,
    language,
    additionalFolders
  );
}

async function getHighSchoolTrack(highSchoolYear: HighSchoolYear): Promise<HighSchoolTrack> {
  if (highSchoolYear === 'first') {
    return null;
  }

  return await select<Exclude<HighSchoolTrack, null>>({
    message: 'Select high school track:',
    choices: [
      { name: 'General track', value: 'general' },
      { name: 'Computer science and engineering', value: 'cs' },
      { name: 'Health and life', value: 'health' },
      { name: 'Business administration', value: 'business' },
      { name: 'Shariah track', value: 'shariah' },
    ],
  });
}