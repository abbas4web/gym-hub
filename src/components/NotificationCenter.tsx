import { useState } from 'react';
import { Client } from '@/types/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Phone, Send, Bell, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  NotificationType, 
  sendExpiryNotification, 
  getExpiringClients,
  formatNotificationType 
} from '@/lib/notificationService';

interface NotificationCenterProps {
  clients: Client[];
}

const NotificationCenter = ({ clients }: NotificationCenterProps) => {
  const [notificationType, setNotificationType] = useState<NotificationType>('both');
  const [daysThreshold, setDaysThreshold] = useState<string>('7');
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  const [sentNotifications, setSentNotifications] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const expiringClients = getExpiringClients(clients, parseInt(daysThreshold));

  const handleSendNotification = async (client: Client) => {
    setSendingTo(client.id);
    
    try {
      const results = await sendExpiryNotification(client, notificationType);
      
      const successCount = results.filter(r => r.success).length;
      
      if (successCount > 0) {
        setSentNotifications(prev => new Set([...prev, client.id]));
        toast({
          title: "Notification Sent (Simulated)",
          description: `${formatNotificationType(notificationType)} sent to ${client.name} at ${client.phone}`,
        });
      }
    } catch (error) {
      toast({
        title: "Failed to Send",
        description: "Could not send notification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingTo(null);
    }
  };

  const handleSendToAll = async () => {
    const unsent = expiringClients.filter(c => !sentNotifications.has(c.id));
    
    if (unsent.length === 0) {
      toast({
        title: "All Notified",
        description: "All expiring clients have already been notified.",
      });
      return;
    }

    for (const client of unsent) {
      await handleSendNotification(client);
    }

    toast({
      title: "Bulk Notifications Complete",
      description: `Sent notifications to ${unsent.length} client(s).`,
    });
  };

  const getDaysUntilExpiry = (endDate: string) => {
    return Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  };

  const getExpiryBadge = (days: number) => {
    if (days < 0) {
      return <Badge variant="destructive">Expired {Math.abs(days)}d ago</Badge>;
    } else if (days === 0) {
      return <Badge variant="destructive">Expires today</Badge>;
    } else if (days <= 3) {
      return <Badge variant="destructive">Expires in {days}d</Badge>;
    } else {
      return <Badge variant="secondary">Expires in {days}d</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Bell className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Notification Center</h2>
          <p className="text-muted-foreground text-sm">Send expiry alerts to clients</p>
        </div>
      </div>

      {/* Demo Notice */}
      <Card className="border-amber-500/30 bg-amber-500/10">
        <CardContent className="py-3 px-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-200">
            <strong>Demo Mode:</strong> Notifications are simulated. Enable Lovable Cloud for real SMS/WhatsApp via Twilio.
          </p>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Notification Settings</CardTitle>
          <CardDescription>Configure how to notify clients</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Send via</label>
              <Select value={notificationType} onValueChange={(v) => setNotificationType(v as NotificationType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      SMS Only
                    </div>
                  </SelectItem>
                  <SelectItem value="whatsapp">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      WhatsApp Only
                    </div>
                  </SelectItem>
                  <SelectItem value="both">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Both
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Expiry within</label>
              <Select value={daysThreshold} onValueChange={setDaysThreshold}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expiring Clients List */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Expiring Memberships</CardTitle>
              <CardDescription>{expiringClients.length} client(s) need notification</CardDescription>
            </div>
            {expiringClients.length > 0 && (
              <Button 
                size="sm" 
                onClick={handleSendToAll}
                disabled={sendingTo !== null}
              >
                <Send className="h-4 w-4 mr-2" />
                Notify All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {expiringClients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No clients expiring within {daysThreshold} days</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expiringClients.map(client => {
                const days = getDaysUntilExpiry(client.endDate);
                const isSent = sentNotifications.has(client.id);
                const isSending = sendingTo === client.id;

                return (
                  <div 
                    key={client.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      {client.photo ? (
                        <img 
                          src={client.photo} 
                          alt={client.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-primary font-medium">
                            {client.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-muted-foreground">{client.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getExpiryBadge(days)}
                      {isSent ? (
                        <Badge variant="outline" className="text-green-400 border-green-400/50">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Sent
                        </Badge>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleSendNotification(client)}
                          disabled={isSending}
                        >
                          {isSending ? (
                            <span className="animate-pulse">Sending...</span>
                          ) : (
                            <>
                              <Send className="h-3 w-3 mr-1" />
                              Notify
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;
