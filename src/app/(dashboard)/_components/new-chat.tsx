"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarGroupAction } from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";
import { useAction, useMutation } from "convex/react";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const NewChat = () => {
  const [open, setOpen] = useState(false);
  const embedRepo = useAction(api.functions.chats.embedRepo);
  const createChat = useMutation(api.functions.chats.create);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const id = await embedRepo({
        url: e.currentTarget.url.value,
      });
      // setOpen(false);
      // router.push(`/chats/${id}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        toast.error("User not found. Please check the username.");
      } else {
        toast.error("Failed to create DM", {
          description: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarGroupAction>
          <PlusIcon />
          <span className="sr-only">New Session</span>
        </SidebarGroupAction>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">New Session</DialogTitle>
          <DialogDescription className="text-center">
            Enter a repo URL to start a session.
          </DialogDescription>
        </DialogHeader>
        <form className="contents" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <Label htmlFor="username">Repo URL</Label>
            <Input id="url" type="text" />
          </div>
          <DialogFooter>
            <Button className="w-full">Start chatting</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
