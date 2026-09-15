// ============================================================
// ZOOM! BLACK JET — calculation engine
// Reproduces the Google Sheet's Power Score / Luck Score formulas
// exactly, then extends into a Monte Carlo playoff simulator.
// ============================================================

function playedWeeks(upToWeek) {
  const all = Object.keys(WEEKLY_SCORES).map(Number).sort((a, b) => a - b);
  return typeof upToWeek === "number" ? all.filter(w => w <= upToWeek) : all;
}

function latestWeek() {
  const w = playedWeeks();
  return w.length ? w[w.length - 1] : 0;
}

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Opponent a team faced in a given week (1-indexed week, weeks 1-14 only)
function opponentOf(team, week) {
  if (week < 1 || week > REGULAR_SEASON_WEEKS) return null;
  return SCHEDULE[team][week - 1];
}

// ---- Per-team weekly series --------------------------------

function scoresForSeries(team, upToWeek) {
  return playedWeeks(upToWeek).map(w => WEEKLY_SCORES[w][team]);
}

function scoresAgainstSeries(team, upToWeek) {
  return playedWeeks(upToWeek).map(w => {
    const opp = opponentOf(team, w);
    return opp ? WEEKLY_SCORES[w][opp] : null;
  }).filter(v => v !== null);
}

function mean(arr) { return arr.reduce((a, b) => a + b, 0) / arr.length; }
function stddev(arr) {
  if (arr.length < 2) return null;
  const m = mean(arr);
  const variance = arr.reduce((a, b) => a + (b - m) ** 2, 0) / (arr.length - 1);
  return Math.sqrt(variance);
}

// League-wide baseline (used to stabilize early-season projections)
function leagueBaseline() {
  const all = [];
  playedWeeks().forEach(w => TEAMS.forEach(t => all.push(WEEKLY_SCORES[w][t])));
  return { mean: mean(all), std: stddev(all) || 20 };
}

// ---- Power Score (matches sheet formula exactly) -----------
// PowerScore = ((avg*6) + ((max+min)*2) + ((beatCount/weeks)*400)) / 10

function powerScore(team, upToWeek) {
  const sf = scoresForSeries(team, upToWeek);
  const sa = scoresAgainstSeries(team, upToWeek);
  if (sf.length === 0) return 0;
  const avg = mean(sf);
  const maxmin = Math.max(...sf) + Math.min(...sf);
  const beatCount = sf.reduce((c, v, i) => c + (v > sa[i] ? 1 : 0), 0);
  const term3 = (beatCount / sf.length) * 400;
  return (avg * 6 + maxmin * 2 + term3) / 10;
}

// ---- Luck Score (matches sheet formula exactly) -------------
// LuckScore = (ActualWins - TopHalfWeeks) * (1 - xW) * 10
// xW = TGW / TG, TGW = total weekly "beats" vs the full field

function record(team, upToWeek) {
  const sf = scoresForSeries(team, upToWeek);
  const sa = scoresAgainstSeries(team, upToWeek);
  let w = 0, l = 0;
  sf.forEach((v, i) => (v > sa[i] ? w++ : l++));
  return { wins: w, losses: l };
}

function luckScore(team, upToWeek) {
  const weeks = playedWeeks(upToWeek);
  if (weeks.length === 0) return 0;

  let tgw = 0, topHalf = 0;
  weeks.forEach(w => {
    const myScore = WEEKLY_SCORES[w][team];
    const weekScores = TEAMS.map(t => WEEKLY_SCORES[w][t]);
    const beats = weekScores.filter(s => s < myScore).length; // beat every other team's score that week
    tgw += beats;
    const rank = [...weekScores].sort((a, b) => b - a).indexOf(myScore) + 1;
    if (rank <= TEAMS.length / 2) topHalf += 1;
  });

  const tg = (TEAMS.length - 1) * weeks.length;
  const xW = tg > 0 ? tgw / tg : 0;
  const { wins } = record(team, upToWeek);
  const deltaGamesWon = wins - topHalf;
  return deltaGamesWon * (1 - xW) * 10;
}

// ---- Standings table -----------------------------------------

function standings(upToWeek) {
  const rows = TEAMS.map(team => {
    const { wins, losses } = record(team, upToWeek);
    const sf = scoresForSeries(team, upToWeek);
    const sa = scoresAgainstSeries(team, upToWeek);
    return {
      team,
      wins, losses,
      pointsFor: sf.reduce((a, b) => a + b, 0),
      pointsAgainst: sa.reduce((a, b) => a + b, 0),
      power: powerScore(team, upToWeek),
      luck: luckScore(team, upToWeek)
    };
  });
  rows.sort((a, b) => b.wins - a.wins || b.pointsFor - a.pointsFor);
  rows.forEach((r, i) => (r.standing = i + 1));

  const byPower = [...rows].sort((a, b) => b.power - a.power);
  byPower.forEach((r, i) => (r.powerRank = i + 1));

  return rows;
}

// Power rank as of a past week (used for week-over-week movement)
function powerRankAsOfWeek(w) {
  const ranked = [...TEAMS].sort((a, b) => powerScore(b, w) - powerScore(a, w));
  const ranks = {};
  ranked.forEach((t, i) => (ranks[t] = i + 1));
  return ranks;
}

// ---- Projection model for simulation ---------------------------

function projectedDist(team) {
  const sf = scoresForSeries(team);
  const base = leagueBaseline();
  const gp = sf.length;
  // Shrink small samples toward the league mean (pseudo-count of 3 weeks)
  const pseudo = 3;
  const projMean = gp > 0
    ? (mean(sf) * gp + base.mean * pseudo) / (gp + pseudo)
    : base.mean;
  const projStd = gp >= 3 ? (stddev(sf) || base.std) : base.std;
  return { mean: projMean, std: projStd };
}

// Box-Muller normal sample
function sampleNormal(mean, std) {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return mean + std * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// ---- Monte Carlo season + playoff simulation --------------------

function simulateSeason(numSims = 8000) {
  const dists = {};
  TEAMS.forEach(t => (dists[t] = projectedDist(t)));

  const playedThroughWeek = latestWeek();
  const remainingWeeks = [];
  for (let w = playedThroughWeek + 1; w <= REGULAR_SEASON_WEEKS; w++) remainingWeeks.push(w);

  const playoffCount = {}, champCount = {}, finalsCount = {};
  TEAMS.forEach(t => { playoffCount[t] = 0; champCount[t] = 0; finalsCount[t] = 0; });

  const baseRecord = {};
  TEAMS.forEach(t => {
    const { wins, losses } = record(t);
    const sf = scoresForSeries(t);
    baseRecord[t] = { wins, losses, pf: sf.reduce((a, b) => a + b, 0) };
  });

  for (let sim = 0; sim < numSims; sim++) {
    const simRecord = {};
    TEAMS.forEach(t => (simRecord[t] = { ...baseRecord[t] }));

    remainingWeeks.forEach(w => {
      const done = new Set();
      TEAMS.forEach(t => {
        if (done.has(t)) return;
        const opp = opponentOf(t, w);
        done.add(t); done.add(opp);
        const s1 = sampleNormal(dists[t].mean, dists[t].std);
        const s2 = sampleNormal(dists[opp].mean, dists[opp].std);
        simRecord[t].pf += s1;
        simRecord[opp].pf += s2;
        if (s1 > s2) { simRecord[t].wins++; simRecord[opp].losses++; }
        else { simRecord[opp].wins++; simRecord[t].losses++; }
      });
    });

    const seeded = [...TEAMS].sort((a, b) =>
      simRecord[b].wins - simRecord[a].wins || simRecord[b].pf - simRecord[a].pf
    );
    const playoffTeams = seeded.slice(0, PLAYOFF_TEAMS);
    playoffTeams.forEach(t => playoffCount[t]++);

    // Bracket: seeds 1,2 bye. Round1: 3v6, 4v5. Round2: 1 vs (4/5 winner), 2 vs (3/6 winner). Round3: final.
    const [s1, s2, s3, s4, s5, s6] = playoffTeams;
    const playGame = (a, b) => {
      const sa = sampleNormal(dists[a].mean, dists[a].std);
      const sb = sampleNormal(dists[b].mean, dists[b].std);
      return sa >= sb ? a : b;
    };
    const r1a = playGame(s3, s6);
    const r1b = playGame(s4, s5);
    const semiWinnerA = playGame(s1, r1b);
    const semiWinnerB = playGame(s2, r1a);
    finalsCount[semiWinnerA]++; finalsCount[semiWinnerB]++;
    const champ = playGame(semiWinnerA, semiWinnerB);
    champCount[champ]++;
  }

  const results = {};
  TEAMS.forEach(t => {
    results[t] = {
      playoffPct: playoffCount[t] / numSims,
      finalsPct: finalsCount[t] / numSims,
      champPct: champCount[t] / numSims
    };
  });
  return results;
}

// ---- American odds formatting -----------------------------------

function toAmericanOdds(p) {
  if (p <= 0.002) return "+5000";
  if (p >= 0.98) return "Lock";
  if (p >= 0.5) {
    const odds = Math.max(-100 * p / (1 - p), -2000);
    return Math.round(odds).toString();
  } else {
    const odds = Math.min(100 * (1 - p) / p, 5000);
    return "+" + Math.round(odds).toString();
  }
}

// ---- Next week matchup spreads -----------------------------------

function upcomingSpreads() {
  const nextWeek = latestWeek() + 1;
  if (nextWeek > REGULAR_SEASON_WEEKS) return { week: null, games: [] };
  const dists = {};
  TEAMS.forEach(t => (dists[t] = projectedDist(t)));

  const done = new Set();
  const games = [];
  TEAMS.forEach(t => {
    if (done.has(t)) return;
    const opp = opponentOf(t, nextWeek);
    done.add(t); done.add(opp);
    const diff = dists[t].mean - dists[opp].mean;
    const favorite = diff >= 0 ? t : opp;
    const underdog = diff >= 0 ? opp : t;
    const spread = Math.round(Math.abs(diff) * 2) / 2; // nearest 0.5
    games.push({
      favorite, underdog, spread,
      favProj: (diff >= 0 ? dists[t].mean : dists[opp].mean).toFixed(1),
      dogProj: (diff >= 0 ? dists[opp].mean : dists[t].mean).toFixed(1)
    });
  });
  return { week: nextWeek, games };
}

// ---- Per-team weekly result & recap --------------------------------

function teamWeeklyResult(team, week) {
  if (!WEEKLY_SCORES[week]) return null;
  const opponent = opponentOf(team, week);
  const myScore = WEEKLY_SCORES[week][team];
  const oppScore = WEEKLY_SCORES[week][opponent];
  return { opponent, myScore, oppScore, won: myScore > oppScore, margin: Math.abs(myScore - oppScore) };
}

function weekScoreRank(team, week) {
  const scores = TEAMS.map(t => WEEKLY_SCORES[week][t]);
  return [...scores].sort((a, b) => b - a).indexOf(WEEKLY_SCORES[week][team]) + 1;
}

// Current win/loss streak, counting backward from `week`
function currentStreak(team, week) {
  const weeks = playedWeeks(week).slice().reverse();
  let type = null, count = 0;
  for (const w of weeks) {
    const outcome = teamWeeklyResult(team, w).won ? "W" : "L";
    if (type === null) { type = outcome; count = 1; }
    else if (outcome === type) count++;
    else break;
  }
  return { type, count };
}

// Builds the full set of facts used to write a team-specific recap.
// `seasonSim` is the (already-run) output of simulateSeason(), passed in
// so we don't re-run the Monte Carlo simulation per team.
function getTeamRecap(team, week, seasonSim) {
  if (!week || !WEEKLY_SCORES[week]) return null;

  const result = teamWeeklyResult(team, week);
  const rows = standings(week);
  const me = rows.find(r => r.team === team);

  const prevRanks = week > 1 ? powerRankAsOfWeek(week - 1) : null;
  const prevPowerRank = prevRanks ? prevRanks[team] : null;
  const powerRankDelta = prevPowerRank !== null ? prevPowerRank - me.powerRank : null;

  const priorWeeks = playedWeeks(week).filter(w => w < week);
  const priorAvg = priorWeeks.length ? mean(priorWeeks.map(w => WEEKLY_SCORES[w][team])) : null;
  const vsOwnAvg = priorAvg !== null ? result.myScore - priorAvg : null;

  const weekRank = weekScoreRank(team, week);
  const streak = currentStreak(team, week);

  let next = null;
  const nextWeek = week + 1;
  if (nextWeek <= REGULAR_SEASON_WEEKS) {
    const opp = opponentOf(team, nextWeek);
    const dA = projectedDist(team), dB = projectedDist(opp);
    const diff = dA.mean - dB.mean;
    const favorite = diff >= 0 ? team : opp;
    next = {
      week: nextWeek,
      opponent: opp,
      favorite,
      meFavored: favorite === team,
      spread: Math.round(Math.abs(diff) * 2) / 2
    };
  }

  const odds = seasonSim ? seasonSim[team] : null;

  let personalHighlight = null;
  const wk = PLAYER_HIGHLIGHTS && PLAYER_HIGHLIGHTS[week];
  if (wk && wk.topScorer && wk.topScorer.startsWith(team + " —")) {
    personalHighlight = wk.topScorer;
  }

  return {
    team, week, result, me, priorAvg, vsOwnAvg,
    weekRank, streak, powerRankDelta, next, odds, personalHighlight
  };
}

// ---- All-play record (record vs the full field, every week) --------

function allPlayRecord(team, upToWeek) {
  const weeks = playedWeeks(upToWeek);
  let wins = 0, losses = 0;
  weeks.forEach(w => {
    const my = WEEKLY_SCORES[w][team];
    TEAMS.forEach(t => {
      if (t === team) return;
      if (my > WEEKLY_SCORES[w][t]) wins++; else losses++;
    });
  });
  return { wins, losses, pct: wins + losses > 0 ? wins / (wins + losses) : 0 };
}

// ---- Power score history (for the trend chart) -----------------------

function powerScoreHistory(team) {
  return playedWeeks().map(w => ({ week: w, power: powerScore(team, w) }));
}

// ---- Strength of schedule --------------------------------------------
// Opponent quality measured by their current power score.

function strengthOfSchedule(team) {
  const lw = latestWeek();
  const pastOpponents = [], remainingOpponents = [];
  for (let w = 1; w <= REGULAR_SEASON_WEEKS; w++) {
    const opp = opponentOf(team, w);
    if (w <= lw) pastOpponents.push(opp); else remainingOpponents.push(opp);
  }
  const strengthOf = t => powerScore(t, lw);
  const avg = arr => arr.length ? mean(arr.map(strengthOf)) : null;
  return {
    pastAvg: avg(pastOpponents),
    remainingAvg: avg(remainingOpponents),
    remainingOpponents
  };
}

// ---- Weekly movers (for the riser/faller ticker) ----------------------

function weekMovers(week) {
  if (!week || week <= 1) return null;
  const prev = powerRankAsOfWeek(week - 1);
  const rows = standings(week);
  const deltas = rows.map(r => ({ team: r.team, delta: prev[r.team] - r.powerRank }));
  deltas.sort((a, b) => b.delta - a.delta);
  const riser = deltas[0];
  const faller = deltas[deltas.length - 1];
  if (!riser || riser.delta <= 0) return { riser: null, faller: null };
  return { riser, faller: faller.delta < 0 ? faller : null };
}

// ---- Optimal lineup / points left on bench ----------------------------

function optimalLineup(players) {
  const byPos = pos => players.filter(p => p.pos === pos).sort((a, b) => b.pts - a.pts);
  const qb = byPos("QB")[0];
  const dst = byPos("DST")[0];
  const k = byPos("K")[0];
  const rbs = byPos("RB"), wrs = byPos("WR"), tes = byPos("TE");
  const startRB = rbs.slice(0, 2), startWR = wrs.slice(0, 2), startTE = tes.slice(0, 1);
  const leftovers = [...rbs.slice(2), ...wrs.slice(2), ...tes.slice(1)].sort((a, b) => b.pts - a.pts);
  const flex = leftovers[0];
  const chosen = [qb, ...startRB, ...startWR, ...startTE, flex, dst, k].filter(Boolean);
  const total = chosen.reduce((a, p) => a + p.pts, 0);
  return { total, chosen, flexPlayer: flex };
}

function benchPointsLeft(team, week) {
  const roster = ROSTERS && ROSTERS[week] && ROSTERS[week][team];
  if (!roster) return null;
  const opt = optimalLineup(roster);
  const actual = WEEKLY_SCORES[week][team];
  return { optimalTotal: opt.total, actual, left: opt.total - actual, chosen: opt.chosen };
}

// ---- Player awards: MVP/Bust, league Boom/Bust, positional rankings ----

function rosterWeeks() {
  return typeof ROSTERS !== "undefined" ? Object.keys(ROSTERS).map(Number).sort((a, b) => a - b) : [];
}

// Best/worst-performing STARTER for one team, one week (vs. projection for bust)
function teamMVPBust(team, week) {
  const roster = typeof ROSTERS !== "undefined" && ROSTERS[week] && ROSTERS[week][team];
  if (!roster) return null;
  const starters = roster.filter(p => p.started);
  if (!starters.length) return null;
  const mvp = [...starters].sort((a, b) => b.pts - a.pts)[0];
  const withProj = starters.filter(p => typeof p.proj === "number");
  const bust = withProj.length
    ? [...withProj].sort((a, b) => (a.pts - a.proj) - (b.pts - b.proj))[0]
    : null;
  return { mvp, bust: bust && bust.pts - bust.proj < 0 ? bust : null };
}

// Biggest league-wide over/under-performance vs. projection, starters only
function boomBustLeague(week) {
  const teams = typeof ROSTERS !== "undefined" && ROSTERS[week];
  if (!teams) return null;
  const all = [];
  Object.keys(teams).forEach(team => {
    teams[team].forEach(p => {
      if (p.started && typeof p.proj === "number") all.push({ ...p, team, delta: p.pts - p.proj });
    });
  });
  if (!all.length) return null;
  all.sort((a, b) => b.delta - a.delta);
  return { boom: all[0], bust: all[all.length - 1] };
}

// Average starter production by position, per team, across all weeks with roster data
function positionalPowerRankings() {
  const weeks = rosterWeeks();
  const positions = ["QB", "RB", "WR", "TE"];
  const totals = {}, weeksCounted = {};
  TEAMS.forEach(t => { totals[t] = { QB: 0, RB: 0, WR: 0, TE: 0 }; weeksCounted[t] = 0; });

  weeks.forEach(w => {
    TEAMS.forEach(t => {
      const roster = ROSTERS[w] && ROSTERS[w][t];
      if (!roster) return;
      weeksCounted[t]++;
      roster.filter(p => p.started).forEach(p => {
        if (positions.includes(p.pos)) totals[t][p.pos] += p.pts;
      });
    });
  });

  const result = {};
  positions.forEach(pos => {
    result[pos] = TEAMS.map(t => ({
      team: t,
      avg: weeksCounted[t] ? totals[t][pos] / weeksCounted[t] : 0
    })).sort((a, b) => b.avg - a.avg);
  });
  return result;
}

// Highest-scoring starter league-wide (derived automatically from ROSTERS,
// no manual entry needed once you've sent a week's box scores)
function leagueTopScorer(week) {
  const teams = typeof ROSTERS !== "undefined" && ROSTERS[week];
  if (!teams) return null;
  let best = null;
  Object.keys(teams).forEach(team => {
    teams[team].forEach(p => {
      if (!p.started) return;
      if (!best || p.pts > best.pts) best = { ...p, team };
    });
  });
  return best;
}

// ---- Weekly awards ------------------------------------------------

function weeklyAwards(week) {
  if (!WEEKLY_SCORES[week]) return null;
  const scores = TEAMS.map(t => ({ team: t, score: WEEKLY_SCORES[week][t] }));
  scores.sort((a, b) => b.score - a.score);

  const done = new Set();
  const margins = [];
  TEAMS.forEach(t => {
    if (done.has(t)) return;
    const opp = opponentOf(t, week);
    done.add(t); done.add(opp);
    const diff = Math.abs(WEEKLY_SCORES[week][t] - WEEKLY_SCORES[week][opp]);
    const winner = WEEKLY_SCORES[week][t] > WEEKLY_SCORES[week][opp] ? t : opp;
    const loser = winner === t ? opp : t;
    margins.push({ winner, loser, diff });
  });
  margins.sort((a, b) => a.diff - b.diff);

  // Over/under-performance vs season average entering the week
  const priorWeeks = playedWeeks().filter(w => w < week);
  const vsLeagueOnly = priorWeeks.length === 0;
  const perf = TEAMS.map(t => {
    const priorScores = priorWeeks.map(w => WEEKLY_SCORES[w][t]);
    const priorAvg = priorScores.length ? mean(priorScores) : mean(TEAMS.map(x => WEEKLY_SCORES[week][x]));
    return { team: t, delta: WEEKLY_SCORES[week][t] - priorAvg };
  });
  perf.sort((a, b) => b.delta - a.delta);

  return {
    topScorer: scores[0],
    lowScorer: scores[scores.length - 1],
    closestGame: margins[0],
    biggestBlowout: margins[margins.length - 1],
    bestPerformance: perf[0],
    worstPerformance: perf[perf.length - 1],
    vsLeagueOnly,
    topScorerPlayer: leagueTopScorer(week)
  };
}
