'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Cancel01Icon,
  CrownIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { auth } from '@/auth/client';

interface Traveler {
  id: number;
  email: string;
  role: string;
}

export default function TravelersForm() {
  const { data: session } = auth.useSession();

  const [travelers, setTravelers] = useState<Traveler[]>([]);

  const roleOptions = [
    {
      value: 'owner',
      label: 'Owner',
      icon: CrownIcon, // or use UserIcon if CrownIcon is not available
      description: 'Trip owner with full control',
    },
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

  const travelerRoleOptions = roleOptions.filter(
    (role) => role.value !== 'owner'
  );

  const handleAddTraveler = () => {
    setTravelers((prev) => [
      ...prev,
      { id: Date.now(), email: '', role: 'viewer' },
    ]);
  };

  const handleRemoveTraveler = (id: number) => {
    setTravelers((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEmailChange = (id: number, email: string) => {
    setTravelers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, email } : t))
    );
  };

  const handleRoleChange = (id: number, role: string) => {
    setTravelers((prev) => prev.map((t) => (t.id === id ? { ...t, role } : t)));
  };

  return (
    <div className="flex flex-col gap-6  px-32 mt-6">
      <div className="border border-accent relative rounded-xl p-4 w-full bg-muted/10">
        <p className="text-sm font-medium mb-2">Owner</p>
        <div className="flex  flex-col justify-between sm:flex-row w-full sm:items-center">
          <div className="flex gap-4 items-center justify-center">
            <Input type="email" disabled value={session?.user?.email || ''} />

            <Select value="owner" disabled>
              <SelectTrigger className="w-[350px]">
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
                      <span className="text-xs text-foreground/60">
                        {description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {travelers.map((traveler, index) => (
        <div
          key={traveler.id}
          className="border border-accent relative rounded-xl p-4 w-full bg-muted/10"
        >
          <p className="text-sm font-medium mb-2">Traveler {index + 1}</p>
          <div className="flex  flex-col justify-between sm:flex-row w-full sm:items-center">
            <div className="flex gap-4">
              <Input
                type="email"
                placeholder="Enter email address"
                value={traveler.email}
                onChange={(e) => handleEmailChange(traveler.id, e.target.value)}
              />

              <Select
                value={traveler.role}
                onValueChange={(value) => handleRoleChange(traveler.id, value)}
              >
                <SelectTrigger className="w-[350px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {travelerRoleOptions.map(
                    ({ value, label, icon, description }) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <HugeiconsIcon icon={icon} size={16} />
                            <span>{label}</span>
                          </div>
                          <span className="text-xs text-foreground/60">
                            {description}
                          </span>
                        </div>
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRemoveTraveler(traveler.id)}
            className="absolute right-4 top-4"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} />
          </Button>
        </div>
      ))}

      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={handleAddTraveler}
          className="flex items-center gap-2 border-dashed border-foreground/30 border cursor-pointer text-foreground/70 hover:bg-primary-foreground/30 hover:text-primary hover:border-primary transition-all"
        >
          <HugeiconsIcon icon={Add01Icon} size={16} />
        </Button>
      </div>
    </div>
  );
}
