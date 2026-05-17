import net from 'node:net';
import { env } from './env.ts';

const CHUNK_SIZE = 64 * 1024;

function sendInstCommand(socket: net.Socket, command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    const onData = (chunk: Buffer) => {
      data += chunk.toString();
      if (data.includes('\n')) {
        socket.removeListener('data', onData);
        resolve(data.trim());
      }
    };
    socket.on('data', onData);
    socket.write(command);
    socket.once('error', reject);
  });
}

export async function scanBuffer(buffer: Buffer): Promise<{ clean: boolean; reason?: string }> {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection(env.clamavPort, env.clamavHost);
    socket.setTimeout(120_000);

    socket.on('error', (err) => {
      reject(new Error(`ClamAV unavailable: ${err.message}`));
    });

    socket.on('timeout', () => {
      socket.destroy();
      reject(new Error('ClamAV scan timed out'));
    });

    socket.on('connect', async () => {
      try {
        await sendInstCommand(socket, 'zINSTREAM\0');

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

        const response = await sendInstCommand(socket, '');
        socket.end();

        if (response.includes('FOUND')) {
          const match = response.match(/FOUND: (.+)$/);
          resolve({ clean: false, reason: match?.[1] ?? 'Malware detected' });
        } else if (response.includes('OK')) {
          resolve({ clean: true });
        } else {
          reject(new Error(`Unexpected ClamAV response: ${response}`));
        }
      } catch (err) {
        socket.destroy();
        reject(err);
      }
    });
  });
}

export async function checkClamAV(): Promise<boolean> {
  try {
    return await new Promise((resolve) => {
      const socket = net.createConnection(env.clamavPort, env.clamavHost);
      socket.setTimeout(3000);
      socket.on('connect', () => {
        socket.end();
        resolve(true);
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
