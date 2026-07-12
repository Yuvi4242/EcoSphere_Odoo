import PageHeader from '@/app/_components/ui/PageHeader';
import PoliciesClient from './PoliciesClient';

export default function EmployeePoliciesPage() {
  return (
    <div className="font-sans">
      <PageHeader
        eyebrow="Governance · ESG Policies"
        title="ESG Policies"
        subtitle="Review and acknowledge the organization's environmental, social, and governance policies"
        accentColor="gov"
      />
      <PoliciesClient />
    </div>
  );
}
