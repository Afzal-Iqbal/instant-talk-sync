import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/config/api';

interface Message {
  _id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: string;
}

const Chat = () => {
  const { currentUser, logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!currentUser) return;

    const newSocket = io(SOCKET_URL, {
      auth: {
        token: currentUser.token,
      },
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    // Listen for previous messages
    newSocket.on('previousMessages', (msgs: Message[]) => {
      setMessages(msgs);
    });

    // Listen for new messages
    newSocket.on('newMessage', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('error', (error: string) => {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [currentUser, toast]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !currentUser) return;

    setLoading(true);
    
    // Emit message through Socket.IO
    socket.emit('sendMessage', {
      text: newMessage,
      userId: currentUser._id,
      userName: currentUser.displayName,
    });

    setNewMessage('');
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    toast({ title: 'Logged out', description: 'See you next time!' });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Chat Room</h1>
            <p className="text-sm text-muted-foreground">
              Logged in as {currentUser?.displayName}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4">
        <div className="mx-auto max-w-4xl space-y-4 py-4">
          {messages.map((message) => {
            const isCurrentUser = message.userId === currentUser?._id;
            return (
              <div
                key={message._id}
                className={`flex items-start gap-3 ${
                  isCurrentUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getInitials(message.userName)}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`flex flex-col ${
                    isCurrentUser ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="mb-1 text-xs text-muted-foreground">
                    {message.userName}
                  </div>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      isCurrentUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="break-words">{message.text}</p>
                  </div>
                  {message.timestamp && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t bg-card p-4">
        <form
          onSubmit={handleSendMessage}
          className="mx-auto flex max-w-4xl gap-2"
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
