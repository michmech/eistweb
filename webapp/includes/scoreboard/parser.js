export default {
  parse: (scoreboardString) => {
    const rows = [];

    scoreboardString = scoreboardString.replace(/\r/g, '');
    scoreboardString.split('\n').forEach((line) => {
      const row = {rank: 0, modelName: "", score: 0, grade: 0};
      line = line.replace(/[0-9\.]+\s*$/, ($0) => {
        row.score = $0.trim();
        return "";
      });
      row.modelName = line.trim();
      rows.push(row);
    });

    //assign ranks:
    {
      let rank = 1;
      let lastScore = rows[0].score;
      rows.map(row => {
        if(row.modelName != "human"){
          if(row.score != lastScore) rank++;
          row.rank = rank;
          lastScore = row.score;
        }
      });
    }

    //assign colour grades;
    rows.map(row => {
      row.grade = 7;
      if(row.score >= 25) row.grade = 6;
      if(row.score >= 35) row.grade = 5;
      if(row.score >= 45) row.grade = 4;
      if(row.score >= 55) row.grade = 3;
      if(row.score >= 65) row.grade = 2;
      if(row.score >= 75) row.grade = 1;
    });

    return rows;
  },
}
