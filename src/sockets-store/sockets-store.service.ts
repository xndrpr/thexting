export class SocketsStoreService {
  static sockets = new Map<string, number>();

  static addSocket(socket: string, userId: number) {
    SocketsStoreService.sockets.forEach((value, key) => {
      if (value === userId) {
        SocketsStoreService.sockets.delete(key);
      }
    });

    SocketsStoreService.sockets.set(socket, userId);
  }

  static getUserIdBySocket(socket: string) {
    return SocketsStoreService.sockets.get(socket);
  }

  static getSocketByUserId(userId: number) {
    console.log('---');
    console.log(userId);
    console.log(SocketsStoreService.sockets);
    console.log('---');
    return Array.from(SocketsStoreService.sockets.entries()).find(
      ([, id]) => id === userId,
    )?.[0];
  }

  static deleteSocket(socket: string, userId: number) {
    if (SocketsStoreService.sockets.get(socket) === userId) {
      SocketsStoreService.sockets.delete(socket);
      return true;
    } else {
      return false;
    }
  }
}
