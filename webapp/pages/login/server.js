import sqlite from "better-sqlite3";

export default function(app, L, do404, rootdir){

  //the login form, before submission:
  app.get("/login", function(req, res){
    const username=req.cookies.username;
    const sessionKey=req.cookies.sessionkey;
    let loggedIn=false;
    
    const redirTo=req.query.to || `/${req.params.uilang}`;
    const db=new sqlite("../databases/assets.sqlite", {fileMustExist: true});
    try{
      { //check if the user is already logged in:
        let yesterday=(new Date()); yesterday.setHours(yesterday.getHours()-24); yesterday=yesterday.toISOString();
        const sql=`select username from users where username=$username and sessionKey=$sessionKey and lastSeen>=$yesterday`;
        const stmt=db.prepare(sql);
        stmt.all({username, sessionKey, yesterday}).map(row => { loggedIn=true; });
      }
    } catch(e){
      console.log(e);
    } finally {
      db.close();
    }

    if(loggedIn){
      res.redirect(`/${req.params.uilang}/`);
    } else {
      res.render("login/view.ejs", {
        L: multistring => L("gd", multistring),

        loginFailed: false,
        redirTo,
        username: "",
        password: "",
      });
    }

  });

  //the login form, after submission:
  app.post("/login", function(req, res){

    let loggedIn = false;
    const username = req.body.username;
    const password = req.body.password;
    const passwordHash = app.hash(password);

    const sessionKey=generateKey();
    const now=(new Date()).toISOString();
    const redirTo=req.body.redirTo || `/`;
    
    const db=new sqlite("../databases/assets.sqlite", {fileMustExist: true});
    let loginFailed = true; 
    try{
      let userROWID = 0;
      { //check if email and password match:
        const sql=`select username from users where username=$username and passwordHash=$passwordHash`;
        const stmt=db.prepare(sql);
        stmt.all({username, passwordHash}).map(row => { loginFailed = false; loggedIn=true; });
      }
      if(!loginFailed){ //if they do, tell the DB the user is logged in:
        {
          const sql=`update users set sessionKey=$sessionKey, lastSeen=$now where username=$username`;
          const stmt=db.prepare(sql);
          stmt.run({username, sessionKey, now});
        }
      }
    } catch(e){
      console.log(e);
    } finally {
      db.close();
    }
    
    if(!loginFailed){ //if login successful, set cookie and redirect:
      const oneday=86400000; //86,400,000 miliseconds = 24 hours
      res.cookie("username", username, {expires: new Date(Date.now() + oneday)});
      res.cookie("sessionkey", sessionKey, {expires: new Date(Date.now() + oneday)});
      res.redirect(redirTo);
    } else { //if login failed, display the login form again: 
      res.render("login/view.ejs", {
        L: (multistring, subpart) => L("gd", multistring, subpart),
        
        loginFailed,
        redirTo,
        username,
        password,
      });
    }
  });
}

function generateKey(){
  var alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var key="";
  while(key.length<32) {
    var i=Math.floor(Math.random() * alphabet.length);
    key+=alphabet[i]
  }
  return key;
}