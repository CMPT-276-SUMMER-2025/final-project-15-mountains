import { test, expect } from '@playwright/test';

test('UNIT TEST ISSUE SUGGESTION: tests if route returns data ', async ({ request }) => {
            const Username = 'AmarKoonar';
            const Repo = 'AmarKoonar';
            const iden = await fetch(`https://api.github.com/users/${Username}`);

            expect(iden.ok).toBeTruthy();
  

            const ident = await iden.json();

            expect(ident).toBeDefined();

            const repo = await fetch(`https://api.github.com/repos/${Username}/${Repo}`);

            expect(repo.ok).toBeTruthy();
  

            const repos = await repo.json();

            expect(repos).toBeDefined();

            const response = await fetch(`https://api.github.com/repos/${Username}/${Repo}/contents/README.md`);

            expect(response.ok).toBeTruthy();
  

            const data = await response.json();
            expect(data).toBeDefined();
});
