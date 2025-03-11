
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronUp, ChevronDown, Pencil } from "lucide-react";

interface RanksTableProps {
  ranks: any[];
  onMoveRank: (rankId: string, direction: 'up' | 'down') => Promise<void>;
  onEditRank: (rank: any) => void;
}

export const RanksTable = ({ ranks, onMoveRank, onEditRank }: RanksTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Commission Rate</TableHead>
            <TableHead>PV Threshold</TableHead>
            <TableHead>GV Threshold</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ranks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                No ranks found. Add one to get started!
              </TableCell>
            </TableRow>
          ) : (
            ranks.map((rank, index) => (
              <TableRow key={rank.id}>
                <TableCell className="font-medium">{rank.name}</TableCell>
                <TableCell>{rank.commission_rate}%</TableCell>
                <TableCell>{rank.threshold_pv}</TableCell>
                <TableCell>{rank.threshold_gv}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onMoveRank(rank.id, 'up')}
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onMoveRank(rank.id, 'down')}
                      disabled={index === ranks.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEditRank(rank)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
