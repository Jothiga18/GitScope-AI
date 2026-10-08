import { redirect } from 'next/navigation';
/** Entry point for analysis links; the report page performs the actual fetch with its own loading UI. */
export default async function Analyze({ params }: { params: Promise<{ username: string }> }) {
  redirect(`/report/${encodeURIComponent((await params).username)}`);
}
