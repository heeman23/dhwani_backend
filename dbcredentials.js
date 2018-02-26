
exports.getDataBaseConnection=function(mysql) {

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "chamasari1234",
        database: "mydb",
    });
    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");

    });
    return con;
}
