'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Add01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { auth } from '@/auth/client';
import { AnimatedList } from '@/components/ui/AnimatedList';
import { TRAVELER_ROLE_OPTIONS } from '@/constants/trip';
import { useTravelers, useTripActions } from '@/stores/trip-store';

export default function TravelersForm() {
  const { data: session } = auth.useSession();
  const travelers = useTravelers();
  const actions = useTripActions();

  const travelerRoleOptions = TRAVELER_ROLE_OPTIONS.filter(
    (role) => role.value !== 'owner'
  );

  const handleAddTraveler = () => {
    const newTraveler = { id: Date.now(), email: '', role: 'viewer' };
    actions.setTravelers([...travelers.users, newTraveler]);
  };

  const handleRemoveTraveler = (id: number) => {
    actions.setTravelers(travelers.users.filter((t) => t.id !== id));
  };

  const handleEmailChange = (id: number, email: string) => {
    actions.setTravelers(
      travelers.users.map((t) => (t.id === id ? { ...t, email } : t))
    );
  };

  const handleRoleChange = (id: number, role: string) => {
    actions.setTravelers(
      travelers.users.map((t) => (t.id === id ? { ...t, role } : t))
    );
  };

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-8 lg:px-32 mt-6 pb-12 scrollbar-gutter-stable overflow-y-auto">
      <div className="border border-accent relative rounded-xl p-4 w-full bg-muted/10">
        <p className="text-sm font-medium mb-2">Owner</p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center flex-1">
            <div className="w-full sm:w-96">
              <Input
                showClear={false}
                type="email"
                disabled
                value={session?.user?.email || ''}
              />
            </div>
            <Select value="owner" disabled>
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRAVELER_ROLE_OPTIONS.map(
                  ({ value, label, icon, description }) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <HugeiconsIcon icon={icon} size={14} />
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
      </div>

      <AnimatedList marginOffset={24} gap="gap-6">
        {travelers.users.map((traveler, index) => (
          <div
            key={traveler.id}
            className="border border-accent relative rounded-xl p-4 w-full bg-muted/10"
          >
            <p className="text-sm font-medium mb-2">Traveler {index + 1}</p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center flex-1 pr-8 sm:pr-0">
                <div className="w-full sm:w-96">
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={traveler.email}
                    onChange={(e) =>
                      handleEmailChange(traveler.id, e.target.value)
                    }
                  />
                </div>

                <Select
                  value={traveler.role}
                  onValueChange={(value) =>
                    handleRoleChange(traveler.id, value)
                  }
                >
                  <SelectTrigger className="w-full sm:w-56">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {travelerRoleOptions.map(
                      ({ value, label, icon, description }) => (
                        <SelectItem key={value} value={value}>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <HugeiconsIcon icon={icon} size={14} />
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
              className="absolute right-2 top-2 sm:right-4 sm:top-4"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={14} />
            </Button>
          </div>
        ))}
      </AnimatedList>

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
