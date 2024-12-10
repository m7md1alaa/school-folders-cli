import { checkbox } from '@inquirer/prompts';
import type { Language } from '../types/index.js';

export async function getAdditionalFolders(language: Language): Promise<string[]> {
  const folderChoices = [
    {
      name: 'Projects & Research',
      value: language === 'ar' ? 'المشاريع والأبحاث' : 'Projects & Research',
    },
    {
      name: 'Presentations',
      value: language === 'ar' ? 'العروض التقديمية' : 'Presentations',
    },
    {
      name: 'Study Materials',
      value: language === 'ar' ? 'المواد الدراسية' : 'Study Materials',
    },
    {
      name: 'Exams',
      value: language === 'ar' ? 'الاختبارات' : 'Exams',
    },
    {
      name: 'General (Calendar & Deadlines, etc.)',
      value: language === 'ar' ? 'عام' : 'General',
    },
  ];

  return checkbox({
    message: 'Select optional folders to create within each subject folder for better organization:',
    choices: folderChoices,
  });
}