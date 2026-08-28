import sqlite from "better-sqlite3";
import scoreboardParser from "../../includes/scoreboard/parser.js";

export default function(app, L, do404, rootdir){

  app.get("/", function(req, res){
    res.redirect("/gd");
  });

  app.get("/:uilang(gd|en)/", function(req, res){
    let loggedIn=false;
    let scoreboard=[];

    const db=new sqlite("../databases/assets.sqlite", {fileMustExist: true});
    try {
      { //check if the user is logged in:
        let yesterday=(new Date()); yesterday.setHours(yesterday.getHours()-24); yesterday=yesterday.toISOString();
        const sql=`select username from users where username=$username and sessionKey=$sessionKey and lastSeen>=$yesterday`;
        const stmt=db.prepare(sql);
        stmt.all({username: req.cookies.username, sessionKey: req.cookies.sessionkey, yesterday}).map(row => { loggedIn=true; });
      }
      { //get this page's assets:
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
      loggedIn,
      scoreboard,
    });
  });
  
}