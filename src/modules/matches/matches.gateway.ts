import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { MatchesService } from './matches.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class MatchesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger: Logger = new Logger('MatchesGateway');

  constructor(private readonly matchesService: MatchesService) { }

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinMatch')
  async handleJoinMatch(
    @MessageBody() data: { matchId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const match = await this.matchesService.getMatch(data.matchId);
      client.join(`match-${data.matchId}`);

      // Send current match state to the client
      client.emit('matchJoined', {
        message: 'Successfully joined match',
        match,
      });

      this.logger.log(`Client ${client.id} joined match ${data.matchId}`);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('leaveMatch')
  handleLeaveMatch(
    @MessageBody() data: { matchId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`match-${data.matchId}`);
    this.logger.log(`Client ${client.id} left match ${data.matchId}`);
  }

  // Method to broadcast commentary updates (called from service)
  async broadcastCommentaryUpdate(matchId: string, commentary: any, match: any) {
    this.server.to(`match-${matchId}`).emit('commentaryUpdate', {
      commentary,
      match,
      timestamp: new Date(),
    });
  }

  // Method to broadcast match status updates
  async broadcastMatchUpdate(matchId: string, match: any) {
    this.server.to(`match-${matchId}`).emit('matchUpdate', {
      match,
      timestamp: new Date(),
    });
  }
}
