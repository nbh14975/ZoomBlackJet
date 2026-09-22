// ============================================================
// ZOOM! BLACK JET — league data
// Update this file each week: add the new week's scores to
// WEEKLY_SCORES. Everything else (rankings, odds, spreads,
// awards) recalculates automatically.
// ============================================================

const LEAGUE_NAME = "Gores Whores";

const TEAMS = [
  "Reese", "Seth", "Noah", "JD", "Logan",
  "Hampton", "Mirsky", "Brandon", "Matthew", "Evan"
];

// Regular season schedule, weeks 1-14. Playoffs (top 6, seeds 1+2 bye)
// run weeks 15-17 and are seeded live once the regular season ends.
const SCHEDULE = {
  Noah:    ["Mirsky","Evan","Hampton","Brandon","JD","Logan","Reese","Matthew","Seth","Mirsky","Evan","Hampton","Brandon","JD"],
  Matthew: ["Seth","Mirsky","Evan","Hampton","Brandon","JD","Logan","Noah","Reese","Seth","Mirsky","Evan","Hampton","Brandon"],
  JD:      ["Hampton","Brandon","Reese","Logan","Noah","Matthew","Seth","Mirsky","Evan","Hampton","Brandon","Reese","Logan","Noah"],
  Brandon: ["Reese","JD","Logan","Noah","Matthew","Seth","Mirsky","Evan","Hampton","Reese","JD","Logan","Noah","Matthew"],
  Reese:   ["Brandon","Seth","JD","Mirsky","Logan","Evan","Noah","Hampton","Matthew","Brandon","Seth","JD","Mirsky","Logan"],
  Hampton: ["JD","Logan","Noah","Matthew","Seth","Mirsky","Evan","Reese","Brandon","JD","Logan","Noah","Matthew","Seth"],
  Logan:   ["Evan","Hampton","Brandon","JD","Reese","Noah","Matthew","Seth","Mirsky","Evan","Hampton","Brandon","JD","Reese"],
  Seth:    ["Matthew","Reese","Mirsky","Evan","Hampton","Brandon","JD","Logan","Noah","Matthew","Reese","Mirsky","Evan","Hampton"],
  Evan:    ["Logan","Noah","Matthew","Seth","Mirsky","Reese","Hampton","Brandon","JD","Logan","Noah","Matthew","Seth","Mirsky"],
  Mirsky:  ["Noah","Matthew","Seth","Reese","Evan","Hampton","Brandon","JD","Logan","Noah","Matthew","Seth","Reese","Evan"]
};

// Points scored by every team, each completed week.
// Add a new object to this array each week, e.g. WEEKLY_SCORES[2] = {...}
const WEEKLY_SCORES = {
  1: {
    Reese: 148.20, Seth: 147.36, Noah: 142.82, JD: 135.76, Logan: 105.34,
    Hampton: 131.42, Mirsky: 130.86, Brandon: 115.06, Matthew: 98.96, Evan: 75.80
  },
  2: {
    Hampton: 165.68, Reese: 164.58, Mirsky: 152.42, Logan: 151.48, Noah: 116.56,
    JD: 102.44, Evan: 101.98, Brandon: 100.08, Matthew: 89.12, Seth: 80.60
  }
};

// Optional: fill in a player-level highlight for a week's top scorer, etc.
// Shown as a bonus line on the awards card when present.
// Optional manual override: only needed if you want a bonus note on a
// team's own recap for a week where you haven't sent roster screenshots
// (the "Highest scorer" card and MVP/Bust badges now compute automatically
// from ROSTERS once that week's box scores are in).
const PLAYER_HIGHLIGHTS = {
  1: { topScorer: "Mirsky — J. Allen, 35.66 pts" }
};

// Full rosters (starters + bench) with points AND projections, for the
// optimal-lineup feature and player awards (MVP, Bust, Boom/Bust,
// positional power rankings). `started` marks who was actually in the
// lineup that week. Positions: QB, RB, WR, TE, DST, K.
const ROSTERS = {
  1: {
    Mirsky: [
      { n: "Josh Allen", pos: "QB", proj: 19.3, pts: 35.66, started: true },
      { n: "James Cook III", pos: "RB", proj: 15.9, pts: 9.9, started: true },
      { n: "Rhamondre Stevenson", pos: "RB", proj: 14.0, pts: 14.5, started: true },
      { n: "Justin Jefferson", pos: "WR", proj: 17.1, pts: 31.2, started: true },
      { n: "Garrett Wilson", pos: "WR", proj: 14.8, pts: 13.9, started: true },
      { n: "Harold Fannin Jr.", pos: "TE", proj: 11.1, pts: 4.1, started: true },
      { n: "Davante Adams", pos: "WR", proj: 13.8, pts: 5.6, started: true },
      { n: "Seahawks", pos: "DST", proj: 7.2, pts: 14.0, started: true },
      { n: "Cameron Dicker", pos: "K", proj: 10.8, pts: 2.0, started: true },
      { n: "Bhayshul Tuten", pos: "RB", proj: 12.0, pts: 9.8, started: false },
      { n: "Wan'Dale Robinson", pos: "WR", proj: 10.4, pts: 8.8, started: false },
      { n: "MarShawn Lloyd", pos: "RB", proj: 12.7, pts: 3.7, started: false },
      { n: "Jaxson Dart", pos: "QB", proj: 18.5, pts: 26.6, started: false },
      { n: "Xavier Worthy", pos: "WR", proj: 9.5, pts: 4.8, started: false },
      { n: "Deebo Samuel Sr.", pos: "WR", proj: 8.9, pts: 18.0, started: false },
      { n: "Ray Davis", pos: "RB", proj: 5.1, pts: 0.3, started: false }
    ],
    Noah: [
      { n: "Jalen Hurts", pos: "QB", proj: 21.1, pts: 24.72, started: true },
      { n: "Chase Brown", pos: "RB", proj: 16.0, pts: 18.8, started: true },
      { n: "Travis Etienne Jr.", pos: "RB", proj: 15.1, pts: 14.8, started: true },
      { n: "Amon-Ra St. Brown", pos: "WR", proj: 18.8, pts: 28.7, started: true },
      { n: "Nico Collins", pos: "WR", proj: 15.6, pts: 21.2, started: true },
      { n: "Tyler Warren", pos: "TE", proj: 12.2, pts: 10.3, started: true },
      { n: "Luther Burden III", pos: "WR", proj: 12.0, pts: 9.5, started: true },
      { n: "Eagles", pos: "DST", proj: 6.1, pts: 5.0, started: true },
      { n: "Ka'imi Fairbairn", pos: "K", proj: 10.3, pts: 9.8, started: true },
      { n: "Christian Watson", pos: "WR", proj: 10.9, pts: 32.7, started: false },
      { n: "Rico Dowdle", pos: "RB", proj: 12.5, pts: 4.1, started: false },
      { n: "Chuba Hubbard", pos: "RB", proj: 12.2, pts: 23.7, started: false },
      { n: "Jordan Mason", pos: "RB", proj: 9.6, pts: 11.9, started: false },
      { n: "Romeo Doubs", pos: "WR", proj: 8.2, pts: 0.0, started: false },
      { n: "Tyler Allgeier", pos: "RB", proj: 7.5, pts: 9.0, started: false },
      { n: "Mike Washington Jr.", pos: "RB", proj: 7.4, pts: 4.1, started: false }
    ],
    Reese: [
      { n: "Trevor Lawrence", pos: "QB", proj: 16.9, pts: 26.1, started: true },
      { n: "Omarion Hampton", pos: "RB", proj: 17.6, pts: 8.3, started: true },
      { n: "D'Andre Swift", pos: "RB", proj: 12.3, pts: 32.4, started: true },
      { n: "CeeDee Lamb", pos: "WR", proj: 17.3, pts: 15.4, started: true },
      { n: "Chris Olave", pos: "WR", proj: 14.8, pts: 28.2, started: true },
      { n: "Tucker Kraft", pos: "TE", proj: 9.0, pts: 9.5, started: true },
      { n: "DeVonta Smith", pos: "WR", proj: 14.8, pts: 8.3, started: true },
      { n: "Steelers", pos: "DST", proj: 7.2, pts: 19.0, started: true },
      { n: "Brandon Aubrey", pos: "K", proj: 10.4, pts: 1.0, started: true },
      { n: "David Montgomery", pos: "RB", proj: 12.7, pts: 28.9, started: false },
      { n: "Parker Washington", pos: "WR", proj: 11.3, pts: 19.3, started: false },
      { n: "Rachaad White", pos: "RB", proj: 8.9, pts: 4.7, started: false },
      { n: "Jalen Coker", pos: "WR", proj: 9.2, pts: 33.8, started: false },
      { n: "Dalton Kincaid", pos: "TE", proj: 8.7, pts: 18.0, started: false },
      { n: "Brock Purdy", pos: "QB", proj: 15.5, pts: 21.1, started: false },
      { n: "Ja'Kobi Lane", pos: "WR", proj: 7.1, pts: 2.1, started: false }
    ],
    Brandon: [
      { n: "Joe Burrow", pos: "QB", proj: 18.2, pts: 14.16, started: true },
      { n: "Derrick Henry", pos: "RB", proj: 16.4, pts: 35.3, started: true },
      { n: "Breece Hall", pos: "RB", proj: 16.5, pts: 19.8, started: true },
      { n: "Ja'Marr Chase", pos: "WR", proj: 19.9, pts: 3.2, started: true },
      { n: "Terry McLaurin", pos: "WR", proj: 12.2, pts: 3.4, started: true },
      { n: "Travis Kelce", pos: "TE", proj: 9.8, pts: 10.1, started: true },
      { n: "Cam Skattebo", pos: "RB", proj: 13.7, pts: 14.1, started: true },
      { n: "Jaguars", pos: "DST", proj: 8.2, pts: 14.0, started: true },
      { n: "Harrison Mevis", pos: "K", proj: 9.8, pts: 1.0, started: true },
      { n: "Malik Nabers", pos: "WR", proj: 12.7, pts: 12.9, started: false },
      { n: "Josh Jacobs", pos: "RB", proj: 0.0, pts: 0.0, started: false },
      { n: "Brian Thomas Jr.", pos: "WR", proj: 10.1, pts: 7.0, started: false },
      { n: "Makai Lemon", pos: "WR", proj: 8.4, pts: 2.5, started: false },
      { n: "Jacory Croskey-Merritt", pos: "RB", proj: 8.3, pts: 12.6, started: false },
      { n: "Jayden Reed", pos: "WR", proj: 10.0, pts: 5.0, started: false },
      { n: "Mark Andrews", pos: "TE", proj: 10.1, pts: 8.9, started: false }
    ],
    Seth: [
      { n: "Lamar Jackson", pos: "QB", proj: 19.1, pts: 24.96, started: true },
      { n: "Jahmyr Gibbs", pos: "RB", proj: 22.4, pts: 33.6, started: true },
      { n: "Tony Pollard", pos: "RB", proj: 11.5, pts: 4.4, started: true },
      { n: "Drake London", pos: "WR", proj: 13.8, pts: 5.5, started: true },
      { n: "Zay Flowers", pos: "WR", proj: 14.2, pts: 26.0, started: true },
      { n: "Dallas Goedert", pos: "TE", proj: 10.9, pts: 23.7, started: true },
      { n: "Jameson Williams", pos: "WR", proj: 12.1, pts: 8.5, started: true },
      { n: "Ravens", pos: "DST", proj: 6.6, pts: 8.0, started: true },
      { n: "Cam Little", pos: "K", proj: 9.3, pts: 12.7, started: true },
      { n: "Jonathon Brooks", pos: "RB", proj: 10.7, pts: 7.2, started: false },
      { n: "DK Metcalf", pos: "WR", proj: 12.2, pts: 8.0, started: false },
      { n: "Jakobi Meyers", pos: "WR", proj: 10.4, pts: 12.2, started: false },
      { n: "Josh Downs", pos: "WR", proj: 9.1, pts: 5.7, started: false },
      { n: "Tyjae Spears", pos: "RB", proj: 9.4, pts: 4.4, started: false },
      { n: "Dak Prescott", pos: "QB", proj: 16.7, pts: 14.4, started: false },
      { n: "Jacob Saylors", pos: "RB", proj: 4.9, pts: 0.0, started: false }
    ],
    Matthew: [
      { n: "Justin Herbert", pos: "QB", proj: 19.0, pts: 13.26, started: true },
      { n: "Christian McCaffrey", pos: "RB", proj: 18.5, pts: 13.8, started: true },
      { n: "Jadarian Price", pos: "RB", proj: 14.1, pts: 7.8, started: true },
      { n: "A.J. Brown", pos: "WR", proj: 14.2, pts: 5.6, started: true },
      { n: "Ladd McConkey", pos: "WR", proj: 13.7, pts: 19.2, started: true },
      { n: "Colston Loveland", pos: "TE", proj: 12.0, pts: 0.0, started: true },
      { n: "Ashton Jeanty", pos: "RB", proj: 17.9, pts: 32.7, started: true },
      { n: "Texans", pos: "DST", proj: 5.3, pts: -4.0, started: true },
      { n: "Eddy Pineiro", pos: "K", proj: 9.2, pts: 10.6, started: true },
      { n: "Rome Odunze", pos: "WR", proj: 12.4, pts: 7.2, started: false },
      { n: "Marvin Harrison Jr.", pos: "WR", proj: 11.5, pts: 4.3, started: false },
      { n: "Chris Godwin Jr.", pos: "WR", proj: 10.3, pts: 8.3, started: false },
      { n: "Stefon Diggs", pos: "WR", proj: 9.7, pts: 15.5, started: false },
      { n: "RJ Harvey", pos: "RB", proj: 8.5, pts: 8.1, started: false },
      { n: "Caleb Williams", pos: "QB", proj: 16.4, pts: 37.26, started: false },
      { n: "Chris Rodriguez Jr.", pos: "RB", proj: 5.8, pts: 2.3, started: false }
    ],
    JD: [
      { n: "Jayden Daniels", pos: "QB", proj: 16.8, pts: 17.66, started: true },
      { n: "Jonathan Taylor", pos: "RB", proj: 17.7, pts: 25.1, started: true },
      { n: "De'Von Achane", pos: "RB", proj: 18.2, pts: 10.6, started: true },
      { n: "Emeka Egbuka", pos: "WR", proj: 14.0, pts: 11.3, started: true },
      { n: "DJ Moore", pos: "WR", proj: 11.6, pts: 21.0, started: true },
      { n: "Isaiah Likely", pos: "TE", proj: 9.5, pts: 27.8, started: true },
      { n: "Kyren Williams", pos: "RB", proj: 13.7, pts: 15.5, started: true },
      { n: "Chargers", pos: "DST", proj: 7.4, pts: 0.0, started: true },
      { n: "Harrison Butker", pos: "K", proj: 9.0, pts: 6.8, started: true },
      { n: "Mike Evans", pos: "WR", proj: 10.6, pts: 16.9, started: false },
      { n: "Alec Pierce", pos: "WR", proj: 9.7, pts: 10.1, started: false },
      { n: "Michael Wilson", pos: "WR", proj: 10.5, pts: 10.6, started: false },
      { n: "Jordan Addison", pos: "WR", proj: 9.9, pts: 0.0, started: false },
      { n: "Kyle Monangai", pos: "RB", proj: 10.3, pts: 20.4, started: false },
      { n: "Kyler Murray", pos: "QB", proj: 16.4, pts: -0.38, started: false },
      { n: "Chig Okonkwo", pos: "TE", proj: 6.8, pts: 3.6, started: false }
    ],
    Hampton: [
      { n: "Drake Maye", pos: "QB", proj: 16.3, pts: 9.82, started: true },
      { n: "Jeremiyah Love", pos: "RB", proj: 13.9, pts: 13.0, started: true },
      { n: "Bucky Irving", pos: "RB", proj: 13.5, pts: 20.3, started: true },
      { n: "Jaxon Smith-Njigba", pos: "WR", proj: 19.0, pts: 26.2, started: true },
      { n: "Rashee Rice", pos: "WR", proj: 14.4, pts: 9.9, started: true },
      { n: "Trey McBride", pos: "TE", proj: 14.3, pts: 24.5, started: true },
      { n: "George Kittle", pos: "TE", proj: 8.4, pts: 3.2, started: true },
      { n: "Lions", pos: "DST", proj: 7.3, pts: 5.0, started: true },
      { n: "Evan McPherson", pos: "K", proj: 8.9, pts: 19.5, started: true },
      { n: "Michael Pittman Jr.", pos: "WR", proj: 12.3, pts: 8.8, started: false },
      { n: "Kenny Gainwell", pos: "RB", proj: 12.0, pts: 2.8, started: false },
      { n: "Aaron Jones Sr.", pos: "RB", proj: 10.4, pts: 10.0, started: false },
      { n: "KC Concepcion", pos: "WR", proj: 9.1, pts: 7.8, started: false },
      { n: "Patrick Mahomes", pos: "QB", proj: 15.5, pts: 21.66, started: false },
      { n: "Malik Washington", pos: "WR", proj: 6.2, pts: 6.3, started: false },
      { n: "Patriots", pos: "DST", proj: 4.7, pts: 7.0, started: false }
    ],
    Logan: [
      { n: "Bo Nix", pos: "QB", proj: 16.1, pts: 5.44, started: true },
      { n: "Bijan Robinson", pos: "RB", proj: 18.9, pts: 31.3, started: true },
      { n: "Kenneth Walker III", pos: "RB", proj: 14.7, pts: 34.1, started: true },
      { n: "George Pickens", pos: "WR", proj: 14.7, pts: 5.8, started: true },
      { n: "Tee Higgins", pos: "WR", proj: 13.0, pts: 8.9, started: true },
      { n: "Sam LaPorta", pos: "TE", proj: 11.0, pts: 9.8, started: true },
      { n: "Jaylen Waddle", pos: "WR", proj: 12.2, pts: 1.2, started: true },
      { n: "Rams", pos: "DST", proj: 6.2, pts: 1.0, started: true },
      { n: "Will Reichard", pos: "K", proj: 8.9, pts: 7.8, started: true },
      { n: "Jaylen Warren", pos: "RB", proj: 12.6, pts: 10.3, started: false },
      { n: "Carnell Tate", pos: "WR", proj: 12.0, pts: 7.8, started: false },
      { n: "J.K. Dobbins", pos: "RB", proj: 9.5, pts: 3.6, started: false },
      { n: "De'Zhaun Stribling", pos: "WR", proj: 9.6, pts: 0.0, started: false },
      { n: "Quentin Johnston", pos: "WR", proj: 10.4, pts: 3.7, started: false },
      { n: "Brian Robinson Jr.", pos: "RB", proj: 4.9, pts: 3.1, started: false },
      { n: "Caleb Douglas", pos: "WR", proj: 7.4, pts: 14.4, started: false }
    ],
    Evan: [
      { n: "Matthew Stafford", pos: "QB", proj: 17.5, pts: 4.1, started: true },
      { n: "Saquon Barkley", pos: "RB", proj: 17.7, pts: 9.0, started: true },
      { n: "Javonte Williams", pos: "RB", proj: 15.3, pts: 24.2, started: true },
      { n: "Puka Nacua", pos: "WR", proj: 21.1, pts: 12.4, started: true },
      { n: "Tetairoa McMillan", pos: "WR", proj: 14.8, pts: 10.5, started: true },
      { n: "Kyle Pitts Sr.", pos: "TE", proj: 9.8, pts: 0.0, started: true },
      { n: "Quinshon Judkins", pos: "RB", proj: 13.2, pts: 7.0, started: true },
      { n: "Broncos", pos: "DST", proj: 5.9, pts: 2.0, started: true },
      { n: "Jason Myers", pos: "K", proj: 9.9, pts: 6.6, started: true },
      { n: "TreVeyon Henderson", pos: "RB", proj: 0.0, pts: 0.0, started: false },
      { n: "Courtland Sutton", pos: "WR", proj: 11.7, pts: 3.1, started: false },
      { n: "Matthew Golden", pos: "WR", proj: 11.0, pts: 15.5, started: false },
      { n: "Blake Corum", pos: "RB", proj: 9.4, pts: 5.4, started: false },
      { n: "Khalil Shakir", pos: "WR", proj: 9.5, pts: 9.0, started: false },
      { n: "Devaughn Vele", pos: "WR", proj: 9.3, pts: 19.9, started: false },
      { n: "Jake Ferguson", pos: "TE", proj: 9.8, pts: 2.6, started: false }
    ]
  },
  2: {
    Noah: [
      { n: "Jalen Hurts", pos: "QB", proj: 19.9, pts: 16.16, started: true },
      { n: "Chase Brown", pos: "RB", proj: 15.4, pts: 11.2, started: true },
      { n: "Travis Etienne Jr.", pos: "RB", proj: 12.8, pts: 7.1, started: true },
      { n: "Amon-Ra St. Brown", pos: "WR", proj: 20.4, pts: 35.2, started: true },
      { n: "Christian Watson", pos: "WR", proj: 12.5, pts: 14.1, started: true },
      { n: "Tyler Warren", pos: "TE", proj: 11.4, pts: 14.4, started: true },
      { n: "Luther Burden III", pos: "WR", proj: 12.5, pts: 6.2, started: true },
      { n: "Eagles", pos: "DST", proj: 7.1, pts: 4.0, started: true },
      { n: "Ka'imi Fairbairn", pos: "K", proj: 10.4, pts: 8.2, started: true },
      { n: "Nico Collins", pos: "WR", proj: 0.0, pts: 0.0, started: false },
      { n: "Rico Dowdle", pos: "RB", proj: 10.1, pts: 6.4, started: false },
      { n: "Chuba Hubbard", pos: "RB", proj: 14.5, pts: 14.4, started: false },
      { n: "Romeo Doubs", pos: "WR", proj: 10.6, pts: 12.6, started: false },
      { n: "Tyler Allgeier", pos: "RB", proj: 7.1, pts: 3.9, started: false },
      { n: "Chiefs", pos: "DST", proj: 7.2, pts: 1.0, started: false },
      { n: "Woody Marks", pos: "RB", proj: 7.7, pts: 8.5, started: false }
    ],
    Evan: [
      { n: "Matthew Stafford", pos: "QB", proj: 18.2, pts: 26.98, started: true },
      { n: "Saquon Barkley", pos: "RB", proj: 17.6, pts: 3.0, started: true },
      { n: "Javonte Williams", pos: "RB", proj: 16.7, pts: 8.0, started: true },
      { n: "Tetairoa McMillan", pos: "WR", proj: 13.6, pts: 15.1, started: true },
      { n: "Matthew Golden", pos: "WR", proj: 10.8, pts: 9.8, started: true },
      { n: "Kyle Pitts Sr.", pos: "TE", proj: 10.4, pts: 2.5, started: true },
      { n: "Jake Ferguson", pos: "TE", proj: 9.6, pts: 20.3, started: true },
      { n: "Broncos", pos: "DST", proj: 6.3, pts: 9.0, started: true },
      { n: "Jason Myers", pos: "K", proj: 9.9, pts: 7.3, started: true },
      { n: "Puka Nacua", pos: "WR", proj: 0.0, pts: 0.0, started: false },
      { n: "Quinshon Judkins", pos: "RB", proj: 12.0, pts: 9.8, started: false },
      { n: "TreVeyon Henderson", pos: "RB", proj: 9.3, pts: 13.6, started: false },
      { n: "Courtland Sutton", pos: "WR", proj: 12.0, pts: 5.5, started: false },
      { n: "Blake Corum", pos: "RB", proj: 9.7, pts: 10.2, started: false },
      { n: "Khalil Shakir", pos: "WR", proj: 10.3, pts: 6.8, started: false },
      { n: "Devaughn Vele", pos: "WR", proj: 9.5, pts: 11.4, started: false }
    ],
    Seth: [
      { n: "Lamar Jackson", pos: "QB", proj: 21.7, pts: 14.8, started: true },
      { n: "Jahmyr Gibbs", pos: "RB", proj: 24.2, pts: 23.3, started: true },
      { n: "Tony Pollard", pos: "RB", proj: 11.1, pts: 7.5, started: true },
      { n: "Drake London", pos: "WR", proj: 12.9, pts: 8.9, started: true },
      { n: "DK Metcalf", pos: "WR", proj: 12.2, pts: 6.7, started: true },
      { n: "Dallas Goedert", pos: "TE", proj: 10.8, pts: 1.4, started: true },
      { n: "Jameson Williams", pos: "WR", proj: 12.3, pts: 5.3, started: true },
      { n: "Ravens", pos: "DST", proj: 6.9, pts: 5.0, started: true },
      { n: "Cam Little", pos: "K", proj: 8.6, pts: 7.7, started: true },
      { n: "Zay Flowers", pos: "WR", proj: 0.0, pts: 0.0, started: false },
      { n: "Jonathon Brooks", pos: "RB", proj: 8.7, pts: 2.1, started: false },
      { n: "Jakobi Meyers", pos: "WR", proj: 9.8, pts: 3.8, started: false },
      { n: "Josh Downs", pos: "WR", proj: 9.4, pts: 14.2, started: false },
      { n: "Tyjae Spears", pos: "RB", proj: 8.7, pts: 9.0, started: false },
      { n: "Dak Prescott", pos: "QB", proj: 20.0, pts: 29.76, started: false },
      { n: "Jacob Saylors", pos: "RB", proj: 0.0, pts: 0.0, started: false }
    ],
    Reese: [
      { n: "Brock Purdy", pos: "QB", proj: 20.6, pts: 28.48, started: true },
      { n: "Omarion Hampton", pos: "RB", proj: 15.8, pts: 17.5, started: true },
      { n: "David Montgomery", pos: "RB", proj: 14.2, pts: 4.4, started: true },
      { n: "CeeDee Lamb", pos: "WR", proj: 18.0, pts: 35.3, started: true },
      { n: "Chris Olave", pos: "WR", proj: 15.9, pts: 22.6, started: true },
      { n: "Dalton Kincaid", pos: "TE", proj: 10.4, pts: 22.5, started: true },
      { n: "D'Andre Swift", pos: "RB", proj: 13.5, pts: 12.9, started: true },
      { n: "Buccaneers", pos: "DST", proj: 8.2, pts: 4.0, started: true },
      { n: "Brandon Aubrey", pos: "K", proj: 11.1, pts: 16.9, started: true },
      { n: "DeVonta Smith", pos: "WR", proj: 14.0, pts: 27.7, started: false },
      { n: "Parker Washington", pos: "WR", proj: 12.2, pts: 16.8, started: false },
      { n: "Tucker Kraft", pos: "TE", proj: 10.6, pts: 3.5, started: false },
      { n: "Trevor Lawrence", pos: "QB", proj: 15.9, pts: 6.16, started: false },
      { n: "Jalen Coker", pos: "WR", proj: 11.9, pts: 14.6, started: false },
      { n: "Steelers", pos: "DST", proj: 6.0, pts: 8.0, started: false },
      { n: "Giants", pos: "DST", proj: 3.2, pts: -1.0, started: false }
    ],
    Brandon: [
      { n: "Joe Burrow", pos: "QB", proj: 16.5, pts: 16.18, started: true },
      { n: "Derrick Henry", pos: "RB", proj: 17.6, pts: 17.7, started: true },
      { n: "Breece Hall", pos: "RB", proj: 15.8, pts: 14.2, started: true },
      { n: "Ja'Marr Chase", pos: "WR", proj: 19.0, pts: 26.5, started: true },
      { n: "Malik Nabers", pos: "WR", proj: 14.9, pts: 1.1, started: true },
      { n: "Mark Andrews", pos: "TE", proj: 10.4, pts: 10.9, started: true },
      { n: "Cam Skattebo", pos: "RB", proj: 12.8, pts: 9.5, started: true },
      { n: "Jaguars", pos: "DST", proj: 4.2, pts: 1.0, started: true },
      { n: "Harrison Mevis", pos: "K", proj: 9.9, pts: 3.0, started: true },
      { n: "Terry McLaurin", pos: "WR", proj: 12.4, pts: 7.0, started: false },
      { n: "Josh Jacobs", pos: "RB", proj: 0.0, pts: 0.0, started: false },
      { n: "Brian Thomas Jr.", pos: "WR", proj: 9.7, pts: 7.0, started: false },
      { n: "Makai Lemon", pos: "WR", proj: 9.0, pts: 1.9, started: false },
      { n: "Travis Kelce", pos: "TE", proj: 10.5, pts: 25.1, started: false },
      { n: "Jacory Croskey-Merritt", pos: "RB", proj: 10.2, pts: 5.8, started: false },
      { n: "Jayden Reed", pos: "WR", proj: 10.0, pts: 1.4, started: false }
    ],
    JD: [
      { n: "Jayden Daniels", pos: "QB", proj: 19.8, pts: 14.74, started: true },
      { n: "Jonathan Taylor", pos: "RB", proj: 18.4, pts: 29.2, started: true },
      { n: "De'Von Achane", pos: "RB", proj: 17.1, pts: 12.3, started: true },
      { n: "Emeka Egbuka", pos: "WR", proj: 13.8, pts: 10.3, started: true },
      { n: "DJ Moore", pos: "WR", proj: 12.6, pts: -0.1, started: true },
      { n: "Isaiah Likely", pos: "TE", proj: 11.0, pts: 8.3, started: true },
      { n: "Kyren Williams", pos: "RB", proj: 14.5, pts: 15.7, started: true },
      { n: "Bears", pos: "DST", proj: 6.6, pts: 8.0, started: true },
      { n: "Cairo Santos", pos: "K", proj: 9.5, pts: 4.0, started: true },
      { n: "Mike Evans", pos: "WR", proj: 13.0, pts: 8.4, started: false },
      { n: "Alec Pierce", pos: "WR", proj: 11.0, pts: 2.1, started: false },
      { n: "Michael Wilson", pos: "WR", proj: 10.0, pts: 3.8, started: false },
      { n: "Jordan Addison", pos: "WR", proj: 10.6, pts: 4.1, started: false },
      { n: "Kyle Monangai", pos: "RB", proj: 9.8, pts: 7.8, started: false },
      { n: "Emmett Johnson", pos: "RB", proj: 6.5, pts: 5.5, started: false },
      { n: "Chris Brooks", pos: "RB", proj: 9.6, pts: 3.6, started: false }
    ],
    Matthew: [
      { n: "Caleb Williams", pos: "QB", proj: 19.4, pts: 7.72, started: true },
      { n: "Christian McCaffrey", pos: "RB", proj: 21.5, pts: 22.6, started: true },
      { n: "Ashton Jeanty", pos: "RB", proj: 18.3, pts: 10.3, started: true },
      { n: "Ladd McConkey", pos: "WR", proj: 14.5, pts: 6.5, started: true },
      { n: "Stefon Diggs", pos: "WR", proj: 10.3, pts: 21.7, started: true },
      { n: "Colston Loveland", pos: "TE", proj: 11.4, pts: 1.3, started: true },
      { n: "Jadarian Price", pos: "RB", proj: 13.2, pts: 5.0, started: true },
      { n: "49ers", pos: "DST", proj: 6.6, pts: 9.0, started: true },
      { n: "Eddy Pineiro", pos: "K", proj: 10.4, pts: 5.0, started: true },
      { n: "Rome Odunze", pos: "WR", proj: 11.7, pts: 7.3, started: false },
      { n: "Marvin Harrison Jr.", pos: "WR", proj: 9.3, pts: 0.0, started: false },
      { n: "Chris Godwin Jr.", pos: "WR", proj: 10.0, pts: 8.8, started: false },
      { n: "Justin Herbert", pos: "QB", proj: 19.5, pts: 7.88, started: false },
      { n: "Texans", pos: "DST", proj: 6.2, pts: 7.0, started: false },
      { n: "Mike Washington Jr.", pos: "RB", proj: 3.8, pts: 0.7, started: false },
      { n: "Michael Mayer", pos: "TE", proj: 10.0, pts: 5.3, started: false }
    ],
    Mirsky: [
      { n: "Josh Allen", pos: "QB", proj: 22.7, pts: 40.82, started: true },
      { n: "James Cook III", pos: "RB", proj: 18.6, pts: 20.9, started: true },
      { n: "Rhamondre Stevenson", pos: "RB", proj: 12.9, pts: 3.6, started: true },
      { n: "Justin Jefferson", pos: "WR", proj: 18.4, pts: 8.5, started: true },
      { n: "Garrett Wilson", pos: "WR", proj: 15.9, pts: 16.7, started: true },
      { n: "Harold Fannin Jr.", pos: "TE", proj: 10.0, pts: 10.4, started: true },
      { n: "Davante Adams", pos: "WR", proj: 15.5, pts: 39.5, started: true },
      { n: "Seahawks", pos: "DST", proj: 7.6, pts: 10.0, started: true },
      { n: "Cameron Dicker", pos: "K", proj: 10.3, pts: 2.0, started: true },
      { n: "Bhayshul Tuten", pos: "RB", proj: 10.1, pts: 14.2, started: false },
      { n: "Wan'Dale Robinson", pos: "WR", proj: 9.5, pts: 1.9, started: false },
      { n: "MarShawn Lloyd", pos: "RB", proj: 11.2, pts: 8.6, started: false },
      { n: "Jaxson Dart", pos: "QB", proj: 18.2, pts: 0.8, started: false },
      { n: "Xavier Worthy", pos: "WR", proj: 11.0, pts: 13.5, started: false },
      { n: "Deebo Samuel Sr.", pos: "WR", proj: 12.0, pts: 6.5, started: false },
      { n: "Ray Davis", pos: "RB", proj: 3.3, pts: 0.0, started: false }
    ],
    Hampton: [
      { n: "Patrick Mahomes", pos: "QB", proj: 18.2, pts: 28.98, started: true },
      { n: "Jeremiyah Love", pos: "RB", proj: 12.9, pts: 7.5, started: true },
      { n: "Bucky Irving", pos: "RB", proj: 14.6, pts: 13.0, started: true },
      { n: "Jaxon Smith-Njigba", pos: "WR", proj: 18.5, pts: 42.5, started: true },
      { n: "Rashee Rice", pos: "WR", proj: 15.0, pts: 12.3, started: true },
      { n: "Trey McBride", pos: "TE", proj: 14.5, pts: 18.1, started: true },
      { n: "Aaron Jones Sr.", pos: "RB", proj: 14.1, pts: 10.5, started: true },
      { n: "Patriots", pos: "DST", proj: 6.6, pts: 20.0, started: true },
      { n: "Evan McPherson", pos: "K", proj: 8.4, pts: 12.8, started: true },
      { n: "Drake Maye", pos: "QB", proj: 18.2, pts: 8.02, started: false },
      { n: "George Kittle", pos: "TE", proj: 10.5, pts: 18.0, started: false },
      { n: "Michael Pittman Jr.", pos: "WR", proj: 0.0, pts: 0.0, started: false },
      { n: "Kenny Gainwell", pos: "RB", proj: 9.6, pts: 4.5, started: false },
      { n: "KC Concepcion", pos: "WR", proj: 9.5, pts: 8.2, started: false },
      { n: "Malik Washington", pos: "WR", proj: 7.5, pts: 8.7, started: false },
      { n: "Kaelon Black", pos: "RB", proj: 8.3, pts: 2.5, started: false }
    ],
    Logan: [
      { n: "Jared Goff", pos: "QB", proj: 17.0, pts: 29.78, started: true },
      { n: "Bijan Robinson", pos: "RB", proj: 22.9, pts: 11.1, started: true },
      { n: "Kenneth Walker III", pos: "RB", proj: 17.8, pts: 23.8, started: true },
      { n: "George Pickens", pos: "WR", proj: 14.8, pts: 10.0, started: true },
      { n: "Tee Higgins", pos: "WR", proj: 12.3, pts: 14.5, started: true },
      { n: "Sam LaPorta", pos: "TE", proj: 11.3, pts: 17.2, started: true },
      { n: "Jaylen Waddle", pos: "WR", proj: 12.2, pts: 21.8, started: true },
      { n: "Rams", pos: "DST", proj: 5.7, pts: 11.0, started: true },
      { n: "Will Reichard", pos: "K", proj: 9.0, pts: 12.3, started: true },
      { n: "Jaylen Warren", pos: "RB", proj: 11.4, pts: 9.7, started: false },
      { n: "Carnell Tate", pos: "WR", proj: 11.4, pts: 5.7, started: false },
      { n: "J.K. Dobbins", pos: "RB", proj: 12.6, pts: 3.6, started: false },
      { n: "Quentin Johnston", pos: "WR", proj: 9.9, pts: 2.4, started: false },
      { n: "Bo Nix", pos: "QB", proj: 18.6, pts: 14.12, started: false },
      { n: "Caleb Douglas", pos: "WR", proj: 9.4, pts: 3.9, started: false },
      { n: "Antonio Williams", pos: "RB", proj: 6.0, pts: 5.4, started: false }
    ]
  }
};

// Editorial storylines, written using real Week-2 NFL context. Purely
// optional flavor text layered on top of the automatic MVP/Bust/recap
// system — add a new week's entries here if you want the same treatment.
const STORYLINES = {
  2: {
    league: "Two prime-time games shaped half the league this week: Buffalo's 41-31 Thursday-night win over Detroit in the brand-new Highmark Stadium (Josh Allen, Dalton Kincaid, Jared Goff and an injured DJ Moore all factored into four different matchups), and the Rams' 28-6 Monday-night rout of the Giants, where Davante Adams and Matthew Stafford feasted after Puka Nacua was ruled out with a groin injury.",
    teams: {
      Mirsky: "Josh Allen threw three touchdowns and ran for two more in Buffalo's Thursday-night win over Detroit — 40.82 points, even after WR1 DJ Moore left with a shoulder injury. Davante Adams added 39.5 more in the Rams' Monday-night rout of the Giants, stepping into a bigger role after Puka Nacua was ruled out. Two prime-time monsters, one 152.42-point week.",
      Reese: "Benching Trevor Lawrence for Brock Purdy and starting Dalton Kincaid over Tucker Kraft paid off immediately — Kincaid caught a season-high 7 passes for 95 yards and a touchdown in that same Bills-Lions shootout, while CeeDee Lamb (35.3) and Chris Olave (22.6) did the rest. The best-optimized lineup in the league this week: 164.58 points.",
      Hampton: "The week's high score belongs to Hampton, and it isn't close. Jaxon Smith-Njigba topped his Week 1 explosion with a 42.5-point demolition of Arizona, proving quarterback-proof behind backup Drew Lock in Seattle's 31-7 win. Add a Patriots defense that shut out Pittsburgh's offense in a 20-3 win, and Hampton set the new bar for the season at 165.68.",
      Logan: "The Bo Nix-to-Jared Goff waiver swap looks like a heist already. Goff threw four touchdowns for 327 yards against Buffalo's Thursday-night onslaught — a losing effort, but still 29.78 fantasy points. Jaylen Waddle quietly added 21.8 of his own, good for 151.48 on the week.",
      Noah: "After watching Christian Watson explode for 32.7 points on the bench in Week 1, Noah learned the lesson and started him — no repeat fireworks, but a steady 14.1 helped anyway. The real story was Amon-Ra St. Brown, the only good thing about Detroit's Thursday-night collapse, torching Buffalo's secondary for 35.2 points in the loss.",
      Evan: "Puka Nacua was ruled out Monday night with a groin injury, and Matthew Stafford made the most of what was left, good for 26.98 points in the Rams' 28-6 beatdown of the Giants. Jake Ferguson chipped in 20.3 at flex, more than enough to cover a quiet 3.0-point day from a questionable Saquon Barkley.",
      Seth: "A rough one. Zay Flowers was ruled out and never suited up, Dallas Goedert (doubtful) managed just 1.4 points, and Lamar Jackson was held in check in a loss to New Orleans. The gut punch: Dak Prescott, sitting on Seth's own bench, dropped 29.76 points in Dallas's win over Washington. 80.60 points, second-worst in the league.",
      Brandon: "Ja'Marr Chase erased a miserable 3.2-point Week 1 with a 26.5-point outburst in Cincinnati's 20-6 win over Houston — with Joe Burrow playing through a back injury he insisted wouldn't keep him out. The one that got away: Travis Kelce, parked on Brandon's bench, quietly put up 25.1 points of his own.",
      JD: "DJ Moore left Buffalo's Thursday-night win with a shoulder injury just before the half, turning a 12.6-point projection into a -0.1 disaster and dragging down an otherwise strong week. Jonathan Taylor's 29.2 kept things afloat.",
      Matthew: "A week after dropping 59 points on Carolina, Caleb Williams and the Bears ran into a buzzsaw — Minnesota's defense held Chicago to just 3 points in a 9-3 slog, and Williams's 7.72 (against a 19.4 projection) was the clearest reminder all week that matchups matter as much as talent. Christian McCaffrey's 22.6 did what it could to hold the roster together."
    }
  }
};

const PLAYOFF_TEAMS = 6;
const BYE_SEEDS = 2;
const REGULAR_SEASON_WEEKS = 14;
const PLAYOFF_WEEKS = [15, 16, 17];
