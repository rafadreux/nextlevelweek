const express = require("express")
const server = express()

//pegar o banco de dados
const db = require("./database/db.js")

//configurar pasta pública
server.use(express.static("public"))

//habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({ extended: true }))

//utilizando o template nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

//Configurar caminhos da minha aplicação

//página inicial
//req é uma Requisição; res é uma Resposta
server.get("/", (req, res) => {
    return res.render("index.html")
})

server.get("/create-point", (req, res) => {
    // req.query: Query strings da nossa url
    //console.log(req.query)

    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {

    //req.body: corpo do nosso formulário    
    //console.log(req.body)

    //inserir dados no banco de dados
    const query = `
        INSERT INTO places (
            name,
            image,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
`    
    
    const values = [
        req.body.name,
        req.body.image,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err){
        if(err) {
            console.log(err)
            return res.send("Erro no cadastro!")
        }
        console.log("Cadastrado com sucesso!")
        console.log(this)

        return res.render("create-point.html", { saved: true })
    }

    db.run(query, values, afterInsertData)

})

server.get("/search-results", (req, res) => {

    const search = req.query.search

    if (search == "") {
        //pesquisa vazia
        return res.render("search-results.html", { total: 0 })

    }

    // pegar os dados no banco de dados
    db.all(`SELECT * FROM places WHERE state = '${search}' or city LIKE '%${search}%'`,function(err,rows){
        if(err) {
            return console.log(err)
        }
        console.log(rows)
        const total = rows.length

        //mostrar a página html com os dados do banco de dados
        return res.render("search-results.html", {places: rows, total})
        })
})

//ligar o servidor
server.listen(3000)