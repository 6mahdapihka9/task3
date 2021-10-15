const fs = require("fs");
const path = require('path');
const makeID = require('../heplers/id.generator');


const createNoteService = (req, res) => {
    if(!req.body)
        return res.sendStatus(400);

    let data = fs.readFileSync(path.join(__dirname, "../users.json"), "utf8"), users = JSON.parse(data);

    let user = {
        id: Math.max.apply(Math,users.map(function(o){return o.id;})) + 1,
        login: req.body.login,
        name: req.body.name,
        age: req.body.age,
        pass: req.body.pass,
        session: makeID(10)
    };

    for(let i = 0; i < users.length; i++)
        if(users[i].login === user.login) {

            return res.status(400).send(`
                <h1>
                    There is user with this login!
                </h1>
                <p>Try other login.</p>
                <script>
                    document.cookie = "session=0; max-age=0";
                    setTimeout(()=>{window.open("/registration")},3000);
                </script>
            `);
        }


    users.push(user);
    data = JSON.stringify(users);
    fs.writeFileSync(path.join(__dirname, "../users.json"), data);


    res.send(`
        <h1>Successful operation!</h1>
            <p>Redirecting to dashboard.</p>
        <script src="scripts/redirect.to.dashboard.js"></script>
    `);


};


module.exports = { createNoteService };
