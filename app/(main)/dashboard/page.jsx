import { getIndustryInsights } from "@/actions/dashboard";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import DashboardView from "./_components/dashboard-view";

const IndustryInsightsPage = async () => {
  // check if user is already onboarded
  const { isOnboarded } = await getUserOnboardingStatus();
  const insights = await getIndustryInsights();

  if (!isOnboarded) redirect("/onboarding");

  return (
    <div className="container mx-auto">
      <DashboardView insights={insights && insights} />
    </div>
  );
};

export default IndustryInsightsPage;
