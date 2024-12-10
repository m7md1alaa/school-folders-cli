import { handleUniversity } from '../handlers/universityHandler.js';
import { handleHighSchool } from '../handlers/schoolHandler.js';
import { editFolderStructure } from '../handlers/editHandler.js';
import { select } from '@inquirer/prompts';
import type { EducationType, Language, ProgramOptions } from '../types/index.js';


export async function run(options: ProgramOptions): Promise<void> {
  try {
    if (options.edit) {
      await editFolderStructure();
    } else {
      const educationType = await select<EducationType>({
        message: 'What type of educational institution are you in?',
        choices: [
          { name: 'University', value: 'university' },
          { name: 'High School', value: 'highschool' },
        ],
      });

      const language = await select<Language>({
        message: 'Select your folders language:',
        choices: [
          { name: 'English', value: 'en' },
          { name: 'Arabic', value: 'ar' },
        ],
      });

      if (educationType === 'university') {
        await handleUniversity(language);
      } else {
        await handleHighSchool(language);
      }
    }

    if (!options.quiet) {
      console.log('Operation completed successfully.');
    }
  } catch (error) {
    console.error('An error occurred:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}