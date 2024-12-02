import {
  AcceptedFriendsList,
  PendingFriendsList,
} from "./_components/friends-list";
import { AddFriend } from "./_components/add-friend";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function friendsPage() {
  return (
    // flex-1 fills up all of the available space
    // divide-y creates a divider (line) between the header and the content
    // bring flex first! orer matters in className
    <div className="flex flex-1 flex-col divide-y">
      <header className="flex items-center justify-between p-4">
        <h1 className="font-semibold">Friends</h1>
        <AddFriend />
      </header>
      {/* display 2 lists: pending and active friends */}
      <div className="grid p-4 gap-4">
        <TooltipProvider delayDuration={0}>
          <PendingFriendsList />
          <AcceptedFriendsList />
        </TooltipProvider>
      </div>
    </div>
  );
}
