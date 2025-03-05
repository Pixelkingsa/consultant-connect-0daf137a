
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { User, Award, TrendingUp, Users } from "lucide-react";

interface ConsultantCardProps {
  rank: "Starter" | "Advanced" | "Bronze" | "Silver" | "Gold" | "Platinum";
  name: string;
  image?: string;
  personalVP: number;
  groupVP: number;
  teamSize: number;
}

const ConsultantCard = ({
  rank,
  name,
  image,
  personalVP,
  groupVP,
  teamSize,
}: ConsultantCardProps) => {
  // Define rank colors
  const rankColors = {
    Starter: "bg-secondary text-secondary-foreground",
    Advanced: "bg-blue-500 text-white",
    Bronze: "bg-amber-700 text-white",
    Silver: "bg-gray-400 text-white",
    Gold: "bg-yellow-500 text-white",
    Platinum: "bg-slate-800 text-white",
  };
  
  // Define percentage to next rank (simplified logic)
  const progressToNextRank = () => {
    switch (rank) {
      case "Starter":
        return Math.min(100, (personalVP / 20) * 100);
      case "Advanced":
        return Math.min(100, (groupVP / 45) * 100);
      case "Bronze":
        return Math.min(100, (groupVP / 100) * 100);
      case "Silver":
        return Math.min(100, (groupVP / 250) * 100);
      case "Gold":
        return Math.min(100, (groupVP / 500) * 100);
      default:
        return 100;
    }
  };
  
  return (
    <motion.div
      className="glass-card rounded-xl overflow-hidden p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          {image ? (
            <img 
              src={image} 
              alt={name} 
              className="w-16 h-16 rounded-full object-cover border-2 border-white/50"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <Badge 
            className={`absolute -bottom-1 -right-1 ${rankColors[rank]}`}
          >
            {rank}
          </Badge>
        </div>
        
        <div>
          <h3 className="font-medium text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground">Consultant</p>
        </div>
      </div>
      
      <div className="mt-6 space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="text-sm flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Personal Volume Points</span>
            </div>
            <span className="font-medium text-sm">{personalVP} VP</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent"
              style={{ 
                width: `${Math.min(100, (personalVP / 30) * 100)}%` 
              }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="text-sm flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>Group Volume Points</span>
            </div>
            <span className="font-medium text-sm">{groupVP} VP</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary"
              style={{ width: `${Math.min(100, (groupVP / 100) * 100)}%` }}
            />
          </div>
        </div>
        
        <div className="pt-2">
          <div className="flex justify-between items-center mb-1">
            <div className="text-sm flex items-center gap-1">
              <Award className="h-3.5 w-3.5" />
              <span>Progress to Next Rank</span>
            </div>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full ${
                rank === "Platinum" ? "bg-slate-800" : "bg-gradient-to-r from-accent to-primary"
              }`}
              style={{ width: `${progressToNextRank()}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>Current: {rank}</span>
            <span>Team Size: {teamSize} consultants</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ConsultantCard;
