export default {
  displayName: 'garmin-activities',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '<rootDir>/../../../../coverage/apps/web-scraper/garmin-activities',
  testMatch: [
    '**/test/**/*.spec.ts',
    '**/test/**/*.test.ts',
    '**/src/**/*.spec.ts',
    '**/src/**/*.test.ts',
  ],
  moduleNameMapper: {
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
  },
};
