import sqlite from "better-sqlite3";

export default function(app, L, do404, rootdir){

  app.get("/logout", function(req, res){
    const username=req.cookies.username;
    const sessionKey=req.cookies.sessionkey;

    const redirTo=req.query.to || `/`;
    const db=new sqlite("../databases/assets.sqlite", {fileMustExist: true});
    try{
      {
        const sql=`update users set sessionKey=NULL where username=$username`;
        const stmt=db.prepare(sql);
        stmt.run({username, sessionKey});
      }
    } catch(e){
      console.log(e);
    } finally {
      db.close();
    }

    res.clearCookie("username");
    res.clearCookie("sessionkey");
    res.redirect(redirTo);
  });

}
