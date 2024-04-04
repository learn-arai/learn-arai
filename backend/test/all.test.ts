import { describe } from 'bun:test';

import authTest from './auth';
import classroomTest from './classroom';
import graderTest from './grader';

describe('All Tests', () => {
    authTest();
    classroomTest();
    graderTest();
});
