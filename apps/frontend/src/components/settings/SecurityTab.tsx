"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { auth } from "@/auth/client";
import type { Session } from "better-auth/types";
import { format } from "date-fns";
import FormatUserAgent from "@/lib/formatUserAgent";
import { Separator } from "../ui/separator";

export default function SecurityTab() {
  const [sessionList, setSessionList] = useState<Session[] | null>(null);

  useEffect(() => {
    async function getSessionList() {
      const sessionsData = await auth.listSessions();
      setSessionList(sessionsData.data);
    }
    getSessionList();
  }, []);
  return (
    <section className="p-10 -mt-20 w-full">
      <div className="w-full flex flex-col gap-6">
        {" "}
        <div className="flex w-full justify-between">
          <h1 className="text-base font-bold text-foreground/90">Password</h1>
          <Button size="sm" variant="outline">
            Reset password
          </Button>
        </div>
        <Separator />
        <div className="flex flex-col w-full justify-between gap-6">
          <h1 className="text-base font-bold text-foreground/90">Sessions</h1>
          <div className="grid grid-cols-2 gap-10 w-full">
            {sessionList?.map((session) => {
              return (
                <div
                  key={session.id}
                  className="flex flex-col w-full max-w-72 rounded-lg bg-popover border-1 border-input p-3 gap-3"
                >
                  <div className="flex justify-between w-full items-center">
                    <div className="text-foreground/65 font-semibold">
                      Browser
                    </div>{" "}
                    <FormatUserAgent userAgent={session.userAgent ?? ""} />
                  </div>
                  <div className="flex justify-between w-full items-center">
                    <div className="text-foreground/65 font-semibold">Date</div>
                    <span className="p-2 font-bold text-xs rounded-lg bg-primary-foreground text-primary">
                      {" "}
                      {format(
                        new Date(session.createdAt),
                        "dd/MM/yyyy 'at' HH:mm",
                      )}
                    </span>
                  </div>
                  <Button key={session.id} size="sm">
                    Remove access
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
        <Separator />
        <div className="flex w-full justify-between">
          <h1 className="text-base font-bold text-foreground/90">
            Delete account
          </h1>
          <Button size="sm" variant="destructive">
            Delete account
          </Button>
        </div>
      </div>
    </section>
  );
}
