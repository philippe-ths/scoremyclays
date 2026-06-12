/* global React, Button, Card, Segmented, Chip, StatTile, TopBar, TabBar, CircularStat, PhotoHeader, RoundRow, Activity */
const { useState } = React;

/* ============== Screens ============== */

function HomeScreen({ onStart, onResume, onRound }) {
  return (
    <React.Fragment>
      <TopBar title="Score My Clays" action="Hi, Ian" />
      <div className="section" style={{paddingTop:8}}>
        <div style={{fontSize:14,color:'var(--fg-2)',marginBottom:16}}>Track your shooting</div>
        <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:24}}>
          <Button variant="primary" size="lg" full onClick={onStart}>Start New Round</Button>
          <Button variant="secondary" size="lg" full onClick={onResume}>Continue Last Session</Button>
        </div>
        <div className="section__eyebrow">Recent Rounds</div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <RoundRow ground="West Kent SS" meta="Yesterday · Sporting" score="39/50" percent={78} onClick={onRound}/>
          <RoundRow ground="JJ's Clay Shooting" meta="3 days ago · Sporting" score="36/50" percent={72} onClick={onRound}/>
          <RoundRow ground="West Kent SS" meta="28 Feb · Sporting" score="42/50" percent={84} onClick={onRound}/>
        </div>
      </div>
    </React.Fragment>
  );
}

function RoundSetupScreen({ onBack, onStart }) {
  const [discipline, setDiscipline] = useState("Sporting");
  const [stands, setStands] = useState("10");
  return (
    <React.Fragment>
      <TopBar title="New Round" onBack={onBack} />
      <div className="section" style={{paddingTop:12}}>

        <div className="section__eyebrow">Shooting Ground</div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 16px',background:'var(--bone-0)',border:'1px solid var(--border-2)',borderRadius:12,fontSize:15,marginBottom:20}}>
          West Kent Shooting School
          <span style={{color:'var(--fg-3)'}}>▼</span>
        </div>

        <div className="section__eyebrow">Discipline</div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:20}}>
          {["Sporting","Trap","Skeet","FITASC"].map(d => (
            <Chip key={d} active={d===discipline} onClick={()=>setDiscipline(d)}>{d}</Chip>
          ))}
        </div>

        <div className="section__eyebrow">Shooters</div>
        <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:20}}>
          <div style={{display:'flex',alignItems:'center',gap:10,padding:'12px 14px',background:'var(--bone-0)',border:'1px solid var(--border-1)',borderRadius:12}}>
            <div style={{width:32,height:32,borderRadius:'50%',background:'var(--field-200)'}}></div>
            <div style={{flex:1,fontSize:14,fontWeight:500}}>You (Ian Marr)</div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:10,padding:'12px 14px',background:'var(--bone-0)',border:'1px solid var(--border-1)',borderRadius:12}}>
            <div style={{width:32,height:32,borderRadius:'50%',background:'var(--clay-200)'}}></div>
            <div style={{flex:1,fontSize:14,fontWeight:500}}>Steve Cox</div>
            <span style={{color:'var(--fg-3)',cursor:'pointer'}}>×</span>
          </div>
          <div style={{fontSize:13,fontWeight:600,color:'var(--field-700)',padding:'10px 2px',cursor:'pointer'}}>+ Add Shooter</div>
        </div>

        <div className="section__eyebrow">Number of Stands</div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:32}}>
          {["5","10","15","Custom"].map(s => (
            <Chip key={s} active={s===stands} onClick={()=>setStands(s)}>{s}</Chip>
          ))}
        </div>

        <Button variant="primary" size="lg" full onClick={onStart}>Start Scoring</Button>
      </div>
    </React.Fragment>
  );
}

function ScoringScreen({ onExit }) {
  const [hits, setHits] = useState(23);
  const [total, setTotal] = useState(30);
  const score = (n) => {
    if (total >= 30) return;
    if (n === "hit") setHits(hits+1);
    setTotal(total+1);
  };
  const pct = total ? Math.round((hits/total)*100) : 0;
  return (
    <div className="scoring">
      <div className="scoring__statusbar">
        <span>9:41</span>
        <span className="scoring__offline">● Offline Ready</span>
      </div>
      <div className="scoring__subtitle">Stand 3 of 10</div>
      <div className="scoring__title">The Tower</div>
      <div className="scoring__big">
        <div style={{fontSize:13,color:'var(--bone-400)',letterSpacing:'0.1em',textTransform:'uppercase',fontWeight:700,marginBottom:8}}>Current Score</div>
        <div className="scoring__score">{hits}</div>
        <div className="scoring__scoremeta">of {total} shots · {pct}%</div>
      </div>
      <div className="scoring__buttons">
        <button className="scoring__btn scoring__btn--hit" onClick={()=>score("hit")}>HIT</button>
        <button className="scoring__btn scoring__btn--miss" onClick={()=>score("miss")}>MISS</button>
        <button className="scoring__btn scoring__btn--nobird" onClick={()=>score("nobird")}>No Bird</button>
      </div>
      <div className="scoring__footer">
        <span onClick={()=>{setHits(Math.max(0,hits-1));setTotal(Math.max(0,total-1));}}>Undo</span>
        <span>Pause</span>
        <span onClick={onExit}>Card</span>
      </div>
    </div>
  );
}

function ScorecardScreen({ onBack }) {
  const [view, setView] = useState("By Stand");
  return (
    <React.Fragment>
      <TopBar title="Scorecard" onBack={onBack} action="Share"/>
      <PhotoHeader eyebrow="2 Mar 2026 · Sporting" title="West Kent Shooting School" />
      <div className="section" style={{paddingTop:16,marginTop:-48,position:'relative',zIndex:1}}>
        <Card padded style={{textAlign:'center',marginBottom:20}}>
          <div style={{fontSize:12,fontWeight:700,color:'var(--clay-600)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:6}}>Round Complete</div>
          <div className="big-number">78<span className="big-number__unit">%</span></div>
          <div style={{fontFamily:'var(--font-mono)',fontSize:18,color:'var(--fg-2)',marginTop:8,fontWeight:600}}>39 / 50</div>
          <div style={{fontSize:13,color:'var(--fg-3)',marginTop:8}}>Personal Best: <strong style={{color:'var(--clay-600)'}}>42 / 50</strong></div>
        </Card>

        <div style={{marginBottom:14}}>
          <Segmented items={["By Stand","By Shot","Compare"]} value={view} onChange={setView}/>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          {[["Stand 1",4,5],["Stand 2",5,5],["Stand 3",3,5],["Stand 4",4,5],["Stand 5",5,5],["Stand 6",3,5],["Stand 7",4,5],["Stand 8",5,5],["Stand 9",3,5],["Stand 10",3,5]].map(([n,h,t],i) => (
            <div key={i} style={{padding:'14px 12px',background:'var(--bone-0)',border:'1px solid var(--border-1)',borderRadius:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:13,fontWeight:600,color:'var(--fg-2)'}}>{n}</span>
              <span style={{fontFamily:'var(--font-mono)',fontSize:15,fontWeight:700,color: h>=4 ? 'var(--field-700)':'var(--clay-600)'}}>{h}/{t}</span>
            </div>
          ))}
        </div>

        <div style={{display:'flex',gap:10,marginTop:24}}>
          <Button variant="secondary" full>Save</Button>
          <Button variant="primary" full>Share</Button>
        </div>
      </div>
    </React.Fragment>
  );
}

function StatsScreen() {
  return (
    <React.Fragment>
      <TopBar title="Your Statistics" action="Last 30d" />
      <div className="section" style={{paddingTop:12}}>

        <Card padded style={{textAlign:'center',marginBottom:16}}>
          <CircularStat value={74} size={180} label="HIT RATE"/>
          <div style={{display:'flex',justifyContent:'space-around',marginTop:18}}>
            <div><div style={{fontFamily:'var(--font-mono)',fontSize:22,fontWeight:700}}>12</div><div style={{fontSize:11,color:'var(--fg-3)',marginTop:2,letterSpacing:'0.08em',textTransform:'uppercase'}}>Rounds</div></div>
            <div><div style={{fontFamily:'var(--font-mono)',fontSize:22,fontWeight:700,color:'var(--positive)'}}>+3%</div><div style={{fontSize:11,color:'var(--fg-3)',marginTop:2,letterSpacing:'0.08em',textTransform:'uppercase'}}>vs Last Mo.</div></div>
            <div><div style={{fontFamily:'var(--font-mono)',fontSize:22,fontWeight:700}}>42</div><div style={{fontSize:11,color:'var(--fg-3)',marginTop:2,letterSpacing:'0.08em',textTransform:'uppercase'}}>Best</div></div>
          </div>
        </Card>

        <div className="section__eyebrow" style={{marginTop:8}}>Quick Insights</div>
        <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:24}}>
          <div style={{display:'flex',alignItems:'center',gap:12,padding:14,background:'var(--field-50)',border:'1px solid var(--field-200)',borderRadius:12}}>
            <div style={{width:36,height:36,borderRadius:'50%',background:'var(--field-700)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:18}}>↑</div>
            <div style={{flex:1,fontSize:14}}><strong>Best at: Teal</strong><div style={{fontSize:12,color:'var(--fg-3)',marginTop:2}}>+12% vs your average</div></div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:12,padding:14,background:'#fdf2f0',border:'1px solid #f7ccc7',borderRadius:12}}>
            <div style={{width:36,height:36,borderRadius:'50%',background:'var(--miss)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:18}}>↓</div>
            <div style={{flex:1,fontSize:14}}><strong>Needs work: Rabbit</strong><div style={{fontSize:12,color:'var(--fg-3)',marginTop:2}}>−8% vs your average</div></div>
          </div>
        </div>

        <div className="section__eyebrow">Performance Breakdown</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <StatTile value="82" unit="%" label="Teal" />
          <StatTile value="79" unit="%" label="Driven" />
          <StatTile value="58" unit="%" label="Rabbit" />
          <StatTile value="65" unit="%" label="Quartering" />
        </div>
      </div>
    </React.Fragment>
  );
}

function SocialScreen() {
  return (
    <React.Fragment>
      <TopBar title="Activity" action="Friends"/>
      <div className="section" style={{paddingTop:12,display:'flex',flexDirection:'column',gap:12}}>

        <div style={{display:'flex',gap:12,padding:'14px 16px',background:'var(--bone-0)',border:'1px solid var(--border-1)',borderRadius:16,alignItems:'center'}}>
          <div style={{display:'flex',gap:-8}}>
            <div style={{width:32,height:32,borderRadius:'50%',background:'var(--clay-400)',border:'2px solid var(--bone-0)'}}></div>
            <div style={{width:32,height:32,borderRadius:'50%',background:'var(--field-500)',border:'2px solid var(--bone-0)',marginLeft:-10}}></div>
            <div style={{width:32,height:32,borderRadius:'50%',background:'var(--bone-500)',border:'2px solid var(--bone-0)',marginLeft:-10}}></div>
          </div>
          <div style={{flex:1,fontSize:13}}>
            <div><strong>Steve</strong> <span className="livedot"></span> <span style={{color:'var(--live)',fontWeight:600,fontSize:12}}>Live</span> · <strong>David</strong> <span className="livedot"></span></div>
            <div style={{color:'var(--fg-3)',marginTop:2}}>2 friends shooting now</div>
          </div>
        </div>

        <Activity initials="SC" name="Steve Cox" time="Just now · West Kent SS" text="40/50 · 80% — Great session in the sun. Finally nailed that rising teal on Stand 7!"/>
        <Activity initials="DW" name="David Austin-White" time="2 hours ago" text="🏆 Just earned the 'Century Club' badge — 100 rounds logged!"/>
        <Activity initials="IM" name="Ian Marr" time="Yesterday · West Kent SS" text="Shot a new PB at West Kent! 42/50 🎯"/>
      </div>
    </React.Fragment>
  );
}

function ProfileScreen() {
  return (
    <React.Fragment>
      <PhotoHeader eyebrow="Member · West Kent Shooting School" title="Ian Marr" height={220}/>
      <div className="section" style={{paddingTop:18,marginTop:-28,position:'relative',zIndex:1}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:16}}>
          <StatTile value="74" unit="%" label="Avg"/>
          <StatTile value="156" label="Rounds"/>
          <StatTile value="23" label="Friends"/>
        </div>
        <div style={{display:'flex',gap:10,marginBottom:24}}>
          <Button variant="primary" full>Add Friend</Button>
          <Button variant="secondary" full>Challenge</Button>
        </div>
        <div className="section__eyebrow">Leaderboard · Friends</div>
        <div style={{background:'var(--bone-0)',border:'1px solid var(--border-1)',borderRadius:16,overflow:'hidden'}}>
          {[
            { rank:1, name:"David Austin-White", pct:82, medal:'var(--medal-gold)', ground:"West Kent SS" },
            { rank:2, name:"Ian Marr", pct:74, medal:'var(--medal-silver)', ground:"West Kent SS", you:true },
            { rank:3, name:"Steve Cox", pct:71, medal:'var(--medal-bronze)', ground:"JJ's Clay" },
            { rank:4, name:"Lewis Cox", pct:68, medal:'var(--bone-300)', ground:"JJ's Clay" },
          ].map(r => (
            <div key={r.rank} style={{display:'flex',alignItems:'center',padding:'14px 14px',gap:12,borderBottom:'1px solid var(--border-1)',background:r.you?'var(--field-50)':'transparent'}}>
              <div style={{width:28,height:28,borderRadius:'50%',background:r.medal,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:12,fontFamily:'var(--font-mono)'}}>{r.rank}</div>
              <div style={{width:36,height:36,borderRadius:'50%',background:'var(--bone-200)'}}></div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:600}}>{r.name}{r.you && <span style={{fontSize:10,color:'var(--field-700)',fontWeight:700,background:'var(--field-100)',padding:'2px 6px',borderRadius:999,marginLeft:6}}>YOU</span>}</div>
                <div style={{fontSize:12,color:'var(--fg-3)'}}>{r.ground}</div>
              </div>
              <div style={{fontFamily:'var(--font-mono)',fontSize:18,fontWeight:700,color:r.you?'var(--field-700)':'var(--fg-2)'}}>{r.pct}%</div>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { HomeScreen, RoundSetupScreen, ScoringScreen, ScorecardScreen, StatsScreen, SocialScreen, ProfileScreen });
