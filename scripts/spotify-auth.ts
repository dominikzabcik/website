/**
 * One-time OAuth helper: prints a Spotify authorize URL, runs a local server to
 * catch the redirect, exchanges the code for tokens, prints SPOTIFY_REFRESH_TOKEN.
 *
 * Prereqs:
 * 1. Spotify Developer Dashboard → your app → add Redirect URI exactly:
 *    http://127.0.0.1:8888/callback
 * 2. .env has SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET (no refresh token yet).
 *
 * Run: bun scripts/spotify-auth.ts
 */
import { config } from 'dotenv';
import { createServer } from 'http';

config({ path: '.env' });

const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = [
    'user-read-currently-playing',
    'user-read-playback-state',
].join(' ');

const clientId = process.env.SPOTIFY_CLIENT_ID?.trim();
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim();

if (!clientId || !clientSecret) {
    console.error(
        'Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env first.',
    );
    process.exit(1);
}

const authUrl =
    'https://accounts.spotify.com/authorize?' +
    new URLSearchParams({
        client_id: clientId,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        scope: SCOPES,
    }).toString();

async function exchangeCode(code: string): Promise<void> {
    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
    });

    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${basic}`,
        },
        body,
    });

    const text = await res.text();
    if (!res.ok) {
        console.error('Token exchange failed:', res.status, text);
        return;
    }

    const data = JSON.parse(text) as {
        refresh_token?: string;
        access_token?: string;
        expires_in?: number;
    };

    if (!data.refresh_token) {
        console.error(
            'No refresh_token in response. If you already authorized this app before, revoke access at https://www.spotify.com/account/apps/ and run this script again.',
        );
        console.error('Raw:', text);
        return;
    }

    console.log('\n--- Add this to .env (and Vercel) ---\n');
    console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`);
    console.log('\n--- Done. Keep the secret private. ---\n');
}

const server = createServer(async (req, res) => {
    const host = req.headers.host ?? `127.0.0.1:${PORT}`;
    const url = new URL(req.url ?? '/', `http://${host}`);

    if (url.pathname !== '/callback') {
        res.writeHead(404);
        res.end('Not found');
        return;
    }

    const err = url.searchParams.get('error');
    const code = url.searchParams.get('code');

    if (err) {
        res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<p>Spotify error: ${err}</p>`);
        server.close();
        process.exit(1);
    }

    if (!code) {
        res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<p>No code in callback.</p>');
        server.close();
        process.exit(1);
    }

    await exchangeCode(code);

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(
        '<p>OK — check your terminal for <code>SPOTIFY_REFRESH_TOKEN</code>. You can close this tab.</p>',
    );
    server.close();
    process.exit(0);
});

server.listen(PORT, '127.0.0.1', () => {
    console.log('\n1) In Spotify Dashboard → your app → Settings, add Redirect URI:\n');
    console.log(`   ${REDIRECT_URI}\n`);
    console.log('2) Open this URL in your browser (sign in if asked):\n');
    console.log(`   ${authUrl}\n`);
    console.log('Waiting for redirect…\n');
});
