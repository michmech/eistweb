import sqlite from "better-sqlite3";
import scoreboardParser from "../../includes/scoreboard/parser.js";

export default function(app, L, do404, rootdir){

  app.get("/", function(req, res){
    res.redirect("/gd");
  });

  app.get("/:uilang(gd|en)/", function(req, res){
    let scoreboard=[];

    const db=new sqlite("../databases/assets.sqlite", {fileMustExist: true});
    try {
      {
        const sql=`select nickname, value from assets where nickname in ('llmscoreboard')`;
        const stmt=db.prepare(sql);
        stmt.all().map(row => {
          scoreboard = row['value'];
          scoreboard = scoreboardParser.parse(scoreboard);
        });
      }
    } catch(e){
      console.log(e);
    } finally {
      db.close();
    }

    res.render("home/view.ejs", {
      uilang: req.params.uilang,
      L: (multistring, subpart) => L(req.params.uilang, multistring, subpart),
      pageTitle: L(req.params.uilang, "#siteshortname"),
      pageDescription: L(req.params.uilang, "#siteshortname") + " – " + L(req.params.uilang, "#sitelongname"),
      section: "home",
      pageUrls: {
        "gd": "/gd",
        "en": "/en",
      },
      scoreboard,
    });
  });
  
}