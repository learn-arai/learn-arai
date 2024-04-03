import { describe, test } from 'bun:test';

import { classroomData } from './classroom';

export default function runTest() {
    describe('Grader System', () => {
        test('Check', async () => {
            console.log(classroomData);
        });
    });
}
