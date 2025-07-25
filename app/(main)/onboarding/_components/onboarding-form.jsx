"use client";

import { updateUser } from "@/actions/user";
import { onBoardingSchema } from "@/app/lib/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/useFetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const OnboardingForm = ({ industries }) => {
  const router = useRouter();
  const [selectIndustry, setSelectIndustry] = useState(null);

  const {
    fn: updateUserFn,
    data: updateResult,
    error: updateError,
    loading: updateLoading,
  } = useFetch(updateUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(onBoardingSchema),
  });

  const onSubmit = async (values) => {
    try {
      const formattedIndustry = `${values.industry}-${values.subIndustry.toLowerCase().replace(/ /g, "-")}`;
      await updateUserFn({
        ...values,
        industry: formattedIndustry,
      });
    } catch (error) {
      console.log("Onboarding Error", error);
    }
  };

  useEffect(() => {
    if (!updateLoading && updateResult?.success) {
      toast.success("Profile Update Successfully!");
      router.push("/dashboard");
      router.refresh();
    }
  }, [updateLoading, updateResult]);

  const watchIndustry = watch("industry");

  return (
    <div className="flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg mt-10 mx-2">
        <CardHeader>
          <CardTitle className="gradient-title text-4xl">Complete your Profile</CardTitle>
          <CardDescription>
            Select your industry to get personalized career insights and recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="industry ">Industry</Label>
              <Select
                onValueChange={(value) => {
                  setValue("industry", value);
                  setSelectIndustry(industries?.find((industry) => industry.id === value));
                  setValue("subIndustry", "");
                }}
              >
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select an industry"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {industries?.map((industry) => (
                    <SelectItem value={industry.id} key={industry.id}>
                      {industry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industry && <p className="text-sm text-red-500">{errors.industry.message}</p>}
            </div>

            {watchIndustry && (
              <div className="space-y-2">
                <Label htmlFor="subIndustry ">Specialization</Label>
                <Select onValueChange={(value) => setValue("subIndustry", value)}>
                  <SelectTrigger id="subIndustry">
                    <SelectValue placeholder="Select an subIndustry"></SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    {selectIndustry?.subIndustries.map((subIndustry) => (
                      <SelectItem value={subIndustry} key={subIndustry}>
                        {subIndustry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subIndustry && <p className="text-sm text-red-500">{errors.subIndustry.message}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="experience ">Years of Experience</Label>
              <Input
                min="0"
                max="50"
                type="number"
                id="experience"
                {...register("experience")}
                placeholder="Enter Years of experience"
              />

              {errors.experience && <p className="text-sm text-red-500">{errors.experience.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                {...register("skills")}
                placeholder="e..g., Python, Javascript, Project Management "
              />

              <p className="text-sm text-muted-foreground">Separate multiple skills with commas</p>

              {errors.skills && <p className="text-sm text-red-500">{errors.skills.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                className="h-32"
                {...register("bio")}
                placeholder="Tell us about your professional background..."
              />

              {errors.bio && <p className="text-sm text-red-500">{errors.bio.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={updateLoading}>
              {updateLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Complete Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;
