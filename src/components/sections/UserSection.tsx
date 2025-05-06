import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Mic, MicOff, User, VideoOff } from 'lucide-react';
import { RemoteUser } from '../../services/agora.service';

interface UserSectionProps {
  isJoined: boolean;
  isMuted: boolean;
  remoteUsers: RemoteUser[];
  onToggleMute: () => void;
  onLeaveChannel: () => void;
}

const UserSection: React.FC<UserSectionProps> = ({
  isJoined,
  isMuted,
  remoteUsers,
  onToggleMute,
  onLeaveChannel
}) => {
  return (
    <Card className="col-span-1 row-span-1 shadow-lg h-full flex flex-col">
      <CardHeader className="border-b bg-gradient-to-r from-[#fcf9f8] via-[#c46ffb] to-[#a0faff] pt-0">
        <CardTitle className="text-2xl">Users</CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex-1 overflow-y-auto">
        <div className="space-y-6">
          {isJoined && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4 p-4 bg-[#9b4bb7] text-white rounded-xl w-full">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#833388]">
                  <User className="w-7 h-7" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">You</span>
                  <span className="flex items-center gap-1 text-sm text-white/80">
                    <VideoOff className="w-4 h-4 mr-1" /> Video Off
                  </span>
                  <span className="text-xs text-green-200 mt-1">Joined</span>
                </div>
              </div>

              <Button
                onClick={onLeaveChannel}
                variant="destructive"
                size="lg"
                className="w-full"
              >
                Leave Class
              </Button>

              <Button
                onClick={onToggleMute}
                variant={isMuted ? "destructive" : "outline"}
                size="lg"
                className={`w-12 h-12 flex items-center justify-center rounded-full bg-[#833388] text-white hover:bg-[#9b4bb7] transition-colors duration-200 ${isMuted ? '!bg-gray-400 !text-white' : ''}`}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
            </div>
          )}

          {remoteUsers.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {remoteUsers.slice(0, 3).map((user) => (
                  <div key={user.uid} className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs">U</span>
                  </div>
                ))}
                {remoteUsers.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs">+{remoteUsers.length - 3}</span>
                  </div>
                )}
              </div>
              <span>{remoteUsers.length} user{remoteUsers.length !== 1 ? 's' : ''} in channel</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserSection; 