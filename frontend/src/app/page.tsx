import { Fingerprint, Heartbeat, Stack, ChartLineUp, Medal } from '@phosphor-icons/react/dist/ssr';
import SearchForm from '@/components/landing/SearchForm';
import ThemeToggle from '@/components/navigation/ThemeToggle';
const tags = [['Developer identity', Fingerprint, '4%', '8%', '0s'], ['Repository health', Heartbeat, '66%', '2%', '.8s'], ['Technical breadth', Stack, '0%', '48%', '1.6s'], ['Activity pattern', ChartLineUp, '62%', '78%', '2.4s'], ['Portfolio strength', Medal, '6%', '88%', '3.2s']] as const;
export default function Home() {
  return (<div className="wrap">
    <header className="nav"><b className="serif" style={{ fontSize: 24 }}>GitScope AI</b>
      <nav aria-label="Primary"><a href="#how">How it works</a><a href="/compare">Compare</a><a href="#analyze">Analyze</a></nav>
      <div className="nav-tools"><ThemeToggle /><a className="btn sm" href="#analyze">Analyze profile</a></div></header>
    <main><div className="hero"><div>
      <p className="eyebrow hero-entrance hero-entrance-1">DEVELOPER INTELLIGENCE ENGINE</p>
      <h1 className="serif hero-entrance hero-entrance-2" style={{ margin: '14px 0' }}>Your GitHub is telling a story. We make it readable.</h1>
      <p className="lede hero-entrance hero-entrance-3">GitScope AI turns your public GitHub activity into a clear picture of your technical strengths, project quality, developer habits, and career opportunities.</p>
      <div className="hero-entrance hero-entrance-4"><SearchForm /></div></div>
      <div className="orbit" aria-hidden="true"><div className="ring" /><div className="core serif">@</div>
        {tags.map(([t, I, l, tp, d]) => <span className="tag" key={t} style={{ left: l, top: tp, animationDelay: d }}><I size={16} />{t}</span>)}</div></div>
    <div className="strip"><span>PUBLIC DATA</span><span>AI ANALYSIS</span><span>REPOSITORY INTELLIGENCE</span><span>CAREER INSIGHTS</span></div>
    <section className="steps" id="how" aria-label="How it works">
      {[['01', 'Find', "Retrieve the developer's public GitHub profile and repositories."], ['02', 'Understand', 'Normalize repository, language, activity and contribution information.'], ['03', 'Interpret', 'AI identifies meaningful patterns.'], ['04', 'Report', 'Generate a structured developer intelligence report.']].map(([n, t, d]) => <div key={n}><b className="serif">{n}</b><h3 className="serif">{t}</h3><p>{d}</p></div>)}</section>
    <section className="sec"><h2 className="serif">What the report covers</h2><p className="sub">Scorecard, technical DNA, archetype, working style, repository maturity, project showcase, portfolio readiness, profile hygiene, recruiter view, 30-day roadmap, project ideas, interview preparation and a roast.</p></section></main>
    <footer className="note" style={{ padding: '24px 0 48px' }}>GitScope AI analyzes publicly available GitHub signals. Scores and interpretations are heuristic and should not be treated as definitive assessments of a developer's ability, personality, or career potential.</footer></div>);
}
