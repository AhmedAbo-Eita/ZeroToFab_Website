// Google Drive utilities: ID extraction, on-demand stream URLs, and direct Drive v3 browser upload

export function extractGoogleDriveFileId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Raw Drive file ID (typically 25-45 alphanumeric/dash/underscore chars)
  if (/^[a-zA-Z0-9_-]{18,}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    // /file/d/<ID>/view or /file/d/<ID>/preview
    const fileMatch = url.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch?.[1]) return fileMatch[1];

    // ?id=<ID>
    const idParam = url.searchParams.get('id');
    if (idParam) return idParam;
  } catch {
    // Fallback regex if partial URL
    const match = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match?.[1]) return match[1];
  }

  return null;
}

export function getGoogleDrivePreviewUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/preview`;
}

export function getGoogleDriveDirectDownloadUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`;
}

// Load Google Identity Services script dynamically only when Admin initiates Google OAuth upload
function loadGsiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const win = window as unknown as { google?: { accounts?: unknown } };
    if (win.google?.accounts) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]'
    );
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Sign-In script')));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Sign-In script'));
    document.head.appendChild(script);
  });
}

export async function requestGoogleDriveToken(clientId: string): Promise<string> {
  if (!clientId.trim()) {
    throw new Error('Please configure your Google OAuth Client ID first.');
  }
  await loadGsiScript();

  return new Promise((resolve, reject) => {
    const win = window as unknown as {
      google?: {
        accounts?: {
          oauth2?: {
            initTokenClient: (cfg: {
              client_id: string;
              scope: string;
              callback: (resp: { access_token?: string; error?: string }) => void;
            }) => { requestAccessToken: () => void };
          };
        };
      };
    };

    const oauth2 = win.google?.accounts?.oauth2;
    if (!oauth2) {
      reject(new Error('Google Identity Services not available.'));
      return;
    }

    const client = oauth2.initTokenClient({
      client_id: clientId.trim(),
      scope: 'https://www.googleapis.com/auth/drive.file',
      callback: (resp) => {
        if (resp.error || !resp.access_token) {
          reject(new Error(resp.error || 'Google authentication was cancelled.'));
        } else {
          resolve(resp.access_token);
        }
      },
    });

    client.requestAccessToken();
  });
}

export async function uploadVideoToGoogleDrive(options: {
  file: File;
  accessToken: string;
  folderId?: string;
  makePublicLink?: boolean;
  onProgress?: (pct: number) => void;
}): Promise<{ fileId: string; webViewLink?: string }> {
  const { file, accessToken, folderId, makePublicLink = true, onProgress } = options;

  const metadata: Record<string, unknown> = {
    name: file.name,
    mimeType: file.type || 'video/mp4',
  };
  if (folderId?.trim()) {
    metadata.parents = [folderId.trim()];
  }

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append('file', file);

  const uploaded = await new Promise<{ id: string; webViewLink?: string }>(
    (resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(
        'POST',
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink'
      );
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);

      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable && onProgress) {
          onProgress(Math.round((evt.loaded / evt.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            reject(new Error('Invalid response from Google Drive API.'));
          }
        } else {
          reject(
            new Error(
              `Google Drive upload failed (${xhr.status}): ${xhr.responseText}`
            )
          );
        }
      };

      xhr.onerror = () => reject(new Error('Network error uploading to Google Drive.'));
      xhr.send(form);
    }
  );

  // Set "Anyone with the link can view" so students can stream on demand
  if (makePublicLink && uploaded.id) {
    await fetch(
      `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(uploaded.id)}/permissions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: 'reader', type: 'anyone' }),
      }
    ).catch(() => {
      // Non-fatal if organization restricts public sharing
    });
  }

  return { fileId: uploaded.id, webViewLink: uploaded.webViewLink };
}
