import sqlite from "better-sqlite3";

export default function(app, L, do404, rootdir){

  const slugRegex = "(" + L("gd", "#aboutslug") + "|" + L("en", "#aboutslug") + ")";

  app.get("/:uilang(gd|en)/"+slugRegex, function(req, res){
    let prose="";

    const db=new sqlite("../databases/assets.sqlite", {fileMustExist: true});
    try{
      const sql=`select nickname, value_${req.params.uilang} as value from assets where nickname in ('about')`;
      const stmt=db.prepare(sql);
      stmt.all().map(row => {
        prose = row['value'];
        prose = app.doMarkdown(prose);
      });
    } catch(e){
      console.log(e);
    } finally {
      db.close();
    }



    res.render("about/view.ejs", {
      uilang: req.params.uilang,
      L: (multistring, subpart) => L(req.params.uilang, multistring, subpart),
      pageTitle: L(req.params.uilang, "#about"),
      pageDescription: L(req.params.uilang, "#abouttagline"),
      section: "about",
      pageUrls: {
        "gd": "/gd/" + L("gd", "#aboutslug"),
        "en": "/en/" + L("en", "#aboutslug"),
      },
      prose,
    });
  });
  
}