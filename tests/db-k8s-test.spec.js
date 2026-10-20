// tests/db-k8s-test.spec.js
import { test, expect } from '@playwright/test';
import { spawn } from 'node:child_process';
import pkg from 'pg';
const { Pool } = pkg;

function startPortForward() {
    const child = spawn('kubectl', [
        'port-forward',
        '--address',
        '127.0.0.1',
        'service/k8s-postgres-service',
        '0:5432',
    ], { stdio: ['ignore', 'pipe', 'pipe'] });

    return new Promise((resolve, reject) => {
        let stderr = '';
        const timeout = setTimeout(() => finish(new Error('Timed out waiting for kubectl port-forward to start.')), 15000);

        const cleanup = () => {
            clearTimeout(timeout);
            child.stdout.off('data', onStdout);
            child.stderr.off('data', onStderr);
            child.off('error', onError);
            child.off('exit', onExit);
        };
        const finish = (error, port) => {
            cleanup();
            if (error) {
                child.kill();
                reject(error);
            } else {
                resolve({ child, port });
            }
        };
        const onStdout = (data) => {
            const match = data.toString().match(/Forwarding from 127\.0\.0\.1:(\d+) -> 5432/);
            if (match) finish(null, Number(match[1]));
        };
        const onStderr = (data) => {
            stderr += data.toString();
        };
        const onError = (error) => finish(new Error(`Failed to start kubectl port-forward: ${error.message}`));
        const onExit = (code, signal) => {
            finish(new Error(`kubectl port-forward exited (${signal ?? code}). ${stderr.trim()}`));
        };

        child.stdout.on('data', onStdout);
        child.stderr.on('data', onStderr);
        child.once('error', onError);
        child.once('exit', onExit);
    });
}

async function stopPortForward(child) {
    if (child.exitCode !== null || child.signalCode !== null) return;

    await new Promise((resolve) => {
        const timeout = setTimeout(() => {
            child.off('exit', onExit);
            resolve();
        }, 2000);
        const onExit = () => {
            clearTimeout(timeout);
            resolve();
        };

        child.once('exit', onExit);
        child.kill('SIGTERM');
    });
}

test('Проверка интеграции автотеста с базой данных внутри Kubernetes', async () => {
    const portForward = process.env.K8S_POSTGRES_HOST
        ? null
        : await startPortForward();
    let pool;

    try {
        pool = new Pool({
            user: 'qa_user',
            host: process.env.K8S_POSTGRES_HOST ?? '127.0.0.1',
            database: 'ecom_test_db',
            password: 'qa_password123',
            port: Number(process.env.K8S_POSTGRES_PORT ?? portForward?.port ?? 30432),
        });

        await pool.query(`
            CREATE TABLE IF NOT EXISTS k8s_users (
                id SERIAL PRIMARY KEY,
                username TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL
            );
        `);

        const randomEmail = `k8s_beast_${Date.now()}@gmail.com`;

        await pool.query('INSERT INTO k8s_users (username, email) VALUES ($1, $2);', ['Duishon_K8s', randomEmail]);
        console.log(`[Kubernetes DB Write]: Успешно записан юзер: ${randomEmail}`);

        const res = await pool.query('SELECT * FROM k8s_users WHERE email = $1;', [randomEmail]);

        expect(res.rows.length).toBe(1);
        expect(res.rows[0].username).toBe('Duishon_K8s');
        console.log(`[Kubernetes DB Read]: Из Кубера успешно прочитано имя: ${res.rows[0].username}`);
    } finally {
        try {
            if (pool) await pool.end();
        } finally {
            if (portForward) await stopPortForward(portForward.child);
        }
    }
});
