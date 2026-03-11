import { parseSleepDurationInHours } from '@shared/utils';
import { strict as assert } from 'node:assert';

const parsedResult = parseSleepDurationInHours('7h 3m');
assert.equal(parsedResult, 7.05);
