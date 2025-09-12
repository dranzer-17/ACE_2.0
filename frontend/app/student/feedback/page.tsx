"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiService } from "@/app/lib/apiService";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// --- THIS IS THE FIX ---
// We will treat the rating as a string within the form's lifecycle.
const formSchema = z.object({
  category: z.enum(["faculty", "resources", "canteen", "events", "general"]),
  subject: z.string().min(3, { message: "Subject must be at least 3 characters." }),
  rating: z.string().optional().nullable(), // Treat it as a string
  comment: z.string().min(10, { message: "Comment must be at least 10 characters." }),
  is_anonymous: z.boolean(),
});

export default function StudentFeedbackPage() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "general", subject: "", comment: "", is_anonymous: false, rating: undefined
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user && !values.is_anonymous) {
        toast.error("You must be logged in to submit non-anonymously.");
        return;
    }
    
    setIsSubmitting(true);
    
    // --- THIS IS THE FIX ---
    // We create the final data object for the API here,
    // converting the rating string to a number.
    const feedbackData = {
        ...values,
        rating: values.rating ? parseInt(values.rating, 10) : null, // Convert string to number
        student_id: values.is_anonymous ? null : user?.id
    };

    const result = await apiService.submitFeedback(feedbackData);
    toast[result.success ? 'success' : 'error'](result.message);

    if (result.success) {
      form.reset();
    }
    setIsSubmitting(false);
  }

  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-bold">Submit Feedback</h1>
       <Card>
            <CardHeader>
                <CardTitle>Feedback Form</CardTitle>
                <CardDescription>We value your input. Please let us know how we can improve.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Category Field (unchanged) */}
                        <FormField control={form.control} name="category" render={({ field }) => (
                             <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="faculty">Faculty</SelectItem>
                                        <SelectItem value="resources">Campus Resources</SelectItem>
                                        <SelectItem value="canteen">Canteen</SelectItem>
                                        <SelectItem value="events">Committees/Events</SelectItem>
                                        <SelectItem value="general">General</SelectItem>
                                    </SelectContent>
                                </Select><FormMessage />
                            </FormItem>
                        )}/>
                        {/* Subject Field (unchanged) */}
                        <FormField control={form.control} name="subject" render={({ field }) => (
                            <FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="e.g., Prof. Smith's Lecture, Library WiFi..." {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        {/* Rating Field (UPDATED to use string values) */}
                        <FormField control={form.control} name="rating" render={({ field }) => (
                           <FormItem>
                                <FormLabel>Rating (Optional)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a rating (1-5)" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="1">1 - Poor</SelectItem>
                                        <SelectItem value="2">2 - Fair</SelectItem>
                                        <SelectItem value="3">3 - Good</SelectItem>
                                        <SelectItem value="4">4 - Very Good</SelectItem>
                                        <SelectItem value="5">5 - Excellent</SelectItem>
                                    </SelectContent>
                                </Select><FormMessage />
                            </FormItem>
                        )}/>
                        {/* Comment Field (unchanged) */}
                        <FormField control={form.control} name="comment" render={({ field }) => (
                            <FormItem><FormLabel>Comment</FormLabel><FormControl><Textarea placeholder="Please provide detailed feedback..." {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        {/* Anonymous Field (unchanged) */}
                        <FormField control={form.control} name="is_anonymous" render={({ field }) => (
                           <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Submit Anonymously</FormLabel>
                                    <p className="text-sm text-muted-foreground">Your name will not be attached to this feedback.</p>
                                </div>
                            </FormItem>
                        )}/>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit Feedback"}</Button>
                    </form>
                </Form>
            </CardContent>
       </Card>
    </div>
  );
}