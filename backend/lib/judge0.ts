const engineURL = process.env.JUDGE0_URL;
const token: string = process.env.JUDGE0_API_TOKEN || '';

export const getLanguages = async (): Promise<
    { id: number; name: string }[]
> => {
    const response = await fetch(`${engineURL}/languages`, {
        headers: new Headers({
            'X-Auth-Token': token,
        }),
    });
    return response.json();
};

export const createSubmission = async (body: {
    sourceCode: string;
    languageId: number;
    cpuTimeLimit?: number; // In milliseconds
    stdin?: string;
}): Promise<{ token: string }> => {
    const formattedBody = {
        source_code: body.sourceCode,
        language_id: body.languageId,
        ...(body.cpuTimeLimit && {
            cpu_time_limit: body.cpuTimeLimit / 1000,
        }),
        ...(body.stdin && {
            stdin: body.stdin,
        }),
    };

    const response = await fetch(`${engineURL}/submissions`, {
        method: 'POST',
        headers: new Headers({
            'X-Auth-Token': token,
            'Content-Type': 'application/json',
        }),
        body: JSON.stringify(formattedBody),
    });

    console.table(response.json());
    return response.json();
};

export const getSubmission = async (
    submissionToken: string,
): Promise<{
    stdout: string | null;
    time: string | null;
    memory: number | null;
    stderr: string | null;
    token: string;
    compile_output: string | null;
    message: string | null;
    status: {
        id: number;
        description:
            | 'Processing'
            | 'In Queue'
            | 'Accepted'
            | 'Compilation Error'
            | 'Runtime Error (NZEC)'
            | 'Time Limit Exceeded';
    };
}> => {
    const response = await fetch(
        `${engineURL}/submissions/${submissionToken}?base64_encoded=true`,
        {
            method: 'GET',
            headers: new Headers({
                'X-Auth-Token': token,
                'Content-Type': 'application/json',
            }),
        },
    );

    return response.json();
};

const status = await createSubmission({
    languageId: 54,
    sourceCode: `
    #include <iostream>
    #include <string>

    using namespace std;
    int main() {
        string name;
        cin >> name;

        cout << "Hello, World!, " << name << endl;
        return 0;
    }
    `,
    stdin: 'Tonkaew',
});

console.log(status);

while (true) {
    const sub = await getSubmission(status.token);

    console.log('hello world');

    if (
        sub.status.description === 'In Queue' ||
        sub.status.description === 'Processing'
    ) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
    }

    if (sub.status.description === 'Compilation Error') {
        console.log(atob(sub.compile_output || ''));
    } else if (sub.status.description === 'Accepted') {
        console.log(atob(sub.stdout || ''));
    } else {
        // console.log(sub);
        console.log(atob(sub.stdout || ''));
        console.log(atob(sub.message || ''));
        console.log(atob(sub.stderr || ''));
    }

    break;
}
