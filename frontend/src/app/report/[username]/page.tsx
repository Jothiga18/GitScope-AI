import Link from 'next/link';
import { WarningCircle, CheckCircle, Warning, CaretDown } from '@phosphor-icons/react/dist/ssr';
import { fetchReport } from '@/services/analysis-api';
import { ERROR_ACTIONS as ACTION } from '@/lib/constants';
import RoastPanel from '@/components/roast/RoastPanel';
import Actions from '@/components/report/Actions';
import ThemeToggle from '@/components/navigation/ThemeToggle';
import CountUp from '@/components/report/CountUp';
import Reveal from '@/components/report/Reveal';
import ReportReveal from '@/components/analysis/ReportReveal';
export const dynamic = 'force-dynamic';
const LABEL: Record<string, string> = { technicalBreadth: 'Technical Breadth', projectQuality: 'Project Quality', consistency: 'Consistency', documentation: 'Documentation', openSource: 'Open Source Presence', portfolioReadiness: 'Portfolio Readiness', communitySignal: 'Community Signal' };
const WHY: Record<string, string> = { technicalBreadth: 'Distinct languages and domains across original repositories.', projectQuality: 'Descriptions, topics, license, README and stars on top repositories.', consistency: 'Share of repositories and months with pushes in the last year.', documentation: 'Descriptions, licenses, topics and READMEs.', openSource: 'Stars and forks received, plus license use.', portfolioReadiness: 'Profile completeness, showcase quality and recent work.', communitySignal: 'Followers and stars.' };
const Bar = ({ v }: { v: number }) => <div className="bar" role="img" aria-label={`${v} out of 100`}><i style={{ width: `${v}%` }} /></div>;
const S = ({ t, sub, children }: any) => <section className="sec"><Reveal>{t}</Reveal>{sub && <p className="sub">{sub}</p>}{children}</section>;
const List = ({ items }: { items: string[] }) => <ul style={{ margin: '6px 0', paddingLeft: 18, fontSize: 14, color: 'var(--text2)' }}>{items.map((x, i) => <li key={i}>{x}</li>)}</ul>;

export default async function Report({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  let data: any;
  try { data = await fetchReport(decodeURIComponent(username)); }
  catch (e: any) {
    return (<main className="wrap"><header className="nav"><Link href="/" className="serif" style={{ fontSize: 24, textDecoration: 'none' }}>GitScope AI</Link><div className="nav-tools"><ThemeToggle /></div></header><div style={{ padding: '80px 0' }}><WarningCircle size={36} color="var(--error)" /><h1 className="serif" style={{ fontSize: 36, margin: '12px 0' }}>We could not build this report</h1>
      <p>{e.message}</p><p className="note">{ACTION[e.code] || 'Try again in a moment.'}</p><Link className="btn" href="/">Try another username</Link></div></main>);
  }
  const { facts: f, ai, aiError } = data;
  const p = f.profile, s = f.stats;
  return (<div className="wrap"><ReportReveal><header className="nav"><Link href="/" className="serif" style={{ fontSize: 24, textDecoration: 'none' }}>GitScope AI</Link><div className="nav-tools"><ThemeToggle /><Actions /></div></header>
    <main>
      {aiError && <div className="banner" role="alert"><b>AI interpretation unavailable.</b> {aiError.message} Showing the data-driven sections only.</div>}
      <div className="sum"><img src={p.avatar} alt={`${p.username} avatar`} width={96} height={96} />
        <div><p className="eyebrow">EXECUTIVE SUMMARY</p><h1 className="serif" style={{ fontSize: 40 }}>{p.name || p.username}</h1>
          <a href={p.url} className="note">@{p.username}</a>{ai && <p><span className="pill">{ai.archetype.name}</span> <span className="pill">{ai.developerLevel}</span></p>}
          {ai && <p style={{ maxWidth: '62ch' }}>{ai.summary}</p>}</div>
        <div style={{ textAlign: 'center' }}><div className="big serif"><CountUp value={Number(f.overall)} /></div><span className="note">overall, of 100</span></div></div>
      <div className="glance">{[['Repositories', s.repos], ['Stars', s.stars], ['Followers', s.followers], ['Languages', s.languages], ['Account age', `${s.accountYears} yrs`]].map(([l, v]) => <div key={l as string}><b>{v}</b><span>{l}</span></div>)}</div>

      <S t="Developer scorecard" sub="Internal GitScope AI heuristics on observable public signals.">
        <div className="grid">{Object.entries(f.scores).map(([k, v]: any) => <div className="card" key={k}><div className="row"><b>{LABEL[k]}</b><span><CountUp value={Number(v)} /></span></div><Bar v={v} /><p>{WHY[k]}</p></div>)}</div>
        <details style={{ marginTop: 14 }}><summary><CaretDown size={14} /> How is this calculated?</summary><p className="note">Scores are an internal GitScope AI heuristic based on observable public GitHub signals (up to {s.analyzed} recently pushed repositories). They are not an official GitHub score, not recruiter-certified, not industry-certified, and do not predict employability. Overall is the mean of the seven metrics.</p></details></S>

      <S t="Technical DNA" sub="Based only on primary repository languages. Languages shown: those GitHub reports for original repositories.">
        <div className="grid">{f.dna.map((d: any) => <div className="card" key={d.category}><div className="row"><b>{d.category}</b><span>{d.repos} repos</span></div><Bar v={Math.round((d.repos / Math.max(1, s.original)) * 100)} /><p>{d.languages.join(', ')}</p></div>)}</div>
        <p className="note">Primary: {f.languages[0]?.name || 'none observed'}. Secondary: {f.languages.slice(1, 3).map((l: any) => l.name).join(', ') || 'none observed'}. Breadth: {s.languages} languages.</p></S>

      {ai && <S t="Developer archetype" sub="An interpretation of GitHub activity, not a psychological assessment."><div className="card"><h3 className="serif">{ai.archetype.name}</h3><p>{ai.archetype.description}</p><b style={{ fontSize: 14 }}>Evidence</b><List items={ai.archetype.evidence} /><p><b>Potential blind spot:</b> {ai.archetype.blindSpot}</p></div></S>}
      {ai && Object.keys(ai.workingStyle).length > 0 && <S t="Working style" sub="AI interpretation of public GitHub activity."><div className="grid">{Object.entries(ai.workingStyle).map(([k, v]: any) => <div className="card" key={k}><div className="row"><span>{k}</span><span>{v}</span></div><Bar v={v} /></div>)}</div></S>}

      <S t="Repository intelligence" sub="Maturity is a GitScope classification from available evidence, not official GitHub data.">
        <p className="note">{Object.entries(f.maturityCounts).map(([k, v]) => `${k}: ${v}`).join(' | ')} | Original vs forks: {s.original} / {s.forks}</p>
        <div className="scroll"><table><thead><tr><th>Repository</th><th>Language</th><th>Stars</th><th>Maturity</th><th>Evidence</th></tr></thead><tbody>
          {f.repos.slice(0, 12).map((r: any) => <tr key={r.name}><td><a href={r.url}>{r.name}</a></td><td>{r.language || '-'}</td><td>{r.stars}</td><td>{r.maturity}</td><td>{r.why}</td></tr>)}</tbody></table></div></S>

      <S t="Project showcase" sub="Weighted by stars, forks, recency, documentation, description and completeness.">
        <div className="grid">{f.showcase.map((r: any, i: number) => <div className="card" key={r.name}><span className="pill">{['Top project', 'Second project', 'Third project'][i]}</span><h3 className="serif"><a href={r.url}>{r.name}</a></h3><p>{r.description || 'No description.'}</p><p>Why it stands out: {r.reasons.join(', ') || 'limited signals available'}.</p>
          <p><b>README advisor:</b> {r.missing.length ? `consider adding ${r.missing.join(', ')}. ` : 'basics are present. '}Suggested structure: overview, screenshot or demo, install, usage, configuration, contributing, license.</p></div>)}</div></S>

      <S t="Portfolio readiness"><div className="card"><div className="row"><b>Portfolio Readiness Score</b><span><CountUp value={Number(f.scores.portfolioReadiness)} /></span></div><Bar v={f.scores.portfolioReadiness} /><p>Combines profile completeness (name, bio, website, location, company), showcase quality and recent activity.</p></div></S>
      <S t="Profile hygiene"><div className="grid">{f.hygiene.map((h: any, i: number) => <div className="card" key={i}><b className={h.level}>{h.level === 'good' ? <CheckCircle size={16} /> : <Warning size={16} />} {h.level === 'good' ? 'Good' : h.level === 'attention' ? 'Needs attention' : 'Priority fix'}</b><p>{h.text}</p></div>)}</div></S>

      {ai && <>
        <S t="If a recruiter opened this profile..." sub="An AI-assisted interpretation of the public profile, not a real recruiter's view."><div className="card"><p>{ai.recruiterView.firstImpression}</p>
          <b>What stands out</b><List items={ai.recruiterView.standsOut} /><b>What raises questions</b><List items={ai.recruiterView.raisesQuestions} /><b>What to improve</b><List items={ai.recruiterView.improve} /></div></S>
        <S t="Career opportunities"><List items={ai.careerInsights} /><p className="note">Directional observations only; no outcome is guaranteed.</p></S>
        <S t="30-day roadmap"><div className="grid">{ai.roadmap.map((w: any) => <div className="card" key={w.week}><h3 className="serif">Week {w.week}: {w.focus}</h3><List items={w.tasks} /></div>)}</div></S>
        <S t="Project ideas"><div className="grid">{ai.projectIdeas.map((x: any) => <div className="card" key={x.title}><h3 className="serif">{x.title}</h3><p>{x.why}</p><p><b>Tech:</b> {x.tech.join(', ')}</p><p><b>Difficulty:</b> {x.difficulty}</p><p><b>Portfolio value:</b> {x.portfolioValue}</p><p><b>Differentiator:</b> {x.differentiator}</p></div>)}</div></S>
        <S t="Interview preparation"><b>Topics to strengthen</b><List items={ai.interviewTopics} /><b>Questions based on your repositories</b><List items={ai.interviewQuestions} /></S></>}

      <S t="The GitScope Roast" sub="Humor based on public GitHub data only."><RoastPanel username={p.username} /></S>
    </main>
    <footer className="note" style={{ padding: '24px 0 48px' }}>GitScope AI analyzes publicly available GitHub signals. Scores and interpretations are heuristic and should not be treated as definitive assessments of a developer's ability, personality, or career potential.    </footer></ReportReveal></div>);
}
