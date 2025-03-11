
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

const rankSchema = z.object({
  name: z.string().min(1, "Rank name is required"),
  commission_rate: z.coerce.number().min(0, "Commission rate must be 0 or more").max(100, "Commission rate must be 100 or less"),
  threshold_pv: z.coerce.number().min(0, "Personal volume threshold must be 0 or more"),
  threshold_gv: z.coerce.number().min(0, "Group volume threshold must be 0 or more"),
});

export type RankFormValues = z.infer<typeof rankSchema>;

interface RankFormProps {
  onSubmit: (values: RankFormValues) => Promise<void>;
  initialValues?: Partial<RankFormValues>;
}

export const RankForm = ({ onSubmit, initialValues }: RankFormProps) => {
  const form = useForm<RankFormValues>({
    resolver: zodResolver(rankSchema),
    defaultValues: {
      name: initialValues?.name || "",
      commission_rate: initialValues?.commission_rate || 0,
      threshold_pv: initialValues?.threshold_pv || 0,
      threshold_gv: initialValues?.threshold_gv || 0,
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rank Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Bronze, Silver, Gold" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="commission_rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commission Rate (%)</FormLabel>
              <FormControl>
                <Input type="number" min="0" max="100" step="0.5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="threshold_pv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personal Volume Threshold</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="threshold_gv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group Volume Threshold</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter className="mt-6">
          <Button type="submit">Save Rank</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
