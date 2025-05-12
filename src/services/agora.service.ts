import axios from '../config/axios.config';
import { API_CONFIG } from '../config/api.config';
import AgoraRTC, {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  IRemoteAudioTrack,
  UID
} from 'agora-rtc-sdk-ng';
import AgoraRTM from 'agora-rtm-sdk';
import { logger } from '@/utils/logger';
import { ETranscriptionObjectType, IAgentTranscription, IUserTranscription, messageEngine } from './agora.message.service';
// import { messageEngine } from './agora.message.service';
const { RTM } = AgoraRTM;
export interface JoinChannelConfig {
  appId: string;
  channelName: string;
  token: string;
  uid: number;
  rtmToken: string;
}

export interface StartAgentResponse {
  rtcToken: string;
  channelName: string;
  appId: string;
  uid: number;
  rtmToken: string;
}

export interface RemoteUser {
  uid: UID;
  audioTrack?: IRemoteAudioTrack;
}

export interface AgoraServiceCallbacks {
  onUserJoined?: (user: RemoteUser) => void;
  onUserLeft?: (uid: UID) => void;
  onUserPublished?: (user: RemoteUser) => void;
  onUserUnpublished?: (user: RemoteUser) => void;
  onUserTranscription?: (msg: IUserTranscription) => void;
  onAgentTranscription?: (msg: IAgentTranscription) => void;
}

class AgoraService {
  private client: IAgoraRTCClient;
  private rtmClient: any;
  private localAudioTrack: IMicrophoneAudioTrack | null = null;
  private remoteUsers: Map<UID, RemoteUser> = new Map();
  private callbacks: AgoraServiceCallbacks = {};

  constructor() {
    this.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.client.on('user-joined', async (user) => {
      this.remoteUsers.set(user.uid, { uid: user.uid });
      this.callbacks.onUserJoined?.(this.remoteUsers.get(user.uid)!);
    });

    this.client.on('user-left', (user) => {
      this.remoteUsers.delete(user.uid);
      this.callbacks.onUserLeft?.(user.uid);
    });

    this.client.on('user-published', async (user, mediaType) => {
      if (mediaType === 'audio') {
        await this.client.subscribe(user, mediaType);
        const remoteUser = this.remoteUsers.get(user.uid);
        if (remoteUser) {
          remoteUser.audioTrack = user.audioTrack;
          remoteUser.audioTrack?.play();
          this.callbacks.onUserPublished?.(remoteUser);
        }
      }
    });

    this.client.on('user-unpublished', (user, mediaType) => {
      if (mediaType === 'audio') {
        const remoteUser = this.remoteUsers.get(user.uid);
        if (remoteUser) {
          remoteUser.audioTrack = undefined;
          this.callbacks.onUserUnpublished?.(remoteUser);
        }
      }
    });

    this.client.on('stream-message', (_: UID, payload: Uint8Array) => {
      const msg = messageEngine.handleStreamMessage(payload)
      if (msg === null) {
        return
      }
      if (msg.object === ETranscriptionObjectType.USER_TRANSCRIPTION) {
        this.callbacks.onUserTranscription?.(msg);
      } else if (msg.object === ETranscriptionObjectType.AGENT_TRANSCRIPTION) {
        this.callbacks.onAgentTranscription?.(msg);
      }
    })
  }

  async startAgent(): Promise<StartAgentResponse> {
    try {
      const response = await axios.post<StartAgentResponse>(`${API_CONFIG.ENDPOINTS.AGENT.START}`);
      return response.data;
    } catch (error) {
      logger.error('Agora Service', 'Error starting agent');
      throw error;
    }
  }

  setCallbacks(callbacks: AgoraServiceCallbacks) {
    this.callbacks = callbacks;
  }

  async joinChannel(channelInfo: JoinChannelConfig): Promise<void> {
    // this.rtmClient = new RTM(channelInfo.appId, channelInfo.uid.toString());
    // this.rtmClient.addEventListener("message", (event: any) => {
    //   console.log('Loggin Service', 'Message:', event);
    // });

    // try {
    //   const loginResponse = await this.rtmClient.login({
    //     token: channelInfo.rtmToken
    //   });
    //   console.log('Loggin Service', 'Login Response:', loginResponse);
    // } catch (error) {
    //   logger.error('Agora Service', 'Error logging in to RTM');
    //   throw error;
    // }

    await this.client.join(
      channelInfo.appId,
      channelInfo.channelName,
      channelInfo.token,
      Number(channelInfo.uid)
    );
    this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await this.client.publish([this.localAudioTrack]);
  }

  async leaveChannel(): Promise<void> {
    if (this.localAudioTrack) {
      this.localAudioTrack.close();
    }
    await this.client.leave();
    this.localAudioTrack = null;
    this.remoteUsers.clear();
  }

  getLocalAudioTrack(): IMicrophoneAudioTrack | null {
    return this.localAudioTrack;
  }

  getRemoteUsers(): RemoteUser[] {
    return Array.from(this.remoteUsers.values());
  }

  toggleAudio(enabled: boolean): void {
    if (this.localAudioTrack) {
      this.localAudioTrack.setEnabled(enabled);
    }
  }
}

export const agoraService = new AgoraService();