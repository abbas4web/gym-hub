import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Client, MembershipType } from '@/types/client';
import { getMembershipFee, calculateEndDate } from '@/lib/clientStore';
import { Camera, User } from 'lucide-react';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Client) => void;
}

const AddClientModal = ({ isOpen, onClose, onSave }: AddClientModalProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState<string | undefined>();
  const [membershipType, setMembershipType] = useState<MembershipType>('monthly');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const startDate = new Date().toISOString().split('T')[0];
    const endDate = calculateEndDate(startDate, membershipType);
    
    const newClient: Client = {
      id: Date.now().toString(),
      name,
      phone,
      email: email || undefined,
      photo,
      membershipType,
      startDate,
      endDate,
      fee: getMembershipFee(membershipType),
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    onSave(newClient);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setPhoto(undefined);
    setMembershipType('monthly');
  };

  const membershipOptions: { type: MembershipType; label: string; price: number }[] = [
    { type: 'monthly', label: 'Monthly', price: 1500 },
    { type: 'quarterly', label: 'Quarterly', price: 4000 },
    { type: 'yearly', label: 'Yearly', price: 15000 },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-foreground">Add New Client</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Photo Upload */}
          <div className="flex justify-center">
            <div 
              className="relative cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              {photo ? (
                <img 
                  src={photo} 
                  alt="Client" 
                  className="w-24 h-24 rounded-2xl object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-secondary flex items-center justify-center">
                  <User className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 rounded-2xl bg-background/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-6 w-6 text-foreground" />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Full Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter client name"
              required
              className="bg-secondary border-border focus:border-primary"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              required
              className="bg-secondary border-border focus:border-primary"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="bg-secondary border-border focus:border-primary"
            />
          </div>

          {/* Membership Type */}
          <div className="space-y-3">
            <Label className="text-foreground">Membership Plan *</Label>
            <div className="grid grid-cols-3 gap-3">
              {membershipOptions.map((option) => (
                <button
                  key={option.type}
                  type="button"
                  onClick={() => setMembershipType(option.type)}
                  className={`p-3 rounded-xl border transition-all duration-200 ${
                    membershipType === option.type
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-secondary text-foreground hover:border-primary/50'
                  }`}
                >
                  <div className="text-sm font-semibold font-heading">{option.label}</div>
                  <div className="text-xs mt-1 text-muted-foreground">₹{option.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Client
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientModal;
