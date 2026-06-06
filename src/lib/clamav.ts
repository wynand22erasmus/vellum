/**
 * ClamAV INSTREAM virus scanning for uploaded file buffers.
 *
 * @packageDocumentation
 */

import net from 'node:net';
import { AppError } from './errors/app-error.ts';
import { env } from './env.ts';

/** @internal */
const CHUNK_SIZE = 64 * 1024;

/**
 * @internal
 * Reads one clamd response (null- or newline-terminated).
 */
function readClamdResponse(socket: net.Socket): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    const onData = (chunk: Buffer) => {
      data += chunk.toString('utf8');
      if (data.includes('\0') || data.includes('\n')) {
        socket.removeListener('data', onData);
        resolve(data.replace(/\0/g, '').trim());
      }
    };
    socket.on('data', onData);
    socket.once('error', reject);
  });
}

/**
 * Scans a file buffer via ClamAV `zINSTREAM`.
 *
 * @param buffer - Raw upload bytes
 * @returns `clean: true` or `clean: false` with a signature name in `reason`
 * @throws `AppError` When ClamAV is unreachable or returns an unexpected response
 */
export async function scanBuffer(buffer: Buffer): Promise<{ clean: boolean; reason?: string }> {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection(env.clamavPort, env.clamavHost);
    socket.setTimeout(120_000);

    socket.on('error', (err) => {
      reject(
        AppError.serviceUnavailable(
          `ClamAV virus scanner at ${env.clamavHost}:${env.clamavPort} is unreachable.`,
          {
            cause: err instanceof Error ? err.message : String(err),
          },
        ),
      );
    });

    socket.on('timeout', () => {
      socket.destroy();
      reject(
        AppError.serviceUnavailable(
          'ClamAV virus scan timed out after 120 seconds; the upload was rejected.',
        ),
      );
    });

    socket.on('connect', async () => {
      try {
        socket.write('zINSTREAM\0');

        let offset = 0;
        while (offset < buffer.length) {
          const chunk = buffer.subarray(offset, offset + CHUNK_SIZE);
          const sizeBuf = Buffer.alloc(4);
          sizeBuf.writeUInt32BE(chunk.length, 0);
          socket.write(sizeBuf);
          socket.write(chunk);
          offset += chunk.length;
        }

        const endBuf = Buffer.alloc(4);
        endBuf.writeUInt32BE(0, 0);
        socket.write(endBuf);

        const response = await readClamdResponse(socket);
        socket.end();

        if (response.includes('FOUND')) {
          const match = response.match(/FOUND:?\s*(.+)$/i);
          resolve({ clean: false, reason: match?.[1]?.trim() ?? 'Malware detected' });
        } else if (response.includes('OK')) {
          resolve({ clean: true });
        } else {
          reject(
            AppError.serviceUnavailable(
              'ClamAV returned an unexpected scan response; the upload was rejected.',
              {
                internal: { response },
              },
            ),
          );
        }
      } catch (err) {
        socket.destroy();
        reject(err);
      }
    });
  });
}

/**
 * Returns whether clamd responds to `zPING` (health check).
 */
export async function checkClamAV(): Promise<boolean> {
  try {
    return await new Promise((resolve) => {
      const socket = net.createConnection(env.clamavPort, env.clamavHost);
      socket.setTimeout(3000);

      socket.on('connect', () => {
        socket.write('zPING\0');
      });

      socket.on('data', (chunk) => {
        const text = chunk.toString('utf8').replace(/\0/g, '').trim();
        socket.destroy();
        resolve(text.toUpperCase().includes('PONG'));
      });

      socket.on('error', () => resolve(false));
      socket.on('timeout', () => {
        socket.destroy();
        resolve(false);
      });
    });
  } catch {
    return false;
  }
}
