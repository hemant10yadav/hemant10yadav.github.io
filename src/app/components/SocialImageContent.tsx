import { HeroSection } from "./HeroSection";

export default function SocialImageContent() {
    return (
      <div className="h-[630px] w-[1200px] bg-gradient-to-b from-gray-900 to-gray-950 text-white overflow-hidden">
        <div className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent h-full">
          <main className="px-2">
            <HeroSection />
          </main>
        </div>
      </div>
    );
  }
