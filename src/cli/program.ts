import { Command } from 'commander';

export function setupProgram(): Command {
  const program = new Command();

  program
    .version('1.0.0')
    .description('CLI tool for creating folders for school or university')
    .option('-l, --language <lang>', 'Set the language (en/ar)', 'en')
    .option('-o, --output <directory>', 'Set the output directory', process.cwd())
    .option('-y, --year <year>', 'Set the academic year (e.g., 2023-2024 or 1446-1447)')
    .option('-e, --education-type <type>', 'Set the education type (university/school)')
    .option('-hy, --high-school-year <year>', 'Set the high school year (first/second/third)')
    .option('-t, --track <track>', 'Set the high school track (general/cs/health/business/shariah)')
    .option('-s, --semesters <count>', 'Set the number of semesters for university (2/3)', '2')
    .option('-a, --additional-folders <folders>', 'Comma-separated list of additional folders to create')
    .option('-q, --quiet', 'Run in quiet mode (suppress console output)')
    .option('-f, --force', 'Force overwrite existing folders')
    .option('--edit', 'Edit existing folder structure')
    .parse(process.argv);

  return program;
}