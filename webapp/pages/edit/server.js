import sqlite from "better-sqlite3";

export default function(app, L, do404, rootdir){

  app.get("/edit", function(req, res){
    const nickname=req.query.nickname;
    const returnUrl=req.query.returnUrl;
    let type, value, value_gd, value_en;

    const db=new sqlite("../databases/assets.sqlite", {fileMustExist: true});
    try{
      const sql=`select type, value, value_gd, value_en from assets where nickname=$nickname`;
      const stmt=db.prepare(sql);
      stmt.all({nickname}).map(row => {
        type = row['type'];
        value = row['value'];
        value_gd = row['value_gd'];
        value_en = row['value_en'];
      });
    } catch(e){
      console.log(e);
    } finally {
      db.close();
    }

    res.render("edit/view.ejs", {
      L: (multistring, subpart) => L("gd", multistring, subpart),
      nickname, returnUrl, type, value, value_gd, value_en,
    });
  });

  app.post("/edit", function(req, res){
    const nickname=req.body.nickname;
    const returnUrl=req.body.returnUrl;
    const type=req.body.type;
    const value=req.body.value;
    const value_gd=req.body.value_gd;
    const value_en=req.body.value_en;
  
    const db=new sqlite("../databases/assets.sqlite", {fileMustExist: true});
   try{
      const sql=`update assets set value=$value, value_gd=$value_gd, value_en=$value_en where nickname=$nickname`;
      const stmt=db.prepare(sql);
      stmt.run({nickname, value, value_gd, value_en});
    } catch(e){
      console.log(e);
    } finally {
      db.close();
    }

    // res.redirect("/edit?nickname="+encodeURIComponent(nickname));
    res.redirect(returnUrl);
  });
}
