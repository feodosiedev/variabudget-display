
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateBuildingBudget } from "@/services/sharePointService";
import { useQueryClient } from "@tanstack/react-query";
import { Building } from "@/types/budget";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  budgeted: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: "Budget must be a positive number" }
  ),
  actual: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0,
    { message: "Actual spend must be a non-negative number" }
  ),
});

interface BudgetUpdateFormProps {
  building: Building;
  onSuccess?: () => void;
}

export function BudgetUpdateForm({ building, onSuccess }: BudgetUpdateFormProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budgeted: building.budgeted.toString(),
      actual: building.actual.toString(),
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsUpdating(true);
      
      const updates = {
        budgeted: Number(values.budgeted),
        actual: Number(values.actual),
      };
      
      // Check if values actually changed
      if (
        updates.budgeted === building.budgeted && 
        updates.actual === building.actual
      ) {
        toast({
          title: "No changes detected",
          description: "Budget values remain the same",
        });
        return;
      }
      
      const success = await updateBuildingBudget(building.id, updates);
      
      if (success) {
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['building', building.id] });
        queryClient.invalidateQueries({ queryKey: ['region', building.region] });
        queryClient.invalidateQueries({ queryKey: ['budgetSummary'] });
        
        toast({
          title: "Budget updated",
          description: "The building budget has been successfully updated in SharePoint",
        });
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Failed to update budget:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating the budget in SharePoint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="budgeted"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="actual"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Actual Spend</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update Budget"}
        </Button>
      </form>
    </Form>
  );
}
