// ============================================================
// ZOOM! BLACK JET — render
// ============================================================

function fmt1(n) { return n.toFixed(1); }
function fmt2(n) { return n.toFixed(2); }
function signed(n) { return (n >= 0 ? "+" : "") + n.toFixed(2); }

function renderHeader() {
  const wk = latestWeek();
  document.getElementById("weekLabel").textContent = wk
    ? `Through Week ${wk} of ${REGULAR_SEASON_WEEKS}`
    : "Preseason";
  document.getElementById("footWeek").textContent = wk || "0";
  document.getElementById("leagueMeta").textContent = `${TEAMS.length} teams · Top ${PLAYOFF_TEAMS} make the playoffs`;
}

function renderLadder() {
  const rows = standings();
  const currentWeek = latestWeek();
  const prevRanks = currentWeek > 1 ? powerRankAsOfWeek(currentWeek - 1) : null;

  const list = document.getElementById("ladderList");
  list.innerHTML = "";

  [...rows].sort((a, b) => a.powerRank - b.powerRank).forEach(r => {
    const li = document.createElement("li");
    li.className = "ladder__row" + (r.powerRank === 1 ? " ladder__row--top1" : "");

    let changeHtml = `<div class="ladder__change ladder__change--flat">preseason</div>`;
    if (prevRanks) {
      const prev = prevRanks[r.team];
      const delta = prev - r.powerRank;
      if (delta > 0) changeHtml = `<div class="ladder__change ladder__change--up">↑ ${delta} from last wk</div>`;
      else if (delta < 0) changeHtml = `<div class="ladder__change ladder__change--down">↓ ${-delta} from last wk</div>`;
      else changeHtml = `<div class="ladder__change ladder__change--flat">— no change</div>`;
    }

    li.innerHTML = `
      <div class="ladder__rank">${r.powerRank}</div>
      <div>
        <div class="ladder__team">${r.team}</div>
      </div>
      <div class="ladder__record">${r.wins}-${r.losses}</div>
      <div class="ladder__meta">
        <div class="ladder__score">${fmt2(r.power)}</div>
        ${changeHtml}
      </div>
    `;
    list.appendChild(li);
  });
}

const TEAM_STORAGE_KEY = "zbj_selected_team";

function getSelectedTeam() {
  try {
    const saved = localStorage.getItem(TEAM_STORAGE_KEY);
    if (saved && TEAMS.includes(saved)) return saved;
  } catch (e) { /* storage unavailable */ }
  return TEAMS[0];
}

function setSelectedTeam(team) {
  try { localStorage.setItem(TEAM_STORAGE_KEY, team); } catch (e) { /* ignore */ }
}

function renderTeamPills() {
  const container = document.getElementById("teamPills");
  container.innerHTML = "";
  const selected = getSelectedTeam();
  TEAMS.forEach(team => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "team-pill" + (team === selected ? " team-pill--active" : "");
    btn.textContent = team;
    btn.addEventListener("click", () => {
      setSelectedTeam(team);
      renderTeamPills();
      renderTeamRecap(window.__seasonSim);
      renderPowerHistoryChart();
    });
    container.appendChild(btn);
  });
}

function buildRecapSentences(r) {
  const { team, result, priorAvg, vsOwnAvg, weekRank, streak, powerRankDelta, me, next, odds } = r;
  const sentences = [];

  // Result
  const winner = result.won ? team : result.opponent;
  const loser = result.won ? result.opponent : team;
  const winScore = Math.max(result.myScore, result.oppScore);
  const loseScore = Math.min(result.myScore, result.oppScore);
  if (result.won) {
    if (result.margin > 30) sentences.push(`${team} ran away with it, beating ${result.opponent} ${fmt2(winScore)}–${fmt2(loseScore)}.`);
    else if (result.margin < 6) sentences.push(`${team} survived a nail-biter over ${result.opponent}, ${fmt2(winScore)}–${fmt2(loseScore)}.`);
    else sentences.push(`${team} beat ${result.opponent}, ${fmt2(winScore)}–${fmt2(loseScore)}.`);
  } else {
    if (result.margin > 30) sentences.push(`${team} had a rough one, falling to ${result.opponent} ${fmt2(winScore)}–${fmt2(loseScore)}.`);
    else if (result.margin < 6) sentences.push(`${team} fell just short against ${result.opponent}, ${fmt2(winScore)}–${fmt2(loseScore)}.`);
    else sentences.push(`${team} lost to ${result.opponent}, ${fmt2(winScore)}–${fmt2(loseScore)}.`);
  }

  // Streak
  if (streak.count >= 2) {
    sentences.push(streak.type === "W" ? `That's ${streak.count} straight wins.` : `That's ${streak.count} straight losses.`);
  }

  // Vs own average
  if (vsOwnAvg !== null) {
    if (vsOwnAvg > 10) sentences.push(`It's well above their season average of ${fmt2(priorAvg)}.`);
    else if (vsOwnAvg < -10) sentences.push(`That's a step down from their season average of ${fmt2(priorAvg)}.`);
  }

  // Week rank
  sentences.push(`It was the ${ordinal(weekRank)} highest score in the league this week.`);

  // Power ranking movement
  if (powerRankDelta === null) sentences.push(`${team} sit at #${me.powerRank} in the power rankings.`);
  else if (powerRankDelta > 0) sentences.push(`${team} climbed to #${me.powerRank} in the power rankings, up ${powerRankDelta} spot${powerRankDelta > 1 ? "s" : ""}.`);
  else if (powerRankDelta < 0) sentences.push(`${team} slid to #${me.powerRank} in the power rankings, down ${-powerRankDelta} spot${powerRankDelta < -1 ? "s" : ""}.`);
  else sentences.push(`${team} holds at #${me.powerRank} in the power rankings.`);

  // Luck
  if (me.luck > 3) sentences.push(`Their luck score of ${signed(me.luck)} says the schedule has been kind so far.`);
  else if (me.luck < -3) sentences.push(`Their luck score of ${signed(me.luck)} suggests some tough breaks — better results may be on the way.`);

  // Next week / odds
  if (next) {
    const line = next.meFavored
      ? `Next up: ${next.opponent} in Week ${next.week}, and the projections favor ${team} by ${fmt1(next.spread)}.`
      : `Next up: ${next.opponent} in Week ${next.week}, and the projections favor ${next.opponent} by ${fmt1(next.spread)}.`;
    sentences.push(line);
  }
  if (odds) {
    sentences.push(`Playoff odds: ${toAmericanOdds(odds.playoffPct)} (${(odds.playoffPct * 100).toFixed(1)}% to make the top ${PLAYOFF_TEAMS}).`);
  }

  // MVP / Bust of the week
  const mb = teamMVPBust(team, r.week);
  if (mb && mb.mvp) {
    sentences.push(`${mb.mvp.n} carried the roster with ${fmt2(mb.mvp.pts)} points.`);
  }
  if (mb && mb.bust) {
    sentences.push(`${mb.bust.n} was the one who let them down, scoring ${fmt2(mb.bust.pts)} against a ${fmt1(mb.bust.proj)}-point projection.`);
  }

  return sentences;
}

function renderTeamRecap(seasonSim) {
  const team = getSelectedTeam();
  const week = latestWeek();
  const body = document.getElementById("teamRecapBody");
  const recap = getTeamRecap(team, week, seasonSim);

  if (!recap) {
    body.innerHTML = `<p class="block__note">No games played yet for ${team}.</p>`;
    return;
  }

  const sentences = buildRecapSentences(recap);
  const prose = sentences.join(" ");
  const mb = teamMVPBust(team, week);

  let spotlightHtml = "";
  if (mb && (mb.mvp || mb.bust)) {
    spotlightHtml = `<div class="player-spotlights">`;
    if (mb.mvp) {
      spotlightHtml += `
        <div class="player-spotlight player-spotlight--mvp">
          <div class="player-spotlight__tag">MVP</div>
          <div class="player-spotlight__name">${mb.mvp.n}</div>
          <div class="player-spotlight__detail">${fmt2(mb.mvp.pts)} pts${typeof mb.mvp.proj === "number" ? ` · proj ${fmt1(mb.mvp.proj)}` : ""}</div>
        </div>`;
    }
    if (mb.bust) {
      spotlightHtml += `
        <div class="player-spotlight player-spotlight--bust">
          <div class="player-spotlight__tag">BUST</div>
          <div class="player-spotlight__name">${mb.bust.n}</div>
          <div class="player-spotlight__detail">${fmt2(mb.bust.pts)} pts · proj ${fmt1(mb.bust.proj)}</div>
        </div>`;
    }
    spotlightHtml += `</div>`;
  }

  body.innerHTML = `
    <p class="team-recap__prose">${prose}</p>
    ${recap.personalHighlight ? `<p class="team-recap__highlight">${recap.personalHighlight}</p>` : ""}
    ${spotlightHtml}
    <div class="stat-chips">
      <div class="stat-chip"><div class="stat-chip__label">Record</div><div class="stat-chip__value">${recap.me.wins}-${recap.me.losses}</div></div>
      <div class="stat-chip"><div class="stat-chip__label">Power Score</div><div class="stat-chip__value">${fmt2(recap.me.power)}</div></div>
      <div class="stat-chip"><div class="stat-chip__label">Power Rank</div><div class="stat-chip__value">#${recap.me.powerRank}</div></div>
      <div class="stat-chip"><div class="stat-chip__label">Luck Score</div><div class="stat-chip__value ${recap.me.luck > 0 ? "luck-pos" : recap.me.luck < 0 ? "luck-neg" : ""}">${signed(recap.me.luck)}</div></div>
    </div>
  `;
}

function renderMoversTicker() {
  const week = latestWeek();
  const container = document.getElementById("moversTicker");
  const movers = weekMovers(week);
  if (!movers || (!movers.riser && !movers.faller)) {
    container.innerHTML = "";
    return;
  }
  const parts = [];
  if (movers.riser) {
    parts.push(`<div class="movers-ticker__item">📈 Biggest riser: <strong>${movers.riser.team}</strong> <span class="movers-ticker__up">+${movers.riser.delta}</span></div>`);
  }
  if (movers.faller) {
    parts.push(`<div class="movers-ticker__item">📉 Biggest faller: <strong>${movers.faller.team}</strong> <span class="movers-ticker__down">${movers.faller.delta}</span></div>`);
  }
  container.innerHTML = `<div class="movers-ticker">${parts.join("")}</div>`;
}

function renderPowerHistoryChart() {
  const container = document.getElementById("trendChart");
  const weeks = playedWeeks();
  const selected = getSelectedTeam();

  if (weeks.length < 1) {
    container.innerHTML = `<p class="block__note">Nothing to chart yet.</p>`;
    return;
  }

  const histories = {};
  TEAMS.forEach(t => (histories[t] = powerScoreHistory(t)));

  const width = 720, height = 260;
  const padL = 36, padR = 90, padT = 16, padB = 28;
  const plotW = width - padL - padR, plotH = height - padT - padB;

  const allPowers = TEAMS.flatMap(t => histories[t].map(p => p.power));
  const minP = Math.min(...allPowers) - 8;
  const maxP = Math.max(...allPowers) + 8;

  const xFor = w => padL + (weeks.length === 1 ? plotW / 2 : ((w - weeks[0]) / (weeks[weeks.length - 1] - weeks[0])) * plotW);
  const yFor = p => padT + plotH - ((p - minP) / (maxP - minP)) * plotH;

  let svg = `<svg class="trend-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Power score trends by team">`;

  // gridlines
  [minP, (minP + maxP) / 2, maxP].forEach(v => {
    const y = yFor(v);
    svg += `<line class="grid-line" x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}" />`;
    svg += `<text x="${padL - 8}" y="${y + 3}" text-anchor="end">${v.toFixed(0)}</text>`;
  });
  weeks.forEach(w => {
    svg += `<text x="${xFor(w)}" y="${height - 8}" text-anchor="middle">Wk${w}</text>`;
  });

  // non-selected lines first, selected line drawn last (on top)
  const order = TEAMS.filter(t => t !== selected).concat([selected]);
  order.forEach(team => {
    const pts = histories[team].map(p => `${xFor(p.week)},${yFor(p.power)}`).join(" ");
    const isActive = team === selected;
    if (histories[team].length === 1) {
      const p = histories[team][0];
      svg += `<circle class="${isActive ? "team-dot" : ""}" cx="${xFor(p.week)}" cy="${yFor(p.power)}" r="${isActive ? 4 : 2.5}" fill="${isActive ? "" : "#3A4658"}" opacity="${isActive ? 1 : 0.55}" />`;
    } else {
      svg += `<polyline class="team-line${isActive ? " team-line--active" : ""}" points="${pts}" />`;
    }
    if (isActive) {
      const last = histories[team][histories[team].length - 1];
      svg += `<text class="team-label" x="${xFor(last.week) + 6}" y="${yFor(last.power) + 3}">${team}</text>`;
    }
  });

  svg += `</svg>`;
  container.innerHTML = `<div class="trend-chart-wrap">${svg}</div>`;
}

function renderAllPlay() {
  const week = latestWeek();
  const rows = TEAMS.map(t => ({ team: t, ...allPlayRecord(t, week) }));
  rows.sort((a, b) => b.pct - a.pct);
  const table = document.getElementById("allPlayTable");
  table.innerHTML = "";
  rows.forEach(r => {
    const row = document.createElement("div");
    row.className = "odds-row";
    row.innerHTML = `
      <div class="odds-row__team">${r.team}</div>
      <div class="odds-row__odds">${r.wins}-${r.losses}</div>
      <div class="odds-row__pct">${(r.pct * 100).toFixed(1)}%</div>
      <div class="odds-bar"><div class="odds-bar__fill" style="width:${(r.pct * 100).toFixed(1)}%"></div></div>
    `;
    table.appendChild(row);
  });
}

function renderSOS() {
  const rows = standings();
  const withSOS = rows.map(r => ({ ...r, sos: strengthOfSchedule(r.team) }));
  withSOS.sort((a, b) => (b.sos.remainingAvg || 0) - (a.sos.remainingAvg || 0));
  const body = document.getElementById("sosBody");
  body.innerHTML = "";
  withSOS.forEach((r, i) => {
    const nextOpp = r.sos.remainingOpponents[0] || "—";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${r.team}</td>
      <td>${r.sos.pastAvg !== null ? fmt2(r.sos.pastAvg) : "—"}</td>
      <td>${r.sos.remainingAvg !== null ? fmt2(r.sos.remainingAvg) : "Season done"}</td>
      <td>${nextOpp}</td>
    `;
    body.appendChild(tr);
  });
}

function renderBenchManagement() {
  const week = latestWeek();
  const note = document.getElementById("benchNote");
  const body = document.getElementById("benchBody");
  const table = document.getElementById("benchTable").parentElement;

  const hasRosterData = typeof ROSTERS !== "undefined" && ROSTERS[week];
  if (!hasRosterData) {
    table.style.display = "none";
    note.textContent = "No roster data yet for this week — send full box score screenshots (starters + bench) to unlock this.";
    return;
  }
  table.style.display = "";

  const rows = TEAMS.map(t => ({ team: t, ...benchPointsLeft(t, week) })).filter(r => r.optimalTotal !== undefined);
  rows.sort((a, b) => a.left - b.left);
  body.innerHTML = "";
  rows.forEach((r, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${r.team}</td>
      <td>${fmt2(r.actual)}</td>
      <td>${fmt2(r.optimalTotal)}</td>
      <td class="${r.left < 8 ? "bench-tight" : r.left > 25 ? "bench-loose" : ""}">${fmt2(r.left)}</td>
    `;
    body.appendChild(tr);
  });
}

function renderRecap() {
  const wk = latestWeek();
  document.getElementById("recapTitle").textContent = wk ? `Week ${wk} Recap` : "Weekly Recap";
  const awards = weeklyAwards(wk);
  const grid = document.getElementById("recapGrid");
  grid.innerHTML = "";

  if (!awards) {
    grid.innerHTML = `<div class="recap-card recap-card--wide"><div class="recap-card__label">No games played yet</div></div>`;
    return;
  }

  const cards = [
    {
      label: "Top scorer",
      value: `${awards.topScorer.team} — ${fmt2(awards.topScorer.score)}`,
      detail: "Highest score of the week"
    },
    {
      label: "Wooden spoon",
      value: `${awards.lowScorer.team} — ${fmt2(awards.lowScorer.score)}`,
      detail: "Lowest score of the week"
    },
    {
      label: "Nail-biter",
      value: `${awards.closestGame.winner} def. ${awards.closestGame.loser}`,
      detail: `Margin of ${fmt2(awards.closestGame.diff)} points`
    },
    {
      label: "Blowout of the week",
      value: `${awards.biggestBlowout.winner} def. ${awards.biggestBlowout.loser}`,
      detail: `Margin of ${fmt2(awards.biggestBlowout.diff)} points`
    },
    {
      label: "Ball out of the week",
      value: awards.bestPerformance.team,
      detail: awards.vsLeagueOnly
        ? `${signed(awards.bestPerformance.delta)} over the league average`
        : `${signed(awards.bestPerformance.delta)} over their own average`
    },
    {
      label: "Cold snap",
      value: awards.worstPerformance.team,
      detail: awards.vsLeagueOnly
        ? `${signed(awards.worstPerformance.delta)} under the league average`
        : `${signed(awards.worstPerformance.delta)} under their own average`
    }
  ];

  cards.forEach(c => {
    const div = document.createElement("div");
    div.className = "recap-card";
    div.innerHTML = `
      <div class="recap-card__label">${c.label}</div>
      <div class="recap-card__value">${c.value}</div>
      <div class="recap-card__detail">${c.detail}</div>
    `;
    grid.appendChild(div);
  });

  if (awards.topScorerPlayer) {
    const p = awards.topScorerPlayer;
    const div = document.createElement("div");
    div.className = "recap-card";
    div.innerHTML = `
      <div class="recap-card__label">Highest scorer</div>
      <div class="recap-card__value">${p.n} (${p.team})</div>
      <div class="recap-card__detail">${fmt2(p.pts)} pts${typeof p.proj === "number" ? ` vs. ${fmt1(p.proj)} projected` : ""}</div>
    `;
    grid.appendChild(div);
  }

  const bb = boomBustLeague(wk);
  if (bb) {
    const boomDiv = document.createElement("div");
    boomDiv.className = "recap-card";
    boomDiv.innerHTML = `
      <div class="recap-card__label">Boom of the week</div>
      <div class="recap-card__value">${bb.boom.n} (${bb.boom.team})</div>
      <div class="recap-card__detail">${fmt2(bb.boom.pts)} pts vs. ${fmt1(bb.boom.proj)} projected — ${signed(bb.boom.delta)}</div>
    `;
    grid.appendChild(boomDiv);

    const bustDiv = document.createElement("div");
    bustDiv.className = "recap-card";
    bustDiv.innerHTML = `
      <div class="recap-card__label">Bust of the week</div>
      <div class="recap-card__value">${bb.bust.n} (${bb.bust.team})</div>
      <div class="recap-card__detail">${fmt2(bb.bust.pts)} pts vs. ${fmt1(bb.bust.proj)} projected — ${signed(bb.bust.delta)}</div>
    `;
    grid.appendChild(bustDiv);
  }
}

function renderPositionalRankings() {
  const container = document.getElementById("positionGrid");
  const data = positionalPowerRankings();
  container.innerHTML = "";
  ["QB", "RB", "WR", "TE"].forEach(pos => {
    const panel = document.createElement("div");
    panel.className = "position-panel";
    const rows = data[pos].map((r, i) => `
      <div class="position-panel__row${i === 0 ? " position-panel__row--top" : ""}">
        <span class="position-panel__rank">${i + 1}</span>
        <span class="position-panel__team">${r.team}</span>
        <span class="position-panel__value">${fmt2(r.avg)}</span>
      </div>
    `).join("");
    panel.innerHTML = `<div class="position-panel__title">${pos}</div>${rows}`;
    container.appendChild(panel);
  });
}

function renderOddsFromSim(results) {
  const order = [...TEAMS].sort((a, b) => results[b].playoffPct - results[a].playoffPct);
  const table = document.getElementById("oddsTable");
  table.innerHTML = "";

  order.forEach(team => {
    const r = results[team];
    const row = document.createElement("div");
    row.className = "odds-row";
    row.innerHTML = `
      <div class="odds-row__team">${team}</div>
      <div class="odds-row__odds">${toAmericanOdds(r.playoffPct)}</div>
      <div class="odds-row__pct">${(r.playoffPct * 100).toFixed(1)}%</div>
      <div class="odds-bar"><div class="odds-bar__fill" style="width:${(r.playoffPct * 100).toFixed(1)}%"></div></div>
    `;
    table.appendChild(row);
  });
}

function renderSpreads() {
  const { week, games } = upcomingSpreads();
  const title = document.getElementById("spreadTitle");
  const grid = document.getElementById("spreadGrid");
  grid.innerHTML = "";

  if (!week) {
    title.textContent = "Regular Season Complete";
    grid.innerHTML = `<div class="spread-card">Playoffs are set — check the odds table above for bracket chances.</div>`;
    return;
  }

  title.textContent = `Week ${week} Spreads`;
  games.forEach(g => {
    const div = document.createElement("div");
    div.className = "spread-card";
    div.innerHTML = `
      <div class="spread-card__matchup">
        <span class="spread-card__fav">${g.favorite} -${fmt1(g.spread)}</span>
        <span class="spread-card__vs">vs</span>
        <span>${g.underdog}</span>
      </div>
      <div class="spread-card__line">Projected: ${g.favorite} ${g.favProj} — ${g.underdog} ${g.dogProj}</div>
    `;
    grid.appendChild(div);
  });
}

function renderStandingsTable() {
  const rows = standings();
  const body = document.getElementById("standingsBody");
  body.innerHTML = "";
  rows.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.standing}</td>
      <td>${r.team}</td>
      <td>${r.wins}-${r.losses}</td>
      <td>${fmt2(r.pointsFor)}</td>
      <td>${fmt2(r.pointsAgainst)}</td>
      <td>${fmt2(r.power)}</td>
      <td class="${r.luck > 0 ? "luck-pos" : r.luck < 0 ? "luck-neg" : ""}">${signed(r.luck)}</td>
    `;
    body.appendChild(tr);
  });
}

function render() {
  renderHeader();
  renderMoversTicker();
  renderLadder();
  window.__seasonSim = simulateSeason(8000);
  renderTeamPills();
  renderTeamRecap(window.__seasonSim);
  renderPowerHistoryChart();
  renderRecap();
  renderOddsFromSim(window.__seasonSim);
  renderSpreads();
  renderAllPlay();
  renderSOS();
  renderPositionalRankings();
  renderBenchManagement();
  renderStandingsTable();
}

render();
