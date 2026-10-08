import Link from 'next/link';
import { compareDevelopers } from '@/services/comparison-api';
import { ERROR_ACTIONS } from '@/lib/constants';
import { fmt } from '@/lib/utils';
import ThemeToggle from '@/components/navigation/ThemeToggle';
import RadarChart from '@/components/charts/RadarChart';
export const dynamic = 'force-dynamic';
export default async function Compare({ searchParams }: { searchParams: Promise<{ first?: string; second?: string }> }) {
  const { first = '', second = '' } = await searchParams;
  let data: Awaited<ReturnType<typeof compareDevelopers>> | null = null, error: any = null;
  if (first && second) { try { data = await compareDevelopers(first, second); } catch (e: any) { error = e; } }
  return (<div className="wrap"><header className="nav"><Link href="/" className="serif" style={{ fontSize: 24, textDecoration: 'none' }}>GitScope AI</Link><div className="nav-tools"><ThemeToggle /></div></header>
    <main className="py-10">
      <h1 className="serif text-4xl">Compare developers</h1>
      <p className="sub">Profile comparison of observable public GitHub signals.</p>
      <form action="/compare" method="get" className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] max-w-3xl">
        <input className="search" style={{ padding: 12 }} name="first" defaultValue={first} placeholder="First username" aria-label="First GitHub username" required />
        <input className="search" style={{ padding: 12 }} name="second" defaultValue={second} placeholder="Second username" aria-label="Second GitHub username" required />
        <button className="btn" type="submit">Compare</button></form>
      {error && <div className="banner mt-6" role="alert"><b>{error.message}</b> {ERROR_ACTIONS[error.code] || 'Try again shortly.'}</div>}
      {data && <section className="mt-8"><div className="grid grid-cols-3 gap-3 items-center mb-4">
        <span />{[data.first, data.second].map((f) => <div key={f.profile.username} className="text-center"><img src={f.profile.avatar} alt="" width={56} height={56} className="mx-auto rounded-full" /><b>@{f.profile.username}</b></div>)}</div>
        <div className="scroll"><table><tbody>{data.metrics.map((m) => <tr key={m.label}><th scope="row">{m.label}</th><td>{fmt(m.first)}</td><td>{fmt(m.second)}</td></tr>)}
          <tr><th scope="row">Top languages</th>{[data.first, data.second].map((f) => <td key={f.profile.username}>{f.languages.slice(0, 4).map((l) => l.name).join(', ') || '-'}</td>)}</tr></tbody></table></div>
        <p className="note">{data.note}</p>
        <section className="profile-shape"><h2 className="serif">Profile shape</h2><RadarChart
          axes={[
            { label: 'Technical Breadth', firstValue: data.first.scores.technicalBreadth, secondValue: data.second.scores.technicalBreadth },
            { label: 'Project Quality', firstValue: data.first.scores.projectQuality, secondValue: data.second.scores.projectQuality },
            { label: 'Consistency', firstValue: data.first.scores.consistency, secondValue: data.second.scores.consistency },
            { label: 'Documentation', firstValue: data.first.scores.documentation, secondValue: data.second.scores.documentation },
            { label: 'Open Source', firstValue: data.first.scores.openSource, secondValue: data.second.scores.openSource },
            { label: 'Portfolio Readiness', firstValue: data.first.scores.portfolioReadiness, secondValue: data.second.scores.portfolioReadiness },
            { label: 'Community Signal', firstValue: data.first.scores.communitySignal, secondValue: data.second.scores.communitySignal },
          ]}
          firstName={data.first.profile.username}
          secondName={data.second.profile.username}
          caption="Radar shows GitScope heuristic scores (0-100) from observable public GitHub signals. It compares profile shape, not developer ability."
        /></section></section>}
    </main></div>);
}
