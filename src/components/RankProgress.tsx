
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RankProgressProps {
  currentRank: string;
  currentVP: number;
  nextRankVP: number;
  nextRank: string;
}

const RankProgress = ({ 
  currentRank, 
  currentVP, 
  nextRankVP,
  nextRank
}: RankProgressProps) => {
  const progressPercentage = Math.min(100, (currentVP / nextRankVP) * 100);
  
  // Define ranks with their VP requirements and colors
  const ranks = [
    { name: "Starter", vp: 0, color: "bg-gray-300" },
    { name: "Advanced", vp: 20, color: "bg-blue-500" },
    { name: "Bronze", vp: 45, color: "bg-amber-700" },
    { name: "Silver", vp: 100, color: "bg-gray-400" },
    { name: "Gold", vp: 250, color: "bg-yellow-500" },
    { name: "Platinum", vp: 500, color: "bg-slate-800" }
  ];
  
  const getRankIndex = (rank: string) => {
    return ranks.findIndex(r => r.name === rank);
  };
  
  const currentRankIndex = getRankIndex(currentRank);
  const nextRankIndex = getRankIndex(nextRank);
  
  const rankColorClass = currentRankIndex >= 0 ? ranks[currentRankIndex].color : "bg-gray-300";
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Rank Progress</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <HelpCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="w-80 p-4">
                <div className="space-y-2">
                  <p className="font-medium">Rank Requirements:</p>
                  <ul className="text-sm space-y-1">
                    <li>• <span className="font-medium">Starter:</span> Initial rank for all new consultants</li>
                    <li>• <span className="font-medium">Advanced:</span> 20 VP or purchase Advanced Kit</li>
                    <li>• <span className="font-medium">Bronze:</span> 45 Group VP, minimum 3 team members</li>
                    <li>• <span className="font-medium">Silver:</span> 100 Group VP, minimum 5 team members</li>
                    <li>• <span className="font-medium">Gold:</span> 250 Group VP, minimum 10 team members</li>
                    <li>• <span className="font-medium">Platinum:</span> 500 Group VP, minimum 15 team members</li>
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${rankColorClass}`}></div>
            <span className="font-medium">{currentRank}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {currentVP} / {nextRankVP} VP
          </div>
        </div>
        
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <motion.div 
            className={`h-full ${rankColorClass}`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </div>
        
        <div className="pt-2">
          <div className="relative w-full h-10">
            {ranks.map((rank, index) => {
              // Calculate position percentage
              const position = index === ranks.length - 1 
                ? 100 
                : (rank.vp / ranks[ranks.length - 1].vp) * 100;
              
              return (
                <div 
                  key={rank.name}
                  className="absolute transform -translate-x-1/2"
                  style={{ left: `${position}%` }}
                >
                  <div 
                    className={`w-3 h-3 rounded-full mx-auto ${
                      index <= currentRankIndex ? rank.color : "bg-muted-foreground/30"
                    }`}
                  />
                  <div 
                    className={`text-xs mt-1 text-center ${
                      index === currentRankIndex 
                        ? "font-medium" 
                        : "text-muted-foreground"
                    }`}
                  >
                    {rank.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="pt-2 text-sm text-center text-muted-foreground">
          {progressPercentage < 100 ? (
            <span>
              {Math.round(nextRankVP - currentVP)} more VP needed to reach {nextRank}
            </span>
          ) : (
            <span className="text-accent font-medium">
              Congratulations! You've reached {currentRank}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RankProgress;
