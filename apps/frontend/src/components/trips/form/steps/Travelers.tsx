'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ViewIcon,
  PencilEdit02Icon,
  UserIcon,
  Add01Icon,
  Delete02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface Traveler {
  id: number;
  email: string;
  role: string;
}

export default function Travelers() {
  const [travelers, setTravelers] = useState<Traveler[]>([]);

  const roleOptions = [
    {
      value: 'viewer',
      label: 'Viewer',
      icon: ViewIcon,
      description: 'Can view trip details',
    },
    {
      value: 'editor',
      label: 'Editor',
      icon: PencilEdit02Icon,
      description: 'Can edit trip details',
    },
    {
      value: 'admin',
      label: 'Admin',
      icon: UserIcon,
      description: 'Full access and control',
    },
  ];

  const handleAddTraveler = () => {
    setTravelers((prev) => [
      ...prev,
      { id: Date.now(), email: '', role: 'viewer' },
    ]);
  };

  const handleRemoveTraveler = (id: number) => {
    setTravelers((prev) => prev.filter((traveler) => traveler.id !== id));
  };

  const handleEmailChange = (id: number, email: string) => {
    setTravelers((prev) =>
      prev.map((traveler) =>
        traveler.id === id ? { ...traveler, email } : traveler
      )
    );
  };

  const handleRoleChange = (id: number, role: string) => {
    setTravelers((prev) =>
      prev.map((traveler) =>
        traveler.id === id ? { ...traveler, role } : traveler
      )
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <Label className="text-base">Travelers</Label>
      
      {travelers.map((traveler) => (
        <div key={traveler.id} className="flex gap-2 items-center">
          <div className="flex-1">
            <Input
              type="email"
              placeholder="Enter email address"
              value={traveler.email}
              onChange={(e) => handleEmailChange(traveler.id, e.target.value)}
            />
          </div>
          
          <Select
            value={traveler.role}
            onValueChange={(value) => handleRoleChange(traveler.id, value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map(({ value, label, icon, description }) => (
                <SelectItem key={value} value={value}>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={icon} size={16} />
                      <span>{label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleRemoveTraveler(traveler.id)}
            className="shrink-0"
          >
            <HugeiconsIcon icon={Delete02Icon} size={16} />
          </Button>
        </div>
      ))}
      
      <Button
        variant="outline"
        onClick={handleAddTraveler}
        className="flex items-center gap-2 w-fit"
      >
        <HugeiconsIcon icon={Add01Icon} size={16} />
        Add Traveler
      </Button>
    </div>
  );
}