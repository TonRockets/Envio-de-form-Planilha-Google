const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const googleSpreadSheet = require('google-spreadsheet')
const credentials = require('./bug-tracker-264723-5da27098ddee.json')
const { promisify } = require('util')
const sgMail = require('@sendgrid/mail')


const SENDGRID_API_KEY = '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'
const worksheetIndex = 0
const docId = '154y1uFatsAIafXSIX2TmhbfsWSbY56-Myz73M4Kq4og'

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('home')
})

app.post('/', async (req, res) => {
    try {
        const doc = new googleSpreadSheet(docId)
        await promisify(doc.useServiceAccountAuth)(credentials)
        const info = await promisify(doc.getInfo)()
        const worksheet = info.worksheets[worksheetIndex]
        await promisify(worksheet.addRow)({
            nome: req.body.name,
            email: req.body.email,
            classificacao: req.body.issueType,
            origem: req.body.origem || 'Ao abrir o app',
            comoReproduzirErro: req.body.howToProduce,
            saidaEsperada: req.body.expectedOutput,
            saidaRecebida: req.body.receiveOutput,
            userAgent: req.body.userAgent,
            userDate: req.body.userDate
        })

        if (req.body.issueType === 'CRITICAL') {
            sgMail.setApiKey(SENDGRID_API_KEY);
            const msg = {
                to: 'bboyskyfall@gmail.com',
                from: req.body.email,
                subject: 'Reporte URGENTE de erro',
                text: "vfdsfd",
                html: `O usuário: <strong>${req.body.name}</strong> reportou o seguinte erro: Erro reportado com as seguintes características: ${req.body.name}, ${req.body.email}, ${req.body.userAgent}, ${req.body.userDate}, ${req.body.origem}`,
            }
           await sgMail.send(msg);
        }
        res.send('Reportado com sucesso!')

    } catch (err) {
        res.send('Erro ao reportar bug!')
        console.log(err)
    }
})


// app.get('/soma', (req, res) => {
//     const a = parseInt(req.query.a)
//     const b = parseInt(req.query.b)
//     const soma = a + b
//     res.send('A soma é: ' + soma)
// })






app.listen(3000, (err) => {
    if (err) {
        console.log(`Erro detectado: ${err}`)
    } else {
        console.log('Aplicação rodando na porta 3000, url: http://localhost:3000')
    }
})


// res.send({
//     data:[
//         {id: 1},
//         {id: 2}
//     ]
// })