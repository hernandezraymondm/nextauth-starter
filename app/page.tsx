import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { EarthLock } from "lucide-react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  return (
    <main className="h-full flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary to-neutral">
      <div className="space-y-6 text-center">
        <div className="w-full flex items-center justify-center text-gray-100 drop-shadow-md">
          <EarthLock size={60} />
          <h1 className={cn("text-6xl font-semibold ", font.className)}>
            VeriSafe
          </h1>
        </div>
        <p className="text-white text-lg">
          Secure, Seamless Authentication for Modern Web Apps
        </p>
        <div>
          <LoginButton mode="modal" asChild>
            <Button
              variant="default"
              size="lg"
              className="font-semibold drop-shadow-md hover:text-violet-400"
            >
              Get started <Play />
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
